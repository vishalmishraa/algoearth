use std::fs::read_to_string;
            use std::io::{self};
            use std::str::Lines;

            ##USER_CODE_HERE##

            fn main() -> io::Result<()> {
            let input = read_to_string("/dev/problems/Merge-Sorted-Arrays/tests/inputs/##INPUT_FILE_INDEX##.txt")?;
            let mut lines = input.lines();
            
            let result = mergeSortedArrays();
            println!("{}", result);
            Ok(())
            }
            