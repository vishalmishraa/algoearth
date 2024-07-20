##USER_CODE_HERE##
        
    const input = require('fs').readFileSync('/dev/problems/sort-array/tests/inputs/##INPUT_FILE_INDEX##.txt', 'utf8').trim().split('\n').join(' ').split(' ');
    const size_values = parseInt(input.shift());
const values = input.splice(0, size_values).map(Number);
    const result = sortArray(values);
    console.log(result);
        