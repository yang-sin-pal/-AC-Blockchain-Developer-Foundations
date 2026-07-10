# Bài 4.2 – Báo cáo
#### 1. Deploy contract StudentRegistryV2
![alt text](solution_images/1_Deploy_successfully.png)
#### 2. Check owner address
![alt text](solution_images/2_check_owner_address.png)
#### 3. Kiểm tra isStudentRegistered và getStudent trước khi đăng ký – kết quả: false / rỗng
![alt text](solution_images/3_test_isStudentRegistered_account1_before_register_expect_false.png)
![alt text](solution_images/4_test_getStudent_account1_before_register_expect_false.png)
#### 4. Đăng ký tài khoản 1 với owner – "phat", tuổi 22 – có event
![alt text](solution_images/5_test_register_account1_with_owner_info_phat_22.png)
![alt text](solution_images/6_test_register_account1_with_owner_info_phat_22_see_event.png)
#### 5. Đăng ký với non-owner – giao dịch thất bại (revert)
![alt text](solution_images/7_test_register_with_non_owner.png)
![alt text](solution_images/8_test_register_with_non_owner_expect_transaction_failed.png)
#### 6. Kiểm tra getStudent tài khoản 1 sau khi đăng ký – kết quả: đúng thông tin
![alt text](solution_images/9_test_getStudent_account1_after_register_expect_info.png)
