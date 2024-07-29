type TFields = Array<{ type: string; name: string }>;
import MakeType from "../Parser/MapDataType";
import { IGenerator } from "../Parser/types";

export default function generateFullRust({
    problemName,
    functionName,
    inputFields,
    outputFields
}: IGenerator): string {
    const makeType = new MakeType();
    const inputReads = inputFields
        .map((field) => {
            if (field.type.startsWith("list<")) {
                return `let size_${field.name}: usize = lines.next().and_then(|line| line.parse().ok()).unwrap_or(0);\n\tlet ${field.name}: ${makeType.ToRust(field.type)} = parse_input(lines, size_${field.name});`;
            } else {
                return `let ${field.name}: ${makeType.ToRust(field.type)} = lines.next().unwrap().parse().unwrap();`;
            }
        })
        .join("\n  ");
    const containsVector = inputFields.find((field) =>
        field.type.startsWith("list<")
    );
    const outputType = makeType.ToPython(outputFields[0].type);
    const functionCall = `let result = ${functionName}(${inputFields.map((field) => field.name).join(", ")});`;
    const outputWrite = `println!("{}", result);`;

    return `use std::fs::read_to_string;
            use std::io::{self};
            use std::str::Lines;

            ##USER_CODE_HERE##

            fn main() -> io::Result<()> {
            let input = read_to_string("/dev/problems/${problemName.replace(" ", "-")}/tests/inputs/##INPUT_FILE_INDEX##.txt")?;
            let mut lines = input.lines();
            ${inputReads}
            ${functionCall}
            ${outputWrite}
            Ok(())
            }${containsVector
            ? `\nfn parse_input(mut input: Lines, size_arr: usize) -> Vec<i32> {
                let arr: Vec<i32> = input
                    .next()
                    .unwrap_or_default()
                    .split_whitespace()
                    .filter_map(|x| x.parse().ok())
                    .collect();

                if size_arr == 0 {
                    Vec::new()
                } else {
                    arr
                }
            }`
            : ""
        }
            `;
};