
            #include <stdio.h>
            #include <stdlib.h>
            #include <stdbool.h>
            #include <string.h>
            #include <limits.h>
            
            ##USER_CODE_HERE##
            
            int main() {
                FILE *file = fopen("/dev/problems/Reverse-String/tests/inputs/##INPUT_FILE_INDEX##.txt", "r");
                vector<string> lines;
                string line;
                while (fgets(line, sizeof(line), file)) lines.push_back(line);
                fclose(file);
                char* originalString;
  fscanf(file, "%d", &originalString);
                string result = reverseString(originalString);
                fprintf(stdout, "%d\n", result);
                return 0;
                }
            