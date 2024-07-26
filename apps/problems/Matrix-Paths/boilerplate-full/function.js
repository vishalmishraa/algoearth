##USER_CODE_HERE##

            const input = require('fs').readFileSync('/dev/problems/Matrix-Paths/tests/inputs/##INPUT_FILE_INDEX##.txt', 'utf8').trim().split('\n').join(' ').split(' ');
            const s = parseInt(input.shift());
            const result = solve(s);
            console.log(result);
                