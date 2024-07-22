#include <iostream>
    #include <fstream>
    #include <vector>
    #include <string>
    #include <sstream>
    #include <climits>
    
    ##USER_CODE_HERE##
    
    int main() {
      std::ifstream file("/dev/problems/Convert-Celsius-to-Fahrenheit/tests/inputs/##INPUT_FILE_INDEX##.txt");
      std::vector<std::string> lines;
      std::string line;
      while (std::getline(file, line)) lines.push_back(line);
    
      file.close();
      float celsius;
  std::istringstream(lines[0]) >> celsius;
      float result = celsiusToFahrenheit(celsius);
      std::cout << result << std::endl;
      return 0;
    }
    