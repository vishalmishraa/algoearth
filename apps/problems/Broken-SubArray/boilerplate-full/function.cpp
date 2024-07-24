#include <iostream>
    #include <fstream>
    #include <vector>
    #include <string>
    #include <sstream>
    #include <climits>
    
    ##USER_CODE_HERE##
    
    int main() {
      std::ifstream file("/dev/problems/Broken-SubArray/tests/inputs/##INPUT_FILE_INDEX##.txt");
      std::vector<std::string> lines;
      std::string line;
      while (std::getline(file, line)) lines.push_back(line);
    
      file.close();
      int size_A;
  std::istringstream(lines[0]) >> size_A;
  std::vector<int> A(size_A);
  if(!size_A==0) {
  	std::istringstream iss(lines[1]);
  	for (int i=0; i < size_arr; i++) iss >> arr[i];
  }
  int B;
  std::istringstream(lines[1]) >> B;
      int result = solve(A, B);
      std::cout << result << std::endl;
      return 0;
    }
    