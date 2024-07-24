#include <iostream>
    #include <fstream>
    #include <vector>
    #include <string>
    #include <sstream>
    #include <climits>
    
    ##USER_CODE_HERE##
    
    int main() {
      std::ifstream file("/dev/problems/Sort-Array/tests/inputs/##INPUT_FILE_INDEX##.txt");
      std::vector<std::string> lines;
      std::string line;
      while (std::getline(file, line)) lines.push_back(line);
    
      file.close();
      int size_values;
  std::istringstream(lines[0]) >> size_values;
  std::vector<int> values(size_values);
  if(!size_values==0) {
  	std::istringstream iss(lines[1]);
  	for (int i=0; i < size_arr; i++) iss >> arr[i];
  }
      list<int> result = sortArray(values);
      std::cout << result << std::endl;
      return 0;
    }
    