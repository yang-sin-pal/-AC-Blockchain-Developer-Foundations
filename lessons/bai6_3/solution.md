# Bài 6.3 – Báo cáo

#### 1. Viết contract `MyNFT.sol` — ERC721 kế thừa OpenZeppelin v5, tên "MyNFT", symbol "MNFT", hàm `mint(address)` chỉ owner gọi được, dùng `_safeMint` với id tăng dần qua biến `nextTokenId`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {
    uint256 public nextTokenId;

    constructor() ERC721("MyNFT", "MNFT") Ownable(msg.sender) {}

    function mint(address to) external onlyOwner {
        _safeMint(to, nextTokenId);
        nextTokenId++;
    }
}
```

#### 2. Viết unit test và build lại template

Thêm `test/MyNFT.test.ts` gồm 6 test: name/symbol đúng, `nextTokenId` khởi tạo bằng 0, mint xong `ownerOf(0)` trả về deployer, `nextTokenId` tăng sau mỗi lần mint, non-owner mint bị revert với custom error `OwnableUnauthorizedAccount`. Chạy `npx hardhat clean && npx hardhat compile && npx hardhat test` — tổng cộng **13 passing** (2 Counter + 5 MyToken + 6 MyNFT).

Hai lỗi build đã xử lý trên đường đi:

- Hardhat 2 mặc định dịch EVM target `paris`, khiến OpenZeppelin 5.x dùng opcode `mcopy` (Cancun) bị lỗi compile → pin `evmVersion: "cancun"` trong `hardhat.config.ts`
- `@nomicfoundation/hardhat-chai-matchers` v1 khai báo peer ethers ^5, sai với ethers v6 của template → nâng lên `^2.0.0` và import matcher trong file test để dùng `revertedWithCustomError`

#### 3. Viết script deploy (`deploy/03-nft.ts`, tag `nft`) và triển khai lên Sepolia

Script theo spec: deploy contract → mint token #0 cho deployer → in `ownerOf(0)`. Chạy lệnh `npx hardhat deploy --network sepolia --tags nft`:

![Deploy MyNFT lên Sepolia bằng hardhat-deploy](solution_images/1_deploy_nft_mint_to_deployer.png)

- Địa chỉ contract: [`0xDfee82bf1967A3110B7430B749a82ab2cFe9A960`](https://sepolia.etherscan.io/address/0xDfee82bf1967A3110B7430B749a82ab2cFe9A960)
- Lần chạy đầu deploy lên mạng thành công nhưng script văng lỗi ngay sau đó: `getNamedAccounts()` trả về địa chỉ dạng **string** nên `.address` là `undefined` → sửa thành truyền thẳng `deployer` vào `mint()`
- Lần chạy thứ hai hardhat-deploy in `reusing "MyNFT" …`: hardhat-deploy 1.x so sánh transaction deploy gốc với transaction sắp gửi — bytecode + constructor args không đổi ⇒ tái sử dụng địa chỉ cũ bất kể `skipIfAlreadyDeployed: false`. Do contract được reuse, token #0 thuộc về một địa chỉ random từ lần chạy script cũ (`0x9C7e…5Af1`, private key đã bỏ), token #1 mới thuộc về deployer
- Source code đã được verify trên Etherscan (Etherscan tự động khớp bytecode Exact/Similar Match với bản đã verify)

#### 4. Hoàn thiện `test.ts` của bài và chạy `npm run lesson bai6_3`

File test dùng ethers v6 + RPC PublicNode, ABI ERC721 tối thiểu (`name`, `symbol`, `nextTokenId`, `mint`, `ownerOf`), ví ký giao dịch lấy từ `$env:TESTNET_PRIVATE_KEY`; đọc thông tin contract, mint một NFT cho wallet rồi in chủ sở hữu. Chạy 2 lần liên tiếp — `nextTokenId` tăng đều qua từng lần chạy:

![Chạy npm run lesson bai6_3 hai lần, nextTokenId tăng dần](solution_images/2_npm_run_lesson_bai6_3_two_times_nextTokenID_increase.png)
