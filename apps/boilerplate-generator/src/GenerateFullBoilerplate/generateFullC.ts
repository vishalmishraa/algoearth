import MakeType from "../Parser/MapDataType";
import { IGenerator } from "../Parser/types";
import dotenv from 'dotenv'
dotenv.config();

export default function generateFullC({
    problemName,
    functionName,
    inputFields,
    outputFields
}: IGenerator
): string {
    const mapDataType = new MakeType();
    const inputReads = inputFields
        .map((field) => {
            if (field.type.startsWith("list<")) {
                return `int size_${field.name};\n  fscanf(file, "%d", &size_${field.name});\n  ${mapDataType.ToC(field.type)} ${field.name}[size_${field.name}];\n  for (int i = 0; i < size_${field.name}; i++) fscanf(file, "%d", &${field.name}[i]);`;
            } else {
                return `${mapDataType.ToC(field.type)} ${field.name};\n  fscanf(file, "%d", &${field.name});`;
            }
        })
        .join("\n  ");
    const outputType: string | undefined = outputFields[0].type;
    const functionCall = `${outputType} result = ${functionName}(${inputFields.map((field) => field.name).join(", ")});`;
    const outputWrite = `fprintf(stdout, "%d\\n", result);`;

    return `
            #include <stdio.h>
            #include <stdlib.h>
            #include <stdbool.h>
            #include <string.h>
            #include <limits.h>
            
            ##USER_CODE_HERE##
            
            int main() {
                FILE *file = fopen("${process.env.PV_DIR_PATH}/${problemName.replace(" ", "-")}/tests/inputs/##INPUT_FILE_INDEX##.txt", "r");
                vector<string> lines;
                string line;
                while (fgets(line, sizeof(line), file)) lines.push_back(line);
                fclose(file);
                ${inputReads}
                ${functionCall}
                ${outputWrite}
                return 0;
                }
            `;
};