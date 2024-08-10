import { LANGUAGE_MAPPING } from "@repo/common/language";
import fs from "fs";
import prismaClient from "../src/index";

const MOUNT_PATH = process.env.MOUNT_PATH ?? "../../../apps/problems";

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

async function main(problemSlug: string, problemTitle: string) {
    const problemStatement = await promisifedReadFile(
        `${MOUNT_PATH}/${problemSlug}/Problem.md`
    );
    const tags = await promisifedReadFile(
        `${MOUNT_PATH}/${problemSlug}/tags.md`
    );

    const tagsArray = tags.split("\n").map(tag => tag.trim());

    const connectOrCreateTags = tagsArray.map(tag => ({
        where: { name: tag },
        create: { name: tag }
    }));

    console.log(connectOrCreateTags);

    const problem = await prismaClient.problem.upsert({
        where: {
            slug: problemSlug,
        },
        create: {
            title: problemSlug,
            slug: problemSlug,
            description: problemStatement,
            hidden: false,
            tags: {
                connectOrCreate: tagsArray.map(tag => ({
                    where: { name: tag },
                    create: { name: tag }
                })),
            }
        },
        update: {
            description: problemStatement,
            tags: {
                connect: tagsArray.map(tag => ({
                    where: { name: tag }
                }))
            } 
        },
    });

    await Promise.all(
        Object.keys(LANGUAGE_MAPPING).map(async (language) => {
            const code = await promisifedReadFile(
                `${MOUNT_PATH}/${problemSlug}/boilerplate/function.${language}`
            );

            await prismaClient.defaultCode.upsert({
                where: {
                    problemId_languageId: {
                        problemId: problem.id,
                        languageId: LANGUAGE_MAPPING[language].internal,
                    },
                },
                create: {
                    problemId: problem.id,
                    languageId: LANGUAGE_MAPPING[language].internal,
                    code,
                },
                update: {
                    code,
                },
            });
        })
    );
}

export function addProblemsInDB() {
    fs.readdir(MOUNT_PATH, (err, dirs) => {
        if (err) {
            console.error("Error reading directory:", err);
            return;
        }
        dirs.forEach(async (dir) => {
            await main(dir, dir);
        });
    });
}
