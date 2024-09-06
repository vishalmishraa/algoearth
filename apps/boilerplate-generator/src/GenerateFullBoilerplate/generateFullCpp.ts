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
    let lineIndex = 0;
    const inputReads = inputFields.map((field) => {
        if (field.type.startsWith("list<")) {
            const sizeRead = `int size_${field.name};\n  istringstream(lines[${lineIndex++}]) >> size_${field.name};`;
            const arrayDeclaration = `${makeType.ToCpp(field.type)} ${field.name}(size_${field.name});`;
            const arrayRead = `if (size_${field.name} > 0) {\n    istringstream iss(lines[${lineIndex++}]);\n    for (int i = 0; i < size_${field.name}; i++) {\n      iss >> ${field.name}[i];\n    }\n  }`;
            return `${sizeRead}\n  ${arrayDeclaration}\n  ${arrayRead}`;
        } else {
            return `${makeType.ToCpp(field.type)} ${field.name};\n  istringstream(lines[${lineIndex++}]) >> ${field.name};`;
        }
    });

    const inputReadsString = inputFields.length > 0 ? inputReads.join('\n') : "";
    const outputType = outputFields[0].type;
    const functionCall = `${outputType} result = ${functionName}(${inputFields.map((field) => field.name).join(", ")});`;
    const outputWrite = `cout << result << endl;`;

    return `#ifndef _GLIBCXX_NO_ASSERT
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
    ifstream file("${process.env.PV_DIR_PATH}/${problemName.replace(" ", "-")}/tests/inputs/##INPUT_FILE_INDEX##.txt");
    vector<string> lines;
    string line;
    while (getline(file, line)) lines.push_back(line);

    file.close();
    ${inputReadsString}
    ${functionCall}
    ${outputWrite}
    return 0;
}
`;
}