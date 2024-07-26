
            #include <stdio.h>
            #include <stdlib.h>
            #include <stdbool.h>
            #include <string.h>
            #include <limits.h>
            
            ##USER_CODE_HERE##
            
            int main() {
                FILE *file = fopen("/dev/problems/Kth-Smallest/tests/inputs/##INPUT_FILE_INDEX##.txt", "r");
                vector<string> lines;
                string line;
                while (fgets(line, sizeof(line), file)) lines.push_back(line);
                fclose(file);
                int size_A;
  fscanf(file, "%d", &size_A);
  int* A[size_A];
  for (int i = 0; i < size_A; i++) fscanf(file, "%d", &A[i]);
  int size_B;
  fscanf(file, "%d", &size_B);
  int* B[size_B];
  for (int i = 0; i < size_B; i++) fscanf(file, "%d", &B[i]);
  int K;
  fscanf(file, "%d", &K);
                int result = solve(A, B, K);
                fprintf(stdout, "%d\n", result);
                return 0;
                }
            