##USER_CODE_HERE##
    
    const input = require('fs').readFileSync('/dev/problems/Merge-Sorted-Arrays/tests/inputs/##INPUT_FILE_INDEX##.txt', 'utf8').trim().split('\n').join(' ').split(' ');
    
    const result = mergeSortedArrays();
    console.log(result);
        