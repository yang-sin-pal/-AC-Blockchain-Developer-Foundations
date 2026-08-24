// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Counter {
    uint256 public count; //32 bytes -> slot 0
    address a; //20 bytes   -> slot 1 (còn dư 12 bytes)
    uint256 number;//32 bytes -> slot 2 (không nhét vào slot 1 được, chiếm slot riêng)
    uint8 b; //1 byte -> slot 3 (tổng 4 slot)

    function increment() public {
        count += 1;
    }

    function getCount() public view returns (uint) {
        return count;
    }
}
