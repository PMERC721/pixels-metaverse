// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./IPixelsMetavers.sol";

contract PMT721 is ERC721 {
    uint256 private _tokenId;
    address _owner;
    address _minter;

    modifier MustMinter(address from) {
        require(from == _minter, "Only Minter Can Do It!");
        _;
    }

    modifier MustOwner(address from) {
        require(from == _owner, "Only Owner Can Do It!");
        _;
    }

    constructor() ERC721("PixelsMetavers", "PMT") {
        _owner = msg.sender;
    }

    function mint(address to) public MustMinter(msg.sender) {
        _mint(to, ++_tokenId);
    }

    function burn(uint256 id) public {
        _burn(id);
    }

    function exits(uint256 id) public view returns (bool) {
        return _exists(id);
    }

    function setMinter(address minter) public MustOwner(msg.sender) {
        _minter = minter;
    }

    function getMinter() public view returns (address) {
        return _minter;
    }

    function currentID() public view returns (uint256) {
        return _tokenId;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        IPixelsMetavers(_minter)._transfer(from, to, tokenId);
    }
}
