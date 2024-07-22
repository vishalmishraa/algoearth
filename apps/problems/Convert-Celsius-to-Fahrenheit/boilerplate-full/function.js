##USER_CODE_HERE##
    
    const input = require('fs').readFileSync('/dev/problems/Convert-Celsius-to-Fahrenheit/tests/inputs/##INPUT_FILE_INDEX##.txt', 'utf8').trim().split('\n').join(' ').split(' ');
    const celsius = parseInt(input.shift());
    const result = celsiusToFahrenheit(celsius);
    console.log(result);
        