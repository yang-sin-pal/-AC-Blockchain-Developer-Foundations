# Lesson 3.2 – Report

#### 1. Write the contract source code on Remix IDE
![alt text](solution_images/write_contract.png)

#### 2. Compile the contract
![alt text](solution_images/compile_contract.png)

#### 3. Deploy the contract
![alt text](solution_images/deploy_contract.png)

#### 4. Check the initial `minAge` value (default = 18)
![alt text](solution_images/get_minAge_before_change.png)

#### 5. Test `checkEligibility(17)` → `false` (less than 18)
![alt text](solution_images/test_checkEligibility_17_false.png)

#### 6. Test `checkEligibility(18)` → `true` (equal to 18)
![alt text](solution_images/test_checkEligibility_18_true.png)

#### 7. Test `checkEligibility(19)` → `true` (greater than 18)
![alt text](solution_images/test_checkEligibility_19_true.png)

#### 8. Update `minAge` to 20 using `updateMinAge(20)`
![alt text](solution_images/test_updateMinAge_to_20.png)

#### 9. Confirm `minAge` has been updated to 20
![alt text](solution_images/get_minAge_after_change.png)

#### 10. Test the owner constraint: call `updateMinAge` from a non-owner account → revert
![alt text](solution_images/test_updateMinAge_with_nonOwner.png)
