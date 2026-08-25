# Bài 7.2 – Báo cáo

#### 1. Bối cảnh — contract `MyMintableToken` đã được deploy ở bài 7.1

- Địa chỉ: [`0x43F7E84A4785Ae62c4B27dD591725b0C4BfA1B82`](https://sepolia.etherscan.io/address/0x43F7E84A4785Ae62c4B27dD591725b0C4BfA1B82)
- Plugin `@nomicfoundation/hardhat-verify` và cấu hình `etherscan.apiKey` (đọc từ biến môi trường `ETHERSCAN_API`) có sẵn trong `ac-hardhat-template/hardhat.config.ts`, nên Bước 1–3 của đề không phải làm lại

#### 2. Vì sao không chạy `npx hardhat verify` như Bước 4 của đề

Toolchain Hardhat 2 đóng băng `hardhat-verify` ở dòng 2.x, trong khi Etherscan đã nghỉ hưu API V1 (tháng 5/2025) — thứ mà dòng CLI này vẫn gọi — nên lệnh verify chết sẵn trên toolchain này. Luồng thay thế: nộp thủ công Standard JSON Input từ `deployments/sepolia/solcInputs/999f835e6a53cc806b1cec02f4c86694.json` qua giao diện web.

#### 3. Etherscan tự động xác thực contract — Similar Match

Trước cả khi kịp verify tay, Etherscan đã tự động khớp bytecode của contract với một deployment đã verify trước đó (**Similar Match** — cơ chế so khớp bỏ qua constructor args). Nhờ đó source code hiển thị công khai và hai tab Read/Write Contract mở sẵn:

![Contract tự động được xác thực nhờ Similar Match](solution_images/1_the_contrat_autoverified_by_similar_contract.png)

#### 4. Đọc dữ liệu qua tab Read Contract

Gọi `balanceOf(owner)` trên tab Read Contract để xem số dư hiện tại của chủ sở hữu:

![Xem balanceOf của owner bằng Read Contract](solution_images/2_view_balanceOf_owner_with_readContract.png)

#### 5. Gọi `mint` bằng owner qua tab Write Contract — thành công

Kết nối ví owner (deployer) rồi gọi `mint(to, amount)`:

![Mint thành công bằng owner](solution_images/3_perform_mint_Owner.png)

Kiểm tra lại balance — số dư tăng đúng bằng lượng vừa mint:

![Kiểm tra balance sau khi mint](solution_images/4_check_balance_again.png)

→ Modifier `onlyOwner` cho phép owner gọi `mint` bình thường.

#### 6. Gọi `mint` bằng non-owner — bị revert như kỳ vọng

Kết nối ví burner (không phải owner) rồi gọi `mint` — giao dịch thất bại trên Etherscan với custom error `OwnableUnauthorizedAccount`:

![Mint bằng non-owner bị revert/Fail](solution_images/5_perform_mint_NonOwner_expectedRevertOrFail.png)

→ Chứng minh ngay trên Etherscan rằng chỉ owner mới mint được token.

---

## 🎯 Kết quả nộp bài

- Địa chỉ contract: `0x43F7E84A4785Ae62c4B27dD591725b0C4BfA1B82`
- Link verified trên Etherscan: [tab Code của contract](https://sepolia.etherscan.io/address/0x43F7E84A4785Ae62c4B27dD591725b0C4BfA1B82#code)
- Screenshot verify thành công: mục 3
