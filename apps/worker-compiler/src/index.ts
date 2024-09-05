import { exec } from 'child_process';
import fs from 'fs';
import { db } from "./db";
import Redis from 'ioredis';
import dotenv from 'dotenv'
dotenv.config();

async function checkDBConnection() {
    try {
        await db.$connect();
        console.log('Database connection is successful');
        return true;
    } catch (error) {
        console.error('Database connection error:', error);
        return false;
    }
}

checkDBConnection();


const redis = new Redis(process.env.REDIS_URL!);

redis.on('connect', () => {
    console.log('Connected to Redis');
});

redis.on('error', (error) => {
    console.error('Redis error:', error);
});

// Add this new event listener
redis.on('ready', () => {
    console.log('Redis is ready');
});





async function runQueue() {
    while (true) {
        try {
            console.log('Waiting for job from Redis queue...');
            const job = await redis.blpop('codeQueue', 0);
            if (!job) {
                console.log('No job received from Redis queue');
                continue;
            }

            let jobData;
            try {
                jobData = JSON.parse(job[1]);
            } catch (parseError) {
                console.error('Error parsing job data:', parseError);
                continue;
            }
            //update db
            await db.submissions.update({
                where: {
                    id: jobData.dbId
                },
                data: {
                    status_id: 2, // in processing,
                    compile_output: 'processing'
                }
            })


            // Set status to pending
            await redis.set(jobData.jobId, JSON.stringify({ status_id: 1 }), 'EX', 300);

            // Create a file and write the code into it based on the language
            let fileName = '';
            console.log('languag ==> ', jobData.language)

            switch (jobData.language) {
                case 'cpp':
                    fileName = 'yourcode.cpp';
                    break;
                case 'python':
                    fileName = 'yourcode.py';
                    break;
                case 'c':
                    fileName = 'yourcode.c';
                    break;
                case 'java':
                    fileName = 'yourcode.java';
                    break;
                case 'javascript':
                    fileName = 'yourcode.js';
                    break;
                default:
                    console.error('Unsupported language:', jobData.language);
                    continue;
            }


            if (!fs.existsSync('box')) {
                fs.mkdirSync('box');
            }
            fs.writeFileSync(`box/${fileName}`, jobData.code);



            try {
                console.log("---->", jobData.expected_output)
                const result = await runCommand(jobData.command, jobData.code, jobData.language, jobData.expected_output);
                // Status ID for successful execution
                await db.submissions.update({
                    where: {
                        id: jobData.dbId

                    },
                    data: {
                        status_id: result.status_id, // in processing,
                        compile_output: result.compile_output,
                        finished_at: result.finished_at,
                        exit_code: result.exit_code,
                        memory: result.memoryUsage,
                        stdout: result.stdout,
                        stderr: result.stderr,
                        time: result.timeTaken,
                    }
                })
                await redis.set(jobData.jobId, JSON.stringify(result), 'EX', 300);
                console.log(`Result stored in Redis for job ${jobData.jobId}`);
            } catch (runError: any) {
                if (jobData.jobId) {
                    //runtime error : 
                    await db.submissions.update({
                        where: {
                            id: jobData.dbId
                        },
                        data: {
                            status_id: 6, // runtime error
                            compile_output: runError.message,
                            finished_at: new Date().toISOString(),
                            exit_code: runError.exit_code,
                            memory: runError.memoryUsage,
                            stderr: runError.stderr,
                            time: runError.timeTaken,
                        }
                    });


                    const errorResult = {
                        error: runError.message,
                        status_id: 6 // Status ID for runtime error
                    };
                    await redis.set(jobData.jobId, JSON.stringify(errorResult), 'EX', 300);
                }
            }
        } catch (error) {
            console.error('Error in runQueue:', error);
            // Wait for a short time before trying again to avoid tight loop in case of persistent errors
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}


async function runCommand(command: string, code: string, language: string, expected_output: string): Promise<{
    stderr?: string;
    timeTaken: number;
    memoryUsage: number;
    created_at: string;
    finished_at: string;
    source_code: string;
    language_id: string;
    expected_output: string;
    compile_output: string | null;
    exit_code: number | null;
    status_id: number;
    stdout?: string;
}> {
    return new Promise((resolve, reject) => {

        const startTime = process.hrtime();
        const createdAt = new Date().toISOString();

        exec(command, { timeout: 5000 }, (error, stdout, stderr) => {

            const endTime = process.hrtime(startTime);
            const timeTaken = parseFloat((endTime[0] + endTime[1] / 1e9).toFixed(3)); // Convert to seconds and milliseconds till 3 digits
            const finishedAt = new Date().toISOString();
            const memoryUsage = Math.floor(process.memoryUsage().heapUsed / 1024); // Convert to KB and remove decimals

            if (error) {
                reject({
                    stderr: `Error: ${error.message}`,
                    timeTaken: timeTaken,
                    memoryUsage: memoryUsage,
                    created_at: createdAt,
                    finished_at: finishedAt,
                    expected_output: expected_output,
                    source_code: code,
                    language_id: language,
                    compile_output: error.message,
                    exit_code: error.code,
                    status_id: 6 // Status ID for runtime error
                });
                return;
            }

            if (stderr) {
                resolve({
                    stderr: `Stderr: ${stderr}`,
                    timeTaken: timeTaken,
                    memoryUsage: memoryUsage,
                    created_at: createdAt,
                    finished_at: finishedAt,
                    expected_output: expected_output,
                    source_code: code,
                    language_id: language,
                    compile_output: stderr,
                    exit_code: 0,
                    status_id: 5 // Status ID for successful execution
                });
                return;
            }

            stdout = stdout.trimEnd();
            

            if (expected_output !== stdout) {
                console.log(`expected_output: ${expected_output}, stdout: ${stdout}`);

                resolve({
                    stdout: `${stdout}`,
                    timeTaken: timeTaken,
                    memoryUsage: memoryUsage,
                    created_at: createdAt,
                    finished_at: finishedAt,
                    expected_output: expected_output,
                    source_code: code,
                    language_id: language,
                    compile_output: 'REJECTED',
                    exit_code: 0,
                    status_id: 4 // Status ID for rejected output
                });
                return;
            }

            resolve({
                stdout: `${stdout}`,
                timeTaken: timeTaken,
                memoryUsage: memoryUsage,
                created_at: createdAt,
                finished_at: finishedAt,
                expected_output: expected_output,
                source_code: code,
                language_id: language,
                compile_output: 'ACCEPTED',
                exit_code: 0,
                status_id: 3 // Status ID for successful execution
            });
        });
    });
}

runQueue();
