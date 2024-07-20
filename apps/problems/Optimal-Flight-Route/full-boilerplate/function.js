##USER_CODE_HERE##
        
    const input = require('fs').readFileSync('/dev/problems/optimal-flight route/tests/inputs/##INPUT_FILE_INDEX##.txt', 'utf8').trim().split('\n').join(' ').split(' ');
    const departureCityID = parseInt(input.shift());
  const arrivalCityID = parseInt(input.shift());
  const maxStops = parseInt(input.shift());
  const size_layoverCosts = parseInt(input.shift());
const layoverCosts = input.splice(0, size_layoverCosts).map(Number);
  const maxLayoverTime = parseInt(input.shift());
    const result = findOptimalRoute(departureCityID, arrivalCityID, maxStops, layoverCosts, maxLayoverTime);
    console.log(result);
        