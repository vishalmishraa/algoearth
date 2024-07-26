##USER_CODE_HERE##
    
    const input = require('fs').readFileSync('/dev/problems/Calculate-Fibonacci/tests/inputs/##INPUT_FILE_INDEX##.txt', 'utf8').trim().split('\n').join(' ').split(' ');
    const n = parseInt(input.shift());
    const result = calculateFibonacci(n);
    console.log(result);
        