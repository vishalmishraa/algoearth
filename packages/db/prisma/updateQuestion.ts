import { LANGUAGE_MAPPING } from "@repo/common/language";
import fs from "fs";
import prismaClient from "../src/index";
const MOUNT_PATH = process.env.MOUNT_PATH ?? "../../../apps/problems";

/*

DETAILS ABOUT RETRY LOGIC : 

we implemented retry logic because when we are trying to upsert a problem or default code,
it may happen that the prisma client is not able to connect to the database and it throws an error.
In such cases, we are retrying the operation for a maximum of 3 times with a delay of 1 second between each retry.
If the operation is successful within 3 retries, then we return the result.
If the operation fails even after 3 retries, then we throw an error.

*/
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second


function promisifedReadFile(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(path, "utf8", (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}

async function upsertProblemWithRetry(problemSlug: string, problemStatement: string, tagsArray: string[]) {
    let retries = 0;

    while (retries < MAX_RETRIES) {
        try {
            const connectOrCreateTags = tagsArray.map(tag => ({
                where: { name: tag },
                create: { name: tag }
            }));

            const problem = await prismaClient.problem.upsert({
                where: {
                    slug: problemSlug,
                },
                create: {
                    title: problemSlug.replace(/-/g, ' '),
                    slug: problemSlug,
                    description: problemStatement,
                    hidden: false,
                    tags: {
                        connectOrCreate: connectOrCreateTags
                    }
                },
                update: {
                    title: problemSlug.replace(/-/g, ' '),
                    slug: problemSlug,
                    description: problemStatement,
                    tags: {
                        connectOrCreate: connectOrCreateTags
                    }
                },
            });

            return problem;
        } catch (error: any) {
            if (error.code === 'P2024') {
                retries++;
                console.log(`Retrying upsert operation for problem (${retries}/${MAX_RETRIES})...`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            } else if (error.code == 'P2002' && error.meta.modelName == 'Problem' &&  error.meta.target[0] == 'name' ) {
                throw new Error("Tag exist");
            }else{

                throw error;
            }
        }
    }

    throw new Error('Failed to upsert problem after multiple retries.');
}

async function upsertDefaultCodeWithRetry(problemId: string, language: string, code: string) {
    let retries = 0;

    while (retries < MAX_RETRIES) {
        try {
            await prismaClient.defaultCode.upsert({
                where: {
                    problemId_languageId: {
                        problemId,
                        languageId: LANGUAGE_MAPPING[language].internal,
                    },
                },
                create: {
                    problemId,
                    languageId: LANGUAGE_MAPPING[language].internal,
                    code,
                },
                update: {
                    code,
                },
            });

            return;
        } catch (error: any) {
            if (error.code === 'P2024') {
                retries++;
                console.log(`Retrying upsert operation for default code (${retries}/${MAX_RETRIES})...`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            } else {
                throw error;
            }
        }
    }

    throw new Error('Failed to upsert default code after multiple retries.');
}

async function main(problemSlug: string) {
    try {
        const problemStatement = await promisifedReadFile(
            `${MOUNT_PATH}/${problemSlug}/Problem.md`
        );
        const tags = await promisifedReadFile(
            `${MOUNT_PATH}/${problemSlug}/tags.md`
        );

        const tagsArray = tags.split("\n").map(tag => tag.trim());

        const problem = await upsertProblemWithRetry(problemSlug, problemStatement, tagsArray);

        await Promise.all(
            Object.keys(LANGUAGE_MAPPING).map(async (language) => {
                const code = await promisifedReadFile(
                    `${MOUNT_PATH}/${problemSlug}/boilerplate/function.${language}`
                );
                await upsertDefaultCodeWithRetry(problem.id, language, code);
            })
        );
    } catch (error: any) {
        console.error('Error in main function:', error);
    }
}

export function addProblemsInDB() {
    fs.readdir(MOUNT_PATH, (err, dirs) => {
        if (err) {
            console.error("Error reading directory:", err);
            return;
        }
        dirs.forEach(async (dir) => {
            await main(dir);
        });
    });
}