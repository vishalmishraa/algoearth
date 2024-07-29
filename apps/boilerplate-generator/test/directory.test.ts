import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const problemsPath: string = process.env.PROBLEMS_DIR_PATH || '';

// check if problem directory exist or not
describe('Problem folder exist', () => {
    it('should have problems folder', () => {
        fs.readdirSync(problemsPath).filter(file => {
            expect(fs.statSync(path.join(problemsPath, file)).isDirectory()).toBe(true);
        })
    })

    fs.readdirSync(problemsPath).filter(file => {
        it(`${file} should have tests folder`, () => {
            const problemFolderPath = path.join(problemsPath, file);
            const testsPath = path.join(problemFolderPath, 'tests');
            expect(fs.existsSync(testsPath)).toBe(true);
        })
    });

    fs.readdirSync(problemsPath).filter(file => {
        it(`${file} tests folder should have inputs and outputs `, () => {
            const problemFolderPath = path.join(problemsPath, file);
            const testsPath = path.join(problemFolderPath, 'tests');
            const inputsPath = path.join(testsPath, 'inputs');
            const outputsPath = path.join(testsPath, 'outputs');
            expect(fs.existsSync(inputsPath)).toBe(true);
            expect(fs.existsSync(outputsPath)).toBe(true);
        })
    });

    fs.readdirSync(problemsPath).filter(file => {
        it(`${file} inputs and outputs should have same number of files`, () => {
            const problemFolderPath = path.join(problemsPath, file);
            const testsPath = path.join(problemFolderPath, 'tests');
            const inputsPath = path.join(testsPath, 'inputs');
            const outputsPath = path.join(testsPath, 'outputs');
            const inputFiles = fs.readdirSync(inputsPath).filter(file => file.endsWith('.txt'));
            const outputFiles = fs.readdirSync(outputsPath).filter(file => file.endsWith('.txt'));
            expect(inputFiles.length).toBe(outputFiles.length);
        })
    });

    fs.readdirSync(problemsPath).filter(file => {
        it(`${file} inputs and outputs should have same name of files`, () => {
            const problemFolderPath = path.join(problemsPath, file);
            const testsPath = path.join(problemFolderPath, 'tests');
            const inputsPath = path.join(testsPath, 'inputs');
            const outputsPath = path.join(testsPath, 'outputs');
            const inputFiles = fs.readdirSync(inputsPath).filter(file => file.endsWith('.txt'));
            const outputFiles = fs.readdirSync(outputsPath).filter(file => file.endsWith('.txt'));
            inputFiles.sort();
            outputFiles.sort();
            inputFiles.forEach((file, index) => {
                expect(file).toBe(`${index}.txt`);
                expect(outputFiles[index]).toBe(`${index}.txt`);
            });
        })
    });
});


