export function getCommnad(language: string) {

    let command = '';

    switch (language) {
        case 'cpp':
            command = 'g++ ./box/yourcode.cpp  -o ./box/yourcode && ./box/yourcode';
            break;
        case 'python':
            command = 'python3 ./box/yourcode.py';
            break;
        case 'c':
            command = 'gcc -o output ./box/yourcode.c && ./box/output';
            break;
        case 'java':
            command = 'javac ./box/yourcode.java && java ./box/Yourcode';
            break;
        case 'javascript':
            command = 'node ./box/yourcode.js';
            break;
        default:
            return {
                error: `Unsupported language for problem: ${language}`
            }
    }

    return {
        command
    }
}
