// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract Whitelist {
    uint256 userNum = 0;
    uint256 maxUserNum = 10;
    mapping(address => bool) public member;

    function joinWhitelist() public {
        require(!member[msg.sender], "You are already a member");
        require(userNum < maxUserNum, "Sorry! We are full");

        userNum += 1;
        member[msg.sender] = true;
    }

    function getUserNum() public view returns (uint256) {
        return userNum;
    }
}
