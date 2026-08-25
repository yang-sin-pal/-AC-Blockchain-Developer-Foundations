# Lesson 1.1 – Block Validity Check (Blockchain Basics)

## Description
You are provided with a block-shaped object:

```ts
{
  index: number;
  timestamp: string;
  transactions: any[];
  previous_hash: string;
  current_hash: string;
}
```

Write a function `isValidBlock(block)` that checks:
- `current_hash` must exactly equal the SHA256 hash of `index + timestamp + transactions + previous_hash`

## Example Run
```ts
console.log(isValidBlock(block)); // true or false
```
