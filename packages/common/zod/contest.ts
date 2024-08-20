import * as  zod  from "zod";

export const contestZod = zod.object({
    id: zod.string(),
    title: zod.string(),
    description: zod.string(),
    startTime: zod.string().transform((str) => new Date(str)),
    hidden: zod.boolean(),
    endTime: zod.string().transform((str) => new Date(str)),
});
export const CreatecontestZod = zod.object({
    title: zod.string(),
    description: zod.string(),
    startTime: zod.string().transform((str) => new Date(str)),
    endTime: zod.string().transform((str) => new Date(str)),
});
