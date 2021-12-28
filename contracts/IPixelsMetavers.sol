// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPixelsMetavers {
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) external;
}
