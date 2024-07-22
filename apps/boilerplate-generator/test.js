const fs = require('fs');
const path = require('path');

/**
 * Creates test directories and files based on test cases.
 * @param {Array<Object>} testCases - An array of test case objects.
 */
function createTestDirectoriesAndFiles(testCases) {
  const testDir = path.join("/Users/vishal/Desktop/PROJECTS/algoearth/apps/problems/Reverse-String", 'tests');
  const inputDir = path.join(testDir, 'inputs');
  const outputDir = path.join(testDir, 'outputs');

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
  {
    "input": "hello",
    "output": "olleh"
  },
  {
    "input": "world",
    "output": "dlrow"
  },
  {
    "input": "12345",
    "output": "54321"
  },
  {
    "input": "A man a plan a canal Panama",
    "output": "amanaP lanac a nalp a nam A"
  },
  {
    "input": "",
    "output": ""
  },
  {
    "input": "racecar",
    "output": "racecar"
  }
]

createTestDirectoriesAndFiles(testCases);