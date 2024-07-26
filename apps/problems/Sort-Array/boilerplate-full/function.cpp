
            #include <stdio.h>
            #include <stdlib.h>
            #include <stdbool.h>
            #include <string.h>
            #include <limits.h>
            
            ##USER_CODE_HERE##
            
            int main() {
                FILE *file = fopen("/dev/problems/Sort-Array/tests/inputs/##INPUT_FILE_INDEX##.txt", "r");
                vector<string> lines;
                string line;
                while (fgets(line, sizeof(line), file)) lines.push_back(line);
                fclose(file);
                int size_values;
  fscanf(file, "%d", &size_values);
  int* values[size_values];
  for (int i = 0; i < size_values; i++) fscanf(file, "%d", &values[i]);
                list<int> result = sortArray(values);
                fprintf(stdout, "%d\n", result);
                return 0;
                }
            