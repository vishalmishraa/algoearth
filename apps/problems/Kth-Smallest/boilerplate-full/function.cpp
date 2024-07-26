#include <iostream>
    #include <fstream>
    #include <vector>
    #include <string>
    #include <sstream>
    #include <climits>
    
    ##USER_CODE_HERE##
    
    int main() {
      std::ifstream file("/dev/problems/Kth-Smallest/tests/inputs/##INPUT_FILE_INDEX##.txt");
      std::vector<std::string> lines;
      std::string line;
      while (std::getline(file, line)) lines.push_back(line);
    
      file.close();
      int size_A;
  std::istringstream(lines[0]) >> size_A;
  std::vector<int> A(size_A);
  if(size_A != 0) {
  	std::istringstream iss(lines[1]);
  	for (int i=0; i < size_A; i++) iss >> A[i];
  }
  int size_B;
  std::istringstream(lines[1]) >> size_B;
  std::vector<int> B(size_B);
  if(size_B != 0) {
  	std::istringstream iss(lines[2]);
  	for (int i=0; i < size_B; i++) iss >> B[i];
  }
  int K;
  std::istringstream(lines[2]) >> K;
      std::int result = solve(A, B, K);
      std::cout << result << std::endl;
      return 0;
    }
    