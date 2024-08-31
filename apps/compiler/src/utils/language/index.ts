export const COMPILER_LANGUAGE_MAPPING: {
    [key: number]: {
        internal: number;
        name: string;
        monaco: string;
    };
} = {
    63: { internal: 1, name: "Javascript", monaco: "javascript" },
    54: { internal: 2, name: "C++", monaco: "cpp" },
    73: { internal: 3, name: "Rust", monaco: "rust" },
    62: { internal: 4, name: "Java", monaco: "java" },
    71: { internal: 5, name: "Python", monaco: "python" },
};

