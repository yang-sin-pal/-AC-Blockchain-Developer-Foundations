# Lesson 4.2 – Report
#### 1. Deploy the StudentRegistryV2 contract
![alt text](solution_images/1_Deploy_successfully.png)
#### 2. Check the owner address
![alt text](solution_images/2_check_owner_address.png)
#### 3. Check isStudentRegistered and getStudent before registering – result: false / empty
![alt text](solution_images/3_test_isStudentRegistered_account1_before_register_expect_false.png)
![alt text](solution_images/4_test_getStudent_account1_before_register_expect_false.png)
#### 4. Register account 1 with owner – "phat", age 22 – event emitted
![alt text](solution_images/5_test_register_account1_with_owner_info_phat_22.png)
![alt text](solution_images/6_test_register_account1_with_owner_info_phat_22_see_event.png)
#### 5. Register with non-owner – transaction fails (revert)
![alt text](solution_images/7_test_register_with_non_owner.png)
![alt text](solution_images/8_test_register_with_non_owner_expect_transaction_failed.png)
#### 6. Check getStudent for account 1 after registering – result: correct information
![alt text](solution_images/9_test_getStudent_account1_after_register_expect_info.png)
