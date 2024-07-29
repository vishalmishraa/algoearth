
            #include <stdio.h>
            #include <stdlib.h>
            #include <stdbool.h>
            #include <string.h>
            #include <limits.h>
            
            ##USER_CODE_HERE##
            
            int main() {
                FILE *file = fopen("/dev/problems/Find-Median/tests/inputs/##INPUT_FILE_INDEX##.txt", "r");
                vector<string> lines;
                string line;
                while (fgets(line, sizeof(line), file)) lines.push_back(line);
                fclose(file);
                int size_numbers;
  fscanf(file, "%d", &size_numbers);
  int* numbers[size_numbers];
  for (int i = 0; i < size_numbers; i++) fscanf(file, "%d", &numbers[i]);
                float result = findMedian(numbers);
                fprintf(stdout, "%d\n", result);
                return 0;
                }
            