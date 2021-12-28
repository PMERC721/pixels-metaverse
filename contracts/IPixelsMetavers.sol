// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPixelsMetavers {
    function handleTransfer(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function _testTransfer(
        address from,
        address to,
        uint256 tokenId
    ) external;
}
