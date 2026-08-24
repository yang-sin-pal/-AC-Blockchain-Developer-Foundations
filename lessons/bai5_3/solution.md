# Bài 5.3 – Báo cáo

> - **Contract:** [`0xb656c0ce3B333Ad0F9486CfB9Fed2BF4944A3351`](https://sepolia.etherscan.io/address/0xb656c0ce3B333Ad0F9486CfB9Fed2BF4944A3351) (Counter deployed in Bài 5.2)
> - **ABI:** `["function getCount() public view returns (uint)", "function increment() public"]`

#### 1. Script ethers.js connects to the contract via ABI and calls `getCount()` (`npx ts-node test.ts`) — prints `Current count is: 1`
![Run script](solution_images/1_npx_ts-node_test_ts.png)

---

## 📝 Ghi chú

### Fix đã áp dụng trước khi chạy
- `test.ts:4` ban đầu trỏ tới `https://eth-sepolia.public.blastapi.io` — RPC công khai của BlastAPI đã ngừng hoạt động (trả lỗi 403), nên đã thay bằng `https://ethereum-sepolia-rpc.publicnode.com`
- Địa chỉ placeholder ở `test.ts:10` được thay bằng contract Counter tự deploy ở Bài 5.2 (`0xb656c0ce3B333Ad0F9486CfB9Fed2BF4944A3351`)

### Bài học rút ra — frontend tương tác với smart contract như thế nào
- Frontend không bao giờ nói chuyện trực tiếp với blockchain; nó gửi request JSON-RPC qua một **provider** (ở đây: `ethers.JsonRpcProvider`)
- **ABI** là "bộ phiên dịch": biến chuỗi hàm như `"getCount()"` thành calldata được encode đúng chuẩn (function selector + tham số) và giải mã dữ liệu trả về ngược lại thành giá trị JS — thiếu ABI thì không thể gọi hàm hay đọc kết quả
- Đọc và ghi khác nhau ở signer:
  - `getCount()` (view) → chỉ cần provider, dùng `eth_call` miễn phí, không tạo transaction — đúng như script này
  - `increment()` (thay đổi state) → cần **signer** + gas; đó là phần của Bài 5.2

### Điều kiện để frontend tương tác được với contract
1. **Địa chỉ contract** trên một mạng xác định (chainId)
2. **ABI đúng** với các hàm/events cần gọi
3. **Endpoint JSON-RPC** của mạng đó (RPC công khai, Alchemy/Infura, hoặc `window.ethereum` do MetaMask inject)
4. Call chỉ đọc (view): chỉ cần **provider**
5. Call thay đổi state: cần **signer/ví** có fund (vd private key MetaMask) + gas trên đúng mạng
