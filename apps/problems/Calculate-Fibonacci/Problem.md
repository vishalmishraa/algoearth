# Problem Statement: Calculate Fibonacci Number

## Objective
Write a function `calculateFibonacci` that calculates the nth Fibonacci number. A Fibonacci number is a number that appears in the Fibonacci sequence, where each number is the sum of the two preceding ones, starting from 0 and 1.

## Function Signature
`function calculateFibonacci(n)`

## Input
- `n` (int): A non-negative integer to calculate the nth Fibonacci number.

## Output
- Returns the nth Fibonacci number.

## Examples
- **Input:** `n = 5` 
   - **Output:** `5` 
   - **Explanation:** The 5th Fibonacci number is 5 (0, 1, 1, 2, 3, 5).

- **Input:** `n = 4` 
  **Output:** `3` 
  **Explanation:** The 4th Fibonacci number is 3 (0, 1, 1, 2, 3).

- **Input:** `n = 13` 
   - **Output:** `233` 
   - **Explanation:** The 13th Fibonacci number is 233 (0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233).

## Constraints
- `0 <= n <= 10^4`

## Note
The Fibonacci sequence starts with Fibonacci(0) = 0, Fibonacci(1) = 1.