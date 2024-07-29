export type TFields = Array<{ type: string; name: string }>;

export interface IGenerator{
    problemName: string;
    functionName: string;
    inputFields: TFields;
    outputFields: TFields;
}

export const SECTION_NAMES = {
    INPUT: "input",
    OUTPUT: "output",
};

export type SectionName = typeof SECTION_NAMES[keyof typeof SECTION_NAMES];
