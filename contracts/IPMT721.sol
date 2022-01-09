// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @dev Required interface of an ERC721 compliant contract.
 */
interface IPMT721 is IERC721 {
    function exits(uint256 tokenId) external view returns (bool);

    function mint(address to) external;
    function burn(uint256 tokenId) external;
    function currentID() external view returns (uint);
}
