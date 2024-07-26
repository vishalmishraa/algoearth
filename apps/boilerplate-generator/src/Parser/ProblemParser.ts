import { SelectionHandler } from "./selectionHandler";
import { TFields, SectionName } from './types';


export default class ProblemParser {
    private problemName: string = "";
    private functionName: string = "";
    private inputFields: TFields = [];
    private outputFields: TFields = [];

    parse(template: string) {
        const lines = template.split('\n').map(line => line.trim());
        let currentSelection: SectionName | null = null;
        lines.forEach(line => {
            if (line.startsWith('Problem Name:')) {
                this.problemName = this.extractQuotedValue(line);
            } else if (line.startsWith('Function Name:')) {
                this.functionName = this.extractValue(line);
            } else {
                const selectionHandler = new SelectionHandler()
                currentSelection = selectionHandler.updateCurrentSelection(line, currentSelection);
                const inputfield = selectionHandler.handleFieldLine(line, currentSelection).inputFields[0];
                const outputfield = selectionHandler.handleFieldLine(line, currentSelection).outputFields[0];
                if (inputfield) this.inputFields.push(inputfield);
                if (outputfield) this.outputFields.push(outputfield);
            }
        });

        return {
            problemName: this.problemName,
            functionName: this.functionName,
            inputFields: this.inputFields,
            outputFields: this.outputFields
        }
    }

    extractQuotedValue(line: string): string {
        const match = line.match(/: "(.*)"$/);
        return match ? match[1] : "";
    };

    extractValue(line: string): string {
        const match = line.match(/: (\w+)$/);
        return match ? match[1] : "";
    }
}