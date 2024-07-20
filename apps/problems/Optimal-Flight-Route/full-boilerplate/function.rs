use std::fs::read_to_string;
    use std::io::{self};
    use std::str::Lines;
    
    ##USER_CODE_HERE##
    
    fn main() -> io::Result<()> {
      let input = read_to_string("/Users/vishal/Desktop/PROJECTS/algoearth3/apps/problems/optimal-flight route/tests/inputs/##INPUT_FILE_INDEX##.txt")?;
      let mut lines = input.lines();
      let departureCityID: i32 = lines.next().unwrap().parse().unwrap();
  let arrivalCityID: i32 = lines.next().unwrap().parse().unwrap();
  let maxStops: i32 = lines.next().unwrap().parse().unwrap();
  let size_layoverCosts: usize = lines.next().and_then(|line| line.parse().ok()).unwrap_or(0);
	let layoverCosts: Vec<i32> = parse_input(lines, size_layoverCosts);
  let maxLayoverTime: i32 = lines.next().unwrap().parse().unwrap();
      let result = findOptimalRoute(departureCityID, arrivalCityID, maxStops, layoverCosts, maxLayoverTime);
      println!("{}", result);
      Ok(())
    }
fn parse_input(mut input: Lines, size_arr: usize) -> Vec<i32> {
        let arr: Vec<i32> = input
            .next()
            .unwrap_or_default()
            .split_whitespace()
            .filter_map(|x| x.parse().ok())
            .collect();
    
        if size_arr == 0 {
            Vec::new()
        } else {
            arr
        }
    }
    