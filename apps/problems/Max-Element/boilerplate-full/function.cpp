
            #include <stdio.h>
            #include <stdlib.h>
            #include <stdbool.h>
            #include <string.h>
            #include <limits.h>
            
            ##USER_CODE_HERE##
            
            int main() {
                FILE *file = fopen("/dev/problems/Max-Element/tests/inputs/##INPUT_FILE_INDEX##.txt", "r");
                vector<string> lines;
                string line;
                while (fgets(line, sizeof(line), file)) lines.push_back(line);
                fclose(file);
                int size_arr;
  fscanf(file, "%d", &size_arr);
  int* arr[size_arr];
  for (int i = 0; i < size_arr; i++) fscanf(file, "%d", &arr[i]);
                int result = maxElement(arr);
                fprintf(stdout, "%d\n", result);
                return 0;
                }
            