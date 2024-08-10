import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const problemsPath: string = process.env.PROBLEMS_DIR_PATH || '';

const tags = [
    'ARRAY',
    'STRING',
    'HASH_TABLE',
    'DYNAMIC_PROGRAMMING',
    'MATH',
    'SORTING',
    'GREEDY',
    'DEPTH_FIRST_SEARCH',
    'DATABASE',
    'BINARY_SEARCH',
    'BREADTH_FIRST_SEARCH',
    'TREE',
    'MATRIX',
    'BIT_MANIPULATION',
    'TWO_POINTERS',
    'BINARY_TREE',
    'HEAP',
    'PREFIX_SUM',
    'STACK',
    'SIMULATION',
    'GRAPH',
    'COUNTING',
    'DESIGN',
    'SLIDING_WINDOW',
    'BACKTRACKING',
    'ENUMERATION',
    'UNION_FIND',
    'LINKED_LIST',
    'ORDERED_SET',
    'MONOTONIC_STACK',
    'NUMBER_THEORY',
    'TRIE',
    'SEGMENT_TREE',
    'DIVIDE_AND_CONQUER',
    'QUEUE',
    'RECURSION',
    'BITMASK',
    'BINARY_SEARCH_TREE',
    'GEOMETRY',
    'MEMOIZATION',
    'BINARY_INDEXED_TREE',
    'HASH_FUNCTION',
    'COMBINATORICS',
    'TOPOLOGICAL_SORT',
    'STRING_MATCHING',
    'SHORTEST_PATH',
    'ROLLING_HASH',
    'GAME_THEORY',
    'INTERACTIVE',
    'DATA_STREAM',
    'BRAINTEASER',
    'MONOTONIC_QUEUE',
    'RANDOMIZED',
    'MERGE_SORT',
    'ITERATOR',
    'DOUBLY_LINKED_LIST',
    'CONCURRENCY',
    'PROBABILITY_AND_STATISTICS',
    'QUICKSELECT',
    'SUFFIX_ARRAY',
    'COUNTING_SORT',
    'BUCKET_SORT',
    'MINIMUM_SPANNING_TREE',
    'SHELL',
    'LINE_SWEEP',
    'RESERVOIR_SAMPLING',
    'STRONGLY_CONNECTED_COMPONENT',
    'EULERIAN_CIRCUIT',
    'RADIX_SORT',
    'REJECTION_SAMPLING',
    'INCONSISTENT_COMPARISON',
];

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

    fs.readdirSync(problemsPath).filter(file => {
        it(`${file} should have tags.md file`, () => {
            const problemFolderPath = path.join(problemsPath, file);
            const tagsPath = path.join(problemFolderPath, 'tags.md');
            expect(fs.existsSync(tagsPath)).toBe(true);
        });
    });

    fs.readdirSync(problemsPath).filter(file => {
        it(`${file} tags should belong to predefined tags`, () => {
            const problemFolderPath = path.join(problemsPath, file);
            const tagsPath = path.join(problemFolderPath, 'tags.md');
            const tagsContent = fs.readFileSync(tagsPath, 'utf8');
            const fetchedTags = tagsContent.split('\n').map(tag => tag.trim());
            fetchedTags.forEach(tag => {
                expect(tags.includes(tag)).toBe(true);
            });
        });
        //there should be no empty spaces && one line should have only one word which is predefined
        it(`${file} tags should not have empty spaces`, () => {
            const problemFolderPath = path.join(problemsPath, file);
            const tagsPath = path.join(problemFolderPath, 'tags.md');
            const tagsContent = fs.readFileSync(tagsPath, 'utf8');
            const fetchedTags = tagsContent.split('\n').map(tag => tag.trim());
            fetchedTags.forEach(tag => {
                expect(tag).not.toBe('');
            });
        });
    });

});


