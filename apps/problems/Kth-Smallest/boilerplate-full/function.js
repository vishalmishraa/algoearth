##USER_CODE_HERE##

            const input = require('fs').readFileSync('/dev/problems/Kth-Smallest/tests/inputs/##INPUT_FILE_INDEX##.txt', 'utf8').trim().split('\n').join(' ').split(' ');
            const size_A = parseInt(input.shift());
const A = input.splice(0, size_A).map(Number);
  const size_B = parseInt(input.shift());
const B = input.splice(0, size_B).map(Number);
  const K = parseInt(input.shift());
            const result = solve(A, B, K);
            console.log(result);
                