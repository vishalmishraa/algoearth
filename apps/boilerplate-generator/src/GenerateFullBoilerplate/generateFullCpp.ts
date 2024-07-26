import { IGenerator } from '../Parser/types'
import MakeType from "../Parser/MapDataType";

export default function generateFullCpp({
    problemName,
    functionName,
    inputFields,
    outputFields
}: IGenerator): string {
    const makeType = new MakeType()
    const inputReads = inputFields
        .map((field, index) => {
            if (field.type.startsWith("list<")) {
                return `int size_${field.name};\n  std::istringstream(lines[${index}]) >> size_${field.name};\n  ${makeType.ToCpp(field.type)} ${field.name}(size_${field.name});\n  if(size_${field.name} != 0) {\n  \tstd::istringstream iss(lines[${index + 1}]);\n  \tfor (int i=0; i < size_${field.name}; i++) iss >> ${field.name}[i];\n  }`;
            } else {
                return `${makeType.ToCpp(field.type)} ${field.name};\n  std::istringstream(lines[${index}]) >> ${field.name};`;
            }
        })
        .join("\n  ");
    const outputType = outputFields[0].type;
    const functionCall = `std::${outputType} result = ${functionName}(${inputFields.map((field) => field.name).join(", ")});`;
    const outputWrite = `std::cout << result << std::endl;`;

    return `#include <iostream>
            #include <fstream>
            #include <vector>
            #include <string>
            #include <sstream>
            #include <climits>

            ##USER_CODE_HERE##

            int main() {
            std::ifstream file("/dev/problems/${problemName.replace(" ", "-")}/tests/inputs/##INPUT_FILE_INDEX##.txt");
            std::vector<std::string> lines;
            std::string line;
            while (std::getline(file, line)) lines.push_back(line);

            file.close();
            ${inputReads}
            ${functionCall}
            ${outputWrite}
            return 0;
            }
            `;
}