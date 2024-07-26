##USER_CODE_HERE##

            const input = require('fs').readFileSync('/dev/problems/Check-Palindrome/tests/inputs/##INPUT_FILE_INDEX##.txt', 'utf8').trim().split('\n').join(' ').split(' ');
            const text = parseInt(input.shift());
            const result = isPalindrome(text);
            console.log(result);
                