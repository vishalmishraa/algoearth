// Constants for section names
const SECTION_NAMES = {
    INPUT: "input",
    OUTPUT: "output",
};

// Type for section names
type SectionName = typeof SECTION_NAMES[keyof typeof SECTION_NAMES];


export class ProblemTemplateParser {
    
    problemName: string = "";
    functionName: string = "";
    inputFields: Array<{ type: string; name: string }> = [];
    outputFields: Array<{ type: string; name: string }> = [];

    // Utility method to update the current section based on the line
    private updateCurrentSection(line: string, currentSection: SectionName | null): SectionName | null {
        if (line.startsWith('Input Structure:')) {
            return SECTION_NAMES.INPUT;
        } else if (line.startsWith('Output Structure:')) {
            return SECTION_NAMES.OUTPUT;
        }
        return currentSection;
    };

    // Method to handle field lines based on the current section
    private handleFieldLine(line: string, currentSection: SectionName | null) {
        if ((currentSection === SECTION_NAMES.INPUT && line.startsWith('Input Field:')) ||
            (currentSection === SECTION_NAMES.OUTPUT && line.startsWith('Output Field:'))) {
            const field = this.extractField(line);
            if (field) {
                currentSection === SECTION_NAMES.INPUT ? this.inputFields.push(field) : this.outputFields.push(field);
            }
        }
    }

    parse(template: string) {
        const lines = template.split('\n').map(line => line.trim());
        let currentSection: SectionName | null = null;
        lines.forEach(line => {
            if (line.startsWith('Problem Name:')) {
                this.problemName = this.extractQuotedValue(line);
            } else if (line.startsWith('Function Name:')) {
                this.functionName = this.extractValue(line);
            } else {
                currentSection = this.updateCurrentSection(line, currentSection);
                this.handleFieldLine(line, currentSection);
            }
        });
    }

    extractQuotedValue(line: string): string {
        const match = line.match(/: "(.*)"$/);
        return match ? match[1] : "";
    };

    extractValue(line: string): string {
        const match = line.match(/: (\w+)$/);
        return match ? match[1] : "";
    }

    extractField(line: string): { type: string; name: string } | null {
        const match = line.match(/Field: (\w+(?:<\w+>)?) (\w+)$/);
        return match ? { type: match[1], name: match[2] } : null;
    };

    //code generator
    generateCpp(): string {
        const inputs = this.inputFields.map(field => `${this.mapTypeToCpp(field.type)} ${field.name}`).join(', ');
        return `${this.mapTypeToCpp(this.outputFields[0].type)} ${this.functionName}(${inputs}) {\n    // Implementation goes here\n    return result;\n}`;
    }

    generateC(): string {
        const inputs = this.inputFields.map(field => `${this.makeTypeToC(field.type)} ${field.name}`).join(', ');
        return `${this.makeTypeToC(this.outputFields[0].type)} ${this.functionName}(${inputs}) {\n    // Implementation goes here\n    return result;\n}`;
    };

    generateJava(): string {
        const inputs = this.inputFields.map(field => `${this.mapTypeToJava(field.type)} ${field.name}`).join(', ');
        return `public ${this.mapTypeToJava(this.outputFields[0].type)} ${this.functionName}(${inputs}) {\n    // Implementation goes here\n    return result;\n}`;
    };

    generateRust(): string {
        const inputs = this.inputFields.map(field => `${field.name}: ${this.mapTypeToRust(field.type)}`).join(', ');
        return `fn ${this.functionName}(${inputs}) -> ${this.mapTypeToRust(this.outputFields[0].type)} {\n    // Implementation goes here\n    return result;\n}`;
    };

    generatePython(): string {
        const inputs = this.inputFields.map(field => `${field.name}: ${this.mapTypeToPython(field.type)}`).join(', ');
        return `def ${this.functionName}(${inputs}) -> ${this.mapTypeToPython(this.outputFields[0].type)}:\n    # Implementation goes here\n    return result`;
    };

    generateJavascript(): string {
        const inputs = this.inputFields.map(field => `${field.name}`).join(', ');
        return `function ${this.functionName}(${inputs}) {\n    // Implementation goes here\n    return result;\n}`;
    }

    makeTypeToC(type: string): string {
        switch (type) {
            case "int":
                return "int";
            case "float":
                return "float";
            case "string":
                return "char*";
            case "bool":
                return "bool";
            case "list<int>":
                return "int*";
            case "list<float>":
                return "float*";
            case "list<string>":
                return "char**";
            case "list<bool>":
                return "bool*";
            default:
                return "unknown";
        }
    };

    mapTypeToCpp(type: string): string {
        switch (type) {
            case "int":
                return "int";
            case "float":
                return "float";
            case "string":
                return "std::string";
            case "bool":
                return "bool";
            case "list<int>":
                return "std::vector<int>";
            case "list<float>":
                return "std::vector<float>";
            case "list<string>":
                return "std::vector<std::string>";
            case "list<bool>":
                return "std::vector<bool>";
            default:
                return "unknown";
        }
    };

    mapTypeToJava(type: string): string {
        switch (type) {
            case "int":
                return "int";
            case "float":
                return "float";
            case "string":
                return "String";
            case "bool":
                return "boolean";
            case "list<int>":
                return "List<Integer>";
            case "list<float>":
                return "List<Float>";
            case "list<string>":
                return "List<String>";
            case "list<bool>":
                return "List<Boolean>";
            default:
                return "unknown";
        }
    };

    mapTypeToRust(type: string): string {
        switch (type) {
            case "int":
                return "i32";
            case "float":
                return "f64";
            case "string":
                return "String";
            case "bool":
                return "bool";
            case "list<int>":
                return "Vec<i32>";
            case "list<float>":
                return "Vec<f64>";
            case "list<string>":
                return "Vec<String>";
            case "list<bool>":
                return "Vec<bool>";
            default:
                return "unknown";
        }
    };

    mapTypeToPython(type: string): string {
        switch (type) {
            case "int":
                return "int";
            case "float":
                return "float";
            case "string":
                return "str";
            case "bool":
                return "bool";
            case "list<int>":
                return "List[int]";
            case "list<float>":
                return "List[float]";
            case "list<string>":
                return "List[str]";
            case "list<bool>":
                return "List[bool]";
            default:
                return "unknown";
        }
    };

    mapTypeToJavascript(type: string): string {
        switch (type) {
            case "int":
                return "number";
            case "float":
                return "number";
            case "string":
                return "string";
            case "bool":
                return "boolean";
            case "list<int>":
                return "number[]";
            case "list<float>":
                return "number[]";
            case "list<string>":
                return "string[]";
            case "list<bool>":
                return "boolean[]";
            default:
                return "unknown";
        }
    };

};

