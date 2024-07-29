import MakeType from '../Parser/MapDataType';
import { IGenerator, TFields } from '../Parser/types';

export default class GeneratePartial {
    private problemName: string = '';
    private functionName: string = '';
    private inputFields: TFields = [];
    private outputFields: TFields = [];

    constructor({
        problemName,
        functionName,
        inputFields,
        outputFields
    }: IGenerator) {
        this.problemName = problemName;
        this.functionName = functionName;
        this.outputFields = outputFields;
        this.inputFields = inputFields
    }

    generateCpp(): string {
        const makeType = new MakeType();
        const inputs = this.inputFields.map(field => `${makeType.ToCpp(field.type)} ${field.name}`).join(', ');
        return `${makeType.ToCpp(this.outputFields[0].type)} ${this.functionName}(${inputs}) {\n    // Implementation goes here\n    return result;\n}`;
    }

    generateC(): string {
        const makeType = new MakeType();
        const inputs = this.inputFields.map(field => `${makeType.ToC(field.type)} ${field.name}`).join(', ');
        return `${makeType.ToC(this.outputFields[0].type)} ${this.functionName}(${inputs}) {\n    // Implementation goes here\n    return result;\n}`;
    };

    generateJava(): string {
        const makeType = new MakeType();
        const inputs = this.inputFields.map(field => `${makeType.ToJava(field.type)} ${field.name}`).join(', ');
        return `public ${makeType.ToJava(this.outputFields[0].type)} ${this.functionName}(${inputs}) {\n    // Implementation goes here\n    return result;\n}`;
    };

    generateRust(): string {
        const makeType = new MakeType();
        const inputs = this.inputFields.map(field => `${field.name}: ${makeType.ToRust(field.type)}`).join(', ');
        return `fn ${this.functionName}(${inputs}) -> ${makeType.ToRust(this.outputFields[0].type)} {\n    // Implementation goes here\n    return result;\n}`;
    };

    generatePython(): string {
        const makeType = new MakeType();
        const inputs = this.inputFields.map(field => `${field.name}: ${makeType.ToPython(field.type)}`).join(', ');
        return `def ${this.functionName}(${inputs}) -> ${makeType.ToPython(this.outputFields[0].type)}:\n    # Implementation goes here\n    return result`;
    };

    generateJavascript(): string {
        const inputs = this.inputFields.map(field => `${field.name}`).join(', ');
        return `function ${this.functionName}(${inputs}) {\n    // Implementation goes here\n    return result;\n}`;
    }
}