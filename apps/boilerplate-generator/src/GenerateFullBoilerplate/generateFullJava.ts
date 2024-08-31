type TFields = Array<{ type: string; name: string }>;
import MakeType from "../Parser/MapDataType";
import { IGenerator } from "../Parser/types";
import dotenv from 'dotenv'
dotenv.config();

export default function generateFullJava({
    problemName,
    functionName,
    inputFields,
    outputFields
}: IGenerator): string {
    const makeType = new MakeType()
    let inputReadIndex = 0;
    const inputReads = inputFields
        .map((field, index) => {
            if (field.type.startsWith("list<")) {
                let javaType = makeType.ToJava(field.type);
                let inputType = javaType.match(/<(.*?)>/);
                javaType = inputType ? inputType[1] : 'Integer';
                let parseToType = (javaType === 'Integer') ? 'Int' : javaType;

                return `int size_${field.name} = Integer.parseInt(lines.get(${inputReadIndex++}).trim());\n
        ${makeType.ToJava(field.type)} ${field.name} = new ArrayList<>(size_${field.name});\n
        String[] inputStream = lines.get(${inputReadIndex++}).trim().split("\\s+");\n
        for (String inputChar : inputStream)  {\n
          ${field.name}.add(${javaType}.parse${parseToType}(inputChar));\n
        }\n`;
            } else {
                let javaType = makeType.ToJava(field.type);
                if (javaType === 'int') {
                    javaType = 'Integer';
                }
                else if (javaType === 'float') {
                    javaType = 'Float';
                }
                else if (javaType === 'boolean') {
                    javaType = 'Boolean';
                } else if (javaType === 'String') {
                    javaType = 'String';
                }
                let parseToType = (javaType === 'Integer') ? 'Int' : javaType;
                return `${makeType.ToJava(field.type)} ${field.name} = ${javaType}.parse${parseToType}(lines.get(${inputReadIndex++}).trim());`;
            }
        }).join("\n  ");
    const outputType = makeType.ToJava(outputFields[0].type);
    const functionCall = `${outputType} result = ${functionName}(${inputFields.map((field) => field.name).join(", ")});`;
    const outputWrite = `System.out.println(result);`;

    return `
            import java.io.*;
            import java.util.*;

            public class Main {
                
                ##USER_CODE_HERE##

                public static void main(String[] args) {
                    String filePath = "${process.env.PV_DIR_PATH}/${problemName.replace(" ", "-")}/tests/inputs/##INPUT_FILE_INDEX##.txt"; 
                    List<String> lines = readLinesFromFile(filePath);
                    ${inputReads}
                    ${functionCall}
                    ${outputWrite}
                }
                public static List<String> readLinesFromFile(String filePath) {
                    List<String> lines = new ArrayList<>();
                    try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
                        String line;
                        while ((line = br.readLine()) != null) {
                            lines.add(line);
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    return lines;
                }
            }`;
}