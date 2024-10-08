import MakeType from "../Parser/MapDataType";
import { IGenerator } from "../Parser/types";
import dotenv from 'dotenv'
dotenv.config();

export default function generateFullJs({
    problemName,
    functionName,
    inputFields,
    outputFields
}: IGenerator): string {
    const makeType = new MakeType();
    const inputReads = inputFields
        .map((field) => {
            if (field.type.startsWith("list<")) {
                return `const size_${field.name} = parseInt(input.shift());\nconst ${field.name} = input.splice(0, size_${field.name}).map(Number);`;
            } else if (field.type === "string") {
                return `const ${field.name} = input.shift();`;
            } else {
                return `const ${field.name} = parseInt(input.shift());`;
            }
        })
        .join("\n  ");
    const outputType = outputFields[0].type;
    const functionCall = `const result = ${functionName}(${inputFields.map((field) => field.name).join(", ")});`;

    return `##USER_CODE_HERE##

            const input = require('fs').readFileSync('${process.env.PV_DIR_PATH}/${problemName.replace(" ", "-")}/tests/inputs/##INPUT_FILE_INDEX##.txt', 'utf8').trim().split('\\n').join(' ').split(' ');
            ${inputReads}
            ${functionCall}
            console.log(result);
                `;
}