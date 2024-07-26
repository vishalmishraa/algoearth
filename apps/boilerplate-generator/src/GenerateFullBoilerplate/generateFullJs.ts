import MakeType from "../Parser/MapDataType";
import { IGenerator } from "../Parser/types";

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
            } else {
                return `const ${field.name} = parseInt(input.shift());`;
            }
        })
        .join("\n  ");
    const outputType = outputFields[0].type;
    const functionCall = `const result = ${functionName}(${inputFields.map((field) => field.name).join(", ")});`;

    return `##USER_CODE_HERE##

            const input = require('fs').readFileSync('/dev/problems/${problemName.replace(" ", "-")}/tests/inputs/##INPUT_FILE_INDEX##.txt', 'utf8').trim().split('\\n').join(' ').split(' ');
            ${inputReads}
            ${functionCall}
            console.log(result);
                `;
}