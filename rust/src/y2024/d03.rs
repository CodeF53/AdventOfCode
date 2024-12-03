use std::fs;
use regex::Regex;

pub fn solution() {
    let input = fs::read_to_string("src/y2024/d03.input")
        .expect("Should have been able to read the file");
        
    let valid_operation_regex = Regex::new(r"mul\(\d+,\d+\)|(?:don't|do)\(\)").unwrap();
    let mult_regex = Regex::new(r"^mul\((\d+),(\d+)\)$").unwrap();

    let mut result_p1 = 0;
    let mut result_p2 = 0;
    let mut do_mult = true;
    for (operation, []) in valid_operation_regex.captures_iter(&input).map(|c| c.extract()) {
        if operation == "do()" { do_mult = true }
        if operation == "don't()" { do_mult = false }
        if !operation.starts_with("mul") { continue }

        let (_, [a, b]) = mult_regex.captures(operation).expect("Should've matched regex").extract();
        let val = a.parse::<i32>().unwrap() * b.parse::<i32>().unwrap();
        result_p1 += val; 
        if do_mult { result_p2 += val }
    }
    
    println!("part 1: {result_p1}");
    println!("part 2: {result_p2}");
}
