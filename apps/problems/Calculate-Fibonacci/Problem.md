Problem Statement: Check Fibonacci Number
Objective: Write a function isFibonacci that checks if a given number is a Fibonacci number. A Fibonacci number is a number that appears in the Fibonacci sequence, where each number is the sum of the two preceding ones, starting from 0 and 1.

Function Signature: def isFibonacci(n: int) -> bool

Input:

n (int): A non-negative integer to check if it is a Fibonacci number.
Output:

Returns True if n is a Fibonacci number, otherwise False.
Examples:

Input: n = 5 Output: True Explanation: 5 is a Fibonacci number (0, 1, 1, 2, 3, 5).

Input: n = 4 Output: False Explanation: 4 is not a Fibonacci number.

Input: n = 13 Output: True Explanation: 13 is a Fibonacci number (0, 1, 1, 2, 3, 5, 8, 13).

Constraints:

0 <= n <= 10^4
Note: The Fibonacci sequence starts with Fibonacci(0) = 0, Fibonacci(1) = 1.