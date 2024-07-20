#include <iostream>
    #include <fstream>
    #include <vector>
    #include <string>
    #include <sstream>
    #include <climits>
    
    ##USER_CODE_HERE##
    
    int main() {
      std::ifstream file("/Users/vishal/Desktop/PROJECTS/algoearth3/apps/problems/optimal-flight route/tests/inputs/##INPUT_FILE_INDEX##.txt");
      std::vector<std::string> lines;
      std::string line;
      while (std::getline(file, line)) lines.push_back(line);
    
      file.close();
      int departureCityID;
  std::istringstream(lines[0]) >> departureCityID;
  int arrivalCityID;
  std::istringstream(lines[1]) >> arrivalCityID;
  int maxStops;
  std::istringstream(lines[2]) >> maxStops;
  int size_layoverCosts;
  std::istringstream(lines[3]) >> size_layoverCosts;
  std::vector<int> layoverCosts(size_layoverCosts);
  if(!size_layoverCosts==0) {
  	std::istringstream iss(lines[4]);
  	for (int i=0; i < size_arr; i++) iss >> arr[i];
  }
  int maxLayoverTime;
  std::istringstream(lines[4]) >> maxLayoverTime;
      list<int> result = findOptimalRoute(departureCityID, arrivalCityID, maxStops, layoverCosts, maxLayoverTime);
      std::cout << result << std::endl;
      return 0;
    }
    