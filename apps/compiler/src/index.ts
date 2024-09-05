import express from "express"
import { db } from "./db";
import { v4 } from 'uuid'
import Redis from 'ioredis';
import { COMPILER_LANGUAGE_MAPPING } from "./utils/language"
import { compilerSubmission } from "./utils/zod"
import { getCommnad } from "./utils/functions";
import dotenv from 'dotenv'
dotenv.config();


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


const app = express();
app.use(express.json());

db.$connect()
    .then(() => console.log('Connected to the database'))
    .catch((error) => console.error('Database connection error:', error));



app.post('/submissions/batch', async (req, res) => {
    try {
        const problems = compilerSubmission.parse(req.body);
        const jobTokens = [];

        for (const problem of problems.submissions) {
            
            const language = COMPILER_LANGUAGE_MAPPING[problem.language_id]?.monaco;
            console.log('languag ==> ', language)
            const jobId = v4();
            const sysCom = getCommnad(language);

            if (sysCom.error) {
                return res.status(400).json({ message: 'Unsupported language' });
            }

            const command = sysCom.command
            const code = problem.source_code;



            try {
                jobTokens.push({ token: jobId });
                const newSubmission = await db.submissions.create({
                    data: {
                        status_id: 1, // Assuming 1 is the status_id for a new submission
                        language_id: problem.language_id,
                        created_at: new Date().toISOString(),
                        expected_output: problem.expected_output,
                        source_code: problem.source_code,
                        compile_output: 'In queue',
                        token: jobId
                    }
                });

                const job = {
                    jobId,
                    language,
                    code,
                    command,
                    dbId: newSubmission.id,
                    expected_output: problem.expected_output,
                };

                const data = await redis.rpush('codeQueue', JSON.stringify(job));

            } catch (redisError: any) {
                console.error('Error pushing to Redis queue:', redisError);
                res.status(500).json({
                    message: 'Error queuing the job',
                    error: redisError.message
                });
                return;
            }
        }
        res.status(200).json(jobTokens);
    } catch (error) {
        console.error('Error parsing submission:', error);
        return res.status(400).json({ message: 'Invalid submission data' });
    }
});


app.listen(3005, () => {
    console.log(`compiler service started at PORT : ${3005}`)
})