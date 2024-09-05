import { IGenerator } from '../Parser/types'
import MakeType from "../Parser/MapDataType";
import dotenv from 'dotenv'
dotenv.config();

export default function generateFullCpp({
    problemName,
    functionName,
    inputFields,
    outputFields
}: IGenerator): string {
    const makeType = new MakeType()
    const inputReads = inputFields
        .map((field, index) => {
            if (field.type.startsWith("list<")) {
                return `int size_${field.name};\n  std::istringstream(lines[${index}]) >> size_${field.name};\n  ${makeType.ToCpp(field.type)} ${field.name}(size_${field.name});\n  if(size_${field.name} != 0) {\n  \tstd::istringstream iss(lines[${index + 1}]);\n  \tfor (int i=0; i < size_${field.name}; i++) iss >> ${field.name}[i];\n  }`;
            } else {
                return `${makeType.ToCpp(field.type)} ${field.name};\n  std::istringstream(lines[${index}]) >> ${field.name};`;
            }
        })
        .join("\n  ");
    const outputType = outputFields[0].type;
    const functionCall = `${outputType} result = ${functionName}(${inputFields.map((field) => field.name).join(", ")});`;
    const outputWrite = `std::cout << result << std::endl;`;

    return `  #ifndef _GLIBCXX_NO_ASSERT
                #include <cassert>
                #endif
                #include <cctype>
                #include <cerrno>
                #include <cfloat>
                #include <ciso646>
                #include <climits>
                #include <clocale>
                #include <cmath>
                #include <csetjmp>
                #include <csignal>
                #include <cstdarg>
                #include <cstddef>
                #include <cstdio>
                #include <cstdlib>
                #include <cstring>
                #include <ctime>

                #if __cplusplus >= 201103L
                #include <ccomplex>
                #include <cfenv>
                #include <cinttypes>
                #include <cstdbool>
                #include <cstdint>
                #include <ctgmath>
                #include <cwchar>
                #include <cwctype>
                #include <exception>
                #include <stdexcept>
                #endif

                // C++
                #include <algorithm>
                #include <bitset>
                #include <complex>
                #include <deque>
                #include <exception>
                #include <fstream>
                #include <functional>
                #include <iomanip>
                #include <ios>
                #include <iosfwd>
                #include <iostream>
                #include <istream>
                #include <iterator>
                #include <limits>
                #include <list>
                #include <locale>
                #include <map>
                #include <memory>
                #include <new>
                #include <numeric>
                #include <ostream>
                #include <queue>
                #include <set>
                #include <sstream>
                #include <stack>
                #include <stdexcept>
                #include <streambuf>
                #include <string>
                #include <typeinfo>
                #include <utility>
                #include <valarray>
                #include <vector>

                #if __cplusplus >= 201103L
                #include <array>
                #include <atomic>
                #include <chrono>
                #include <condition_variable>
                #include <forward_list>
                #include <future>
                #include <initializer_list>
                #include <mutex>
                #include <random>
                #include <ratio>
                #include <regex>
                #include <scoped_allocator>
                #include <system_error>
                #include <thread>
                #include <tuple>
                #include <typeindex>
                #include <type_traits>
                #include <unordered_map>
                #include <unordered_set>
                #endif
                using namespace std;


            ##USER_CODE_HERE##

            int main() {
            std::ifstream file("${process.env.PV_DIR_PATH}/${problemName.replace(" ", "-")}/tests/inputs/##INPUT_FILE_INDEX##.txt");
            std::vector<std::string> lines;
            std::string line;
            while (std::getline(file, line)) lines.push_back(line);

            file.close();
            ${inputReads}
            ${functionCall}
            ${outputWrite}
            return 0;
            }
            `;
}