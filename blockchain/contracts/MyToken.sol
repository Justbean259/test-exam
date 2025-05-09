// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor() ERC20("MyToken", "MYT") Ownable(msg.sender) {}

    function mint(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        _mint(msg.sender, amount);
    }
}
