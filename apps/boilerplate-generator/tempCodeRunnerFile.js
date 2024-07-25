function intersect(A) {
  function gcd(a, b) {
      while (b) {
          [a, b] = [b, a % b];
      }
      return a;
  }

  let g = A[0];
  for (let i = 1; i < A.length; i++) {
      g = gcd(g, A[i]);
      if (g === 1) {
          break;
      }
  }

  return g === 1 ? "Yes" : "No";
}

  
  const input = require('fs').readFileSync('/Users/vishal/Desktop/PROJECTS/algoearth/apps/problems/Intersting-Arrays/tests/inputs/5.txt', 'utf8').trim().split('\n').join(' ').split(' ');
  const size_A = parseInt(input.shift());
const A = input.splice(0, size_A).map(Number);
  const result = intersect(A);
  console.log(result);
      