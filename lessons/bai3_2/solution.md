# Bài 3.2 – Báo cáo

#### 1. Viết mã nguồn hợp đồng trên Remix IDE
![alt text](solution_images/write_contract.png)

#### 2. Biên dịch hợp đồng
![alt text](solution_images/compile_contract.png)

#### 3. Triển khai hợp đồng
![alt text](solution_images/deploy_contract.png)

#### 4. Kiểm tra giá trị `minAge` ban đầu (mặc định = 18)
![alt text](solution_images/get_minAge_before_change.png)

#### 5. Kiểm tra `checkEligibility(17)` → `false` (nhỏ hơn 18)
![alt text](solution_images/test_checkEligibility_17_false.png)

#### 6. Kiểm tra `checkEligibility(18)` → `true` (bằng 18)
![alt text](solution_images/test_checkEligibility_18_true.png)

#### 7. Kiểm tra `checkEligibility(19)` → `true` (lớn hơn 18)
![alt text](solution_images/test_checkEligibility_19_true.png)

#### 8. Cập nhật `minAge` thành 20 bằng `updateMinAge(20)`
![alt text](solution_images/test_updateMinAge_to_20.png)

#### 9. Xác nhận `minAge` đã được cập nhật thành 20
![alt text](solution_images/get_minAge_after_change.png)

#### 10. Kiểm tra ràng buộc owner: gọi `updateMinAge` bằng tài khoản không phải owner → revert
![alt text](solution_images/test_updateMinAge_with_nonOwner.png)
