#include <iostream>
    #include <fstream>
    #include <vector>
    #include <string>
    #include <sstream>
    #include <climits>
    
    ##USER_CODE_HERE##
    
    int main() {
      std::ifstream file("/dev/problems/Check-Palindrome/tests/inputs/##INPUT_FILE_INDEX##.txt");
      std::vector<std::string> lines;
      std::string line;
      while (std::getline(file, line)) lines.push_back(line);
    
      file.close();
      std::string text;
  std::istringstream(lines[0]) >> text;
      std::bool result = isPalindrome(text);
      std::cout << result << std::endl;
      return 0;
    }
    