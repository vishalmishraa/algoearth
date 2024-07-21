const fs = require('fs');
const path = require('path');

/**
 * Creates test directories and files based on test cases.
 * @param {Array<Object>} testCases - An array of test case objects.
 */
function createTestDirectoriesAndFiles(testCases) {
  const testDir = path.join("/Users/vishal/Desktop/PROJECTS/algoearth3/apps/problems/Find-Median", 'test');
  const inputDir = path.join(testDir, 'input');
  const outputDir = path.join(testDir, 'output');

  // Create test, input, and output directories if they don't exist
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir);
  }
  if (!fs.existsSync(inputDir)) {
    fs.mkdirSync(inputDir);
  }
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Create input and output files for each test case
  testCases.forEach((testCase, index) => {
    const inputFilePath = path.join(inputDir, `${index}.txt`);
    const outputFilePath = path.join(outputDir, `${index}.txt`);
  
    // Join array elements with a space for input and output
    const inputContent = Array.isArray(testCase.input) ? testCase.input.join(' ') : String(testCase.input);
    const outputContent = Array.isArray(testCase.output) ? testCase.output.join(' ') : String(testCase.output);
  
    fs.writeFileSync(inputFilePath, inputContent);
    fs.writeFileSync(outputFilePath, outputContent);
  });
}

// Example usage
const testCases = [
    { "input": [1, 3, 3, 6, 7, 8, 9], "output": 6 },
    { "input": [1, 2, 3, 4, 5, 6, 7, 8], "output": 4.5 },
    { "input": [-5, -3, -1, 2, 4, 6], "output": 0.5 },
    { "input": [1], "output": 1 },
    { "input": [], "output": null },
    { "input": [2, 2, 2, 2], "output": 2 },
    { "input": [-1, 0, 1], "output": 0 }
  ]

createTestDirectoriesAndFiles(testCases);