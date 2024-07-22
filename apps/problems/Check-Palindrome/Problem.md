## Problem Statement: Check Palindrome

### Objective: 
- Write a function isPalindrome that determines if a given string is a palindrome. A palindrome is a word, phrase, number, or other sequence of characters that reads the same forward and backward, ignoring cases, spaces, and punctuation.

### Function Signature: def isPalindrome(s: str) -> bool

Input:

s (str): A string to check if it is a palindrome.

Output:

Returns True if s is a palindrome, otherwise False.

Examples:

Input: s = "madam" Output: True Explanation: "madam" reads the same forward and backward.

Input: s = "hello" Output: False Explanation: "hello" does not read the same forward and backward.

Input: s = "A man a plan a canal Panama" Output: True Explanation: Ignoring cases, spaces, and punctuation, "AmanaplanacanalPanama" reads the same forward and backward.

Constraints:

1 <= s.length <= 10^5
s consists only of printable ASCII characters.
Note: The function should ignore cases, spaces, and punctuation while determining if the string is a palindrome.