// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./IPixelsMetaverse.sol";

contract PMT721 is ERC721 {
    address public minter;
    uint256 private _tokenId;
    address private _owner;

    modifier MustMinter(address from) {
        require(from == minter, "Only Minter Can Do It!");
        _;
    }

    modifier MustOwner(address from) {
        require(from == _owner, "Only Owner Can Do It!");
        _;
    }

    constructor() ERC721("PixelsMetavers", "PMT") {
        _owner = _msgSender();
    }

    function mint(address to) public MustMinter(_msgSender()) {
        _mint(to, ++_tokenId);
        _approve(minter, _tokenId);
    }

    function burn(uint256 id) public {
        require(ownerOf(id) == _msgSender(), "Only Owner Can Do It!");
        _burn(id);
    }

    function exits(uint256 id) public view returns (bool) {
        return _exists(id);
    }

    function setMinter(address _minter) public MustOwner(_msgSender()) {
        minter = _minter;
    }

    function setOwner(address owner) public MustOwner(_msgSender()) {
        _owner = owner;
    }

    function currentID() public view returns (uint256) {
        return _tokenId;
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        IPixelsMetavers(minter).handleTransfer(from, to, tokenId);
    }
}
