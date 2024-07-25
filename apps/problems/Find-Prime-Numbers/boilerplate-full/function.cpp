#include <iostream>
    #include <fstream>
    #include <vector>
    #include <string>
    #include <sstream>
    #include <climits>
    
    ##USER_CODE_HERE##
    
    int main() {
      std::ifstream file("/dev/problems/Find-Prime-Numbers/tests/inputs/##INPUT_FILE_INDEX##.txt");
      std::vector<std::string> lines;
      std::string line;
      while (std::getline(file, line)) lines.push_back(line);
    
      file.close();
      int limit;
  std::istringstream(lines[0]) >> limit;
      std::list<int> result = findPrimes(limit);
      std::cout << result << std::endl;
      return 0;
    }
    