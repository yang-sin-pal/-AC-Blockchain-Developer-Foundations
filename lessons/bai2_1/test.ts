import { SmartContract } from "./solution.js";

const contract = new SmartContract("Hello");
console.assert(contract.getMessage() === "Hello", "Test 1 Failed");

contract.updateMessage("Blockchain!");
console.assert(contract.getMessage() === "Blockchain!", "Test 2 Failed");

console.log("✅ All tests passed!");