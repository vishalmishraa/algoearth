
            #include <stdio.h>
            #include <stdlib.h>
            #include <stdbool.h>
            #include <string.h>
            #include <limits.h>
            
            ##USER_CODE_HERE##
            
            int main() {
                FILE *file = fopen("/dev/problems/Two-Sum/tests/inputs/##INPUT_FILE_INDEX##.txt", "r");
                vector<string> lines;
                string line;
                while (fgets(line, sizeof(line), file)) lines.push_back(line);
                fclose(file);
                int num1;
  fscanf(file, "%d", &num1);
  int num2;
  fscanf(file, "%d", &num2);
                int result = sum(num1, num2);
                fprintf(stdout, "%d\n", result);
                return 0;
                }
            