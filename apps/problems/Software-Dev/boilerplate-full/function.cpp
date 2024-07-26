
            #include <stdio.h>
            #include <stdlib.h>
            #include <stdbool.h>
            #include <string.h>
            #include <limits.h>
            
            ##USER_CODE_HERE##
            
            int main() {
                FILE *file = fopen("/dev/problems/Software-Dev/tests/inputs/##INPUT_FILE_INDEX##.txt", "r");
                vector<string> lines;
                string line;
                while (fgets(line, sizeof(line), file)) lines.push_back(line);
                fclose(file);
                int F;
  fscanf(file, "%d", &F);
  int B;
  fscanf(file, "%d", &B);
  int D;
  fscanf(file, "%d", &D);
                int result = solve(F, B, D);
                fprintf(stdout, "%d\n", result);
                return 0;
                }
            