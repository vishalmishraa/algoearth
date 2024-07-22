##USER_CODE_HERE##
    
    const input = require('fs').readFileSync('/dev/problems/Find-Prime-Numbers/tests/inputs/##INPUT_FILE_INDEX##.txt', 'utf8').trim().split('\n').join(' ').split(' ');
    const limit = parseInt(input.shift());
    const result = findPrimes(limit);
    console.log(result);
        