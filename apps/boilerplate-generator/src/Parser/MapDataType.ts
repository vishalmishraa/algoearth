export default class MakeType{
    ToC(type: string): string {
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

    ToCpp(type: string): string {
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

    ToJava(type: string): string {
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

    ToRust(type: string): string {
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
    }

    ToPython(type: string): string {
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

    ToJavascript(type: string): string {
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
    }
}