##USER_CODE_HERE##

            const input = require('fs').readFileSync('/dev/problems/Reverse-String/tests/inputs/##INPUT_FILE_INDEX##.txt', 'utf8').trim().split('\n').join(' ').split(' ');
            const originalString = parseInt(input.shift());
            const result = reverseString(originalString);
            console.log(result);
                