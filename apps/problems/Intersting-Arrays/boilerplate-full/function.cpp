
            #include <stdio.h>
            #include <stdlib.h>
            #include <stdbool.h>
            #include <string.h>
            #include <limits.h>
            
            ##USER_CODE_HERE##
            
            int main() {
                FILE *file = fopen("/dev/problems/Intersting-Arrays/tests/inputs/##INPUT_FILE_INDEX##.txt", "r");
                vector<string> lines;
                string line;
                while (fgets(line, sizeof(line), file)) lines.push_back(line);
                fclose(file);
                int size_A;
  fscanf(file, "%d", &size_A);
  int* A[size_A];
  for (int i = 0; i < size_A; i++) fscanf(file, "%d", &A[i]);
                string result = intersect(A);
                fprintf(stdout, "%d\n", result);
                return 0;
                }
            