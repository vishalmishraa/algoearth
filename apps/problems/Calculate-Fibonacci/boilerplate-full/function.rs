use std::fs::read_to_string;
            use std::io::{self};
            use std::str::Lines;

            ##USER_CODE_HERE##

            fn main() -> io::Result<()> {
            let input = read_to_string("/dev/problems/Calculate-Fibonacci/tests/inputs/##INPUT_FILE_INDEX##.txt")?;
            let mut lines = input.lines();
            let n: i32 = lines.next().unwrap().parse().unwrap();
            let result = calculateFibonacci(n);
            println!("{}", result);
            Ok(())
            }
            