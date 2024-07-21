##USER_CODE_HERE##
    
    const input = require('fs').readFileSync('/dev/problems/find-median/tests/inputs/##INPUT_FILE_INDEX##.txt', 'utf8').trim().split('\n').join(' ').split(' ');
    const size_numbers = parseInt(input.shift());
const numbers = input.splice(0, size_numbers).map(Number);
    const result = findMedian(numbers);
    console.log(result);
        