// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint amount) external returns (bool);
    function transfer(address to, uint amount) external returns (bool);
    function balanceOf(address account) external view returns (uint);
}

contract DexHKA {
    address public token1;
    address public token2;
    uint public reserve1;
    uint public reserve2;

    constructor(address _token1, address _token2) {
        token1 = _token1;
        token2 = _token2;
    }

    function addLiquidity(uint amount1, uint amount2) public {
        require(amount1 > 0 && amount2 > 0, "Invalid amount");
        IERC20(token1).transferFrom(msg.sender, address(this), amount1);
        IERC20(token2).transferFrom(msg.sender, address(this), amount2);
        reserve1 += amount1;
        reserve2 += amount2;
    }

    function getPrice(uint amountIn, address fromToken) public view returns (uint) {
        require(amountIn > 0, "Invalid input");
        if (fromToken == token1) {
            return (amountIn * reserve2) / (reserve1 + amountIn);
        } else if (fromToken == token2) {
            return (amountIn * reserve1) / (reserve2 + amountIn);
        } else {
            revert("Invalid token");
        }
    }

    function swap(address fromToken, uint amountIn) public {
        require(amountIn > 0, "Invalid input");
        if (fromToken == token1) {
            uint amountOut = getPrice(amountIn, token1);
            require(amountOut <= reserve2, "Insufficient liquidity");
            IERC20(token1).transferFrom(msg.sender, address(this), amountIn);
            IERC20(token2).transfer(msg.sender, amountOut);
            reserve1 += amountIn;
            reserve2 -= amountOut;
        } else if (fromToken == token2) {
            uint amountOut = getPrice(amountIn, token2);
            require(amountOut <= reserve1, "Insufficient liquidity");
            IERC20(token2).transferFrom(msg.sender, address(this), amountIn);
            IERC20(token1).transfer(msg.sender, amountOut);
            reserve2 += amountIn;
            reserve1 -= amountOut;
        } else {
            revert("Invalid token");
        }
    }
}
