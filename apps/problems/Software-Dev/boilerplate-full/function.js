##USER_CODE_HERE##

            const input = require('fs').readFileSync('/dev/problems/Software-Dev/tests/inputs/##INPUT_FILE_INDEX##.txt', 'utf8').trim().split('\n').join(' ').split(' ');
            const F = parseInt(input.shift());
  const B = parseInt(input.shift());
  const D = parseInt(input.shift());
            const result = solve(F, B, D);
            console.log(result);
                