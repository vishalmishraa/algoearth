type TFields = Array<{ type: string; name: string }>;
import MakeType from "../Parser/MapDataType";
import { IGenerator } from "../Parser/types";

export default function generateFullPython({
    problemName,
    functionName,
    inputFields,
    outputFields
}: IGenerator): string {
    const makeType = new MakeType();
    const inputReads = inputFields
        .map((field) => {
            if (field.type.startsWith("list<")) {
                return `size_${field.name} = int(input().strip())\n${field.name} = [${makeType.ToPython(field.type)}(x) for x in input().strip().split()]`;
            } else {
                return `${field.name} = ${makeType.ToPython(field.type)}(input().strip())`;
            }
        })
        .join("\n  ");
    const outputType = makeType.ToPython(outputFields[0].type);
    const functionCall = `result = ${functionName}(${inputFields.map((field) => field.name).join(", ")});`;
    const outputWrite = `print(result);`;

    return `##USER_CODE_HERE##

        def main():
            ${inputReads}
            ${functionCall}
            ${outputWrite}

        if __name__ == "__main__":
            main()
        `;
};