type TFields = Array<{ type: string; name: string }>;
const SECTION_NAMES = {
    INPUT: "input",
    OUTPUT: "output",
};
type SectionName = typeof SECTION_NAMES[keyof typeof SECTION_NAMES];


export class SelectionHandler{

    private inputFields: TFields= [];
    private outputFields: TFields= [];

    updateCurrentSelection(line : string , currentSelection : SectionName | null){
        if (line.startsWith('Input Structure:')) {
            return SECTION_NAMES.INPUT;
        } else if (line.startsWith('Output Structure:')) {
            return SECTION_NAMES.OUTPUT;
        }
        return currentSelection;
    }

    handleFieldLine(line: string, currentSelection: SectionName | null){
        if ((currentSelection === SECTION_NAMES.INPUT && line.startsWith('Input Field:')) ||
            (currentSelection === SECTION_NAMES.OUTPUT && line.startsWith('Output Field:'))) {
            const field = this.extractField(line);
            if (field) {
                currentSelection === SECTION_NAMES.INPUT ? this.inputFields.push(field) : this.outputFields.push(field);
            }
        }

        return {
            inputFields: this.inputFields, 
            outputFields: this.outputFields
        };
    };

    extractField(line: string): { type: string; name: string } | null {
        const match = line.match(/Field: (\w+(?:<\w+>)?) (\w+)$/);
        return match ? { type: match[1], name: match[2] } : null;
    };

};