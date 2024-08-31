import { z } from "zod";

export const submissionSchema = z.object({
    language_id: z.number(),
    source_code: z.string(),
    expected_output: z.string().optional()
});

export const compilerSubmission = z.object({
    submissions: z.array(submissionSchema)
});
