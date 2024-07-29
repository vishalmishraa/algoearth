##USER_CODE_HERE##

            const input = require('fs').readFileSync('/dev/problems/Broken-SubArray/tests/inputs/##INPUT_FILE_INDEX##.txt', 'utf8').trim().split('\n').join(' ').split(' ');
            const size_A = parseInt(input.shift());
const A = input.splice(0, size_A).map(Number);
  const B = parseInt(input.shift());
            const result = solve(A, B);
            console.log(result);
                