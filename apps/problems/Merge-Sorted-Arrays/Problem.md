## Merge Sorted Arrays

Given two arrays of integers `array1` and `array2`, both sorted in non-decreasing order, merge them into a single array in such a way that the resulting array is sorted in non-decreasing order. Return the merged array.

### Example 1:

**Input:**
```
array1 = [1, 3, 5]
array2 = [2, 4, 6]
```

**Output:**
```
[1, 2, 3, 4, 5, 6]
```

**Explanation:** The two arrays are merged and sorted in non-decreasing order.

### Example 2:

**Input:**
```
array1 = [0, 9, 10]
array2 = [8, 11, 15]
```

**Output:**
```
[0, 8, 9, 10, 11, 15]
```

**Explanation:** The elements of `array1` and `array2` are merged into a single array, which is sorted in non-decreasing order.

### Constraints:

- The input arrays `array1` and `array2` are sorted in non-decreasing order.
- The size of the input arrays can vary from 0 to 10^5.