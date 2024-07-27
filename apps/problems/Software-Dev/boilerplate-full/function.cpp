#include <iostream>
    #include <fstream>
    #include <vector>
    #include <string>
    #include <sstream>
    #include <climits>
    
    ##USER_CODE_HERE##
    
    int main() {
      std::ifstream file("/dev/problems/Software-Dev/tests/inputs/##INPUT_FILE_INDEX##.txt");
      std::vector<std::string> lines;
      std::string line;
      while (std::getline(file, line)) lines.push_back(line);
    
      file.close();
      int F;
  std::istringstream(lines[0]) >> F;
  int B;
  std::istringstream(lines[1]) >> B;
  int D;
  std::istringstream(lines[2]) >> D;
      std::int result = solve(F, B, D);
      std::cout << result << std::endl;
      return 0;
    }
    