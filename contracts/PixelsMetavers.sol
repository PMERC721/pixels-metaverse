// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./IPMT721.sol";

contract PixelsMetavers {
    IPMT721 private PMT721;
    address private immutable _owner;

    uint256 amount;

    struct User {
        uint256 id;
        string name;
        string role;
        string other;
    }
    mapping(address => User) public user;

    struct Goods {
        uint256 id;
        uint192 price;
        uint16 start;
        uint16 end;
        uint16 zIndex;
        uint8 isSale;
        uint8 isOutfit;
        address owner;
        bytes32 data;
    }
    mapping(uint256 => Goods) public goods;

    struct BaseInfo {
        string data;
        string category;
        string bg;
        string decode;
        string name;
        uint256 userId;
    }
    mapping(bytes32 => BaseInfo) public baseInfo;

    uint256[] public goodsList;

    modifier MustExist(uint256 id) {
        require(IPMT721(PMT721).exits(id), "The product does not exist!");
        _;
    }

    constructor() {
        _owner = msg.sender;
    }

    //118008 ropsten 118458 local
    function register() public {
        require(user[msg.sender].id > 0, "You are already a platform user!");
        require(
            amount <= 10240000,
            "The number has exceeded the total population of the universe!"
        );
        amount++;
        user[msg.sender].id = amount;
    }

    //65023 67528  bgColor: '#c18686', gridColor: '#472a2a', withGrid: true  132457
    function setConfig(string memory other) public {
        user[msg.sender].other = other;
    }

    function setRole(string memory name, string memory role) public {
        require(user[msg.sender].id > 0, "Only User Can Do It!");
        user[msg.sender].role = role;
        user[msg.sender].name = name;
    }

    function resetUser(address to) public {
        require(user[to].id == 0, "This address are already a platform user!");
        user[to] = user[msg.sender];
        user[msg.sender] = User(0, "", "", "");
    }

    function getGoodsList() public view returns (uint256[] memory) {
        return goodsList;
    }

    function postGoods(
        string memory name,
        string memory category,
        string memory data,
        string memory decode,
        string memory bg,
        uint192 price,
        uint16 start,
        uint256 num
    ) public {
        User memory u = user[msg.sender];
        require(
            keccak256(abi.encodePacked(u.role)) ==
                keccak256(abi.encodePacked("merchant")),
            "Only Merchant Can Do It!"
        );
        bytes32 d = keccak256(abi.encodePacked(data));
        if (baseInfo[d].userId == 0) {
            baseInfo[d] = BaseInfo(data, category, bg, decode, name, u.id);
        } else {
            require(baseInfo[d].userId == u.id, "Only Merchant Can Do It!");
        }

        for (uint256 i; i < num; i++) {
            IPMT721(PMT721).mint();
            uint256 id = IPMT721(PMT721).currentID();

            goods[id] = Goods(id, price, start, start, 0, 1, 0, msg.sender, d);
            goodsList.push(id);
        }
    }

    // 158551
    function buyGoods(uint256 id) public payable MustExist(id) {
        Goods memory g = goods[id];
        require(
            msg.value >= g.price,
            "The amount paid is lower than the price of the commodity!"
        );
        require(g.isSale > 0, "The goods saled!");

        (bool success, ) = g.owner.call{value: msg.value}(new bytes(0));
        require(success, "Transfer failed.");

        goods[id].isSale = 0;
        IPMT721(PMT721).safeTransferFrom(address(this), msg.sender, id);
    }

    function outfit(
        uint256 id,
        uint8 isOutfit,
        uint16 end
    ) public MustExist(id) {
        Goods memory g = goods[id];
        require(msg.sender == g.owner, "The current item is not your asset!");
        require(g.isSale == 0, "The goods no sale!");
        if (g.isOutfit != isOutfit) {
            goods[id].isOutfit = isOutfit;
        }
        if (end != g.end) {
            goods[id].end = end;
        }
    }

    function setPMT721(address pmt721) public {
        require(msg.sender == _owner, "Only Owner Can Do It!");
        PMT721 = IPMT721(pmt721);
    }

    function transfer(
        address from,
        address to,
        uint256 tokenId
    ) public {
        Goods memory g = goods[tokenId];
        if (g.owner == from && from != address(0)) {
            goods[tokenId].owner = to;
        }
    }
}
