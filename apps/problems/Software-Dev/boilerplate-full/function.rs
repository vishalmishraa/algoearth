use std::fs::read_to_string;
    use std::io::{self};
    use std::str::Lines;
    
    ##USER_CODE_HERE##
    
    fn main() -> io::Result<()> {
      let input = read_to_string("/dev/problems/Software-Dev/tests/inputs/##INPUT_FILE_INDEX##.txt")?;
      let mut lines = input.lines();
      let F: i32 = lines.next().unwrap().parse().unwrap();
  let B: i32 = lines.next().unwrap().parse().unwrap();
  let D: i32 = lines.next().unwrap().parse().unwrap();
      let result = solve(F, B, D);
      println!("{}", result);
      Ok(())
    }
    