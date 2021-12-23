// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./IPMT721.sol";

contract PixelsMetavers {
    IPMT721 private PMT721;
    address private immutable _owner;

    uint256 amount;

    struct User {
        uint256 id;
        uint256 avater;
        string role;
        string other;
    }
    mapping(address => User) public user;

    struct Material {
        uint256 id;
        uint16 time;
        uint16 position;
        uint16 zIndex;
        uint16 isCompose;
        address owner;
        bytes32 data;
    }
    mapping(uint256 => Material) public material;
    mapping(uint256 => uint256[]) public composes; // 合成
    mapping(address => uint256[]) public collection; // 收藏

    struct BaseInfo {
        string data;
        string category;
        string decode; // 解码方式
        string name;
        uint256 userId;
    }
    mapping(bytes32 => BaseInfo) public baseInfo;

    struct MaterialInfo {
        Material material;
        BaseInfo baseInfo;
    }

    modifier MustExist(uint256 id) {
        require(IPMT721(PMT721).exits(id), "The product does not exist!");
        _;
    }

    modifier MustUser(address u) {
        require(user[u].id > 0, "Only User Can Do It!");
        _;
    }

    modifier MustOwner(address sender, uint256 id) {
        Material memory m = material[id];
        require(sender == m.owner, "The current item is not your asset!");
        _;
    }

    constructor() {
        _owner = msg.sender;
    }

    //118008 ropsten 97333 local
    function register() public {
        require(user[msg.sender].id == 0, "You are already a platform user!");
        require(
            amount <= 10240000,
            "The number has exceeded the total population of the universe!"
        );
        amount++;
        user[msg.sender].id = amount;
    }

    //47900  bgColor: '#c18686', gridColor: '#472a2a'  132457
    function setConfig(string memory other) public MustUser(msg.sender) {
        user[msg.sender].other = other;
    }

    function setRole(string memory role) public MustUser(msg.sender) {
        user[msg.sender].role = role;
    }

    function setAvater(uint256 id) public MustUser(msg.sender) MustExist(id) {
        user[msg.sender].avater = id;
    }

    function resetUser(address to) public MustUser(msg.sender) {
        require(user[to].id == 0, "This address are already a platform user!");
        user[to] = user[msg.sender];
        user[msg.sender] = User(0, 0, "", "");
    }

    function getMaterialLength() public view returns (uint256) {
        return IPMT721(PMT721).currentID();
    }

    function getMaterial(uint256 id) public view returns (MaterialInfo memory) {
        Material storage m = material[id];
        return MaterialInfo(m, baseInfo[m.data]);
    }

    function make(
        string memory name,
        string memory category,
        string memory data,
        string memory decode,
        uint16 time,
        uint16 postion,
        uint16 zIndex,
        uint256 num
    ) public MustUser(msg.sender) {
        bytes32 d = keccak256(abi.encodePacked(data));
        require(baseInfo[d].userId == 0, "Only Make Once Times!");

        for (uint256 i; i < num; i++) {
            IPMT721(PMT721).mint();
            uint256 id = IPMT721(PMT721).currentID();
            material[id] = Material(
                id,
                time,
                postion,
                zIndex,
                0,
                msg.sender,
                d
            );
        }
        baseInfo[d] = BaseInfo(
            data,
            category,
            decode,
            name,
            user[msg.sender].id
        );
    }

    function reMake(uint256 id, uint256 num)
        public
        MustUser(msg.sender)
        MustExist(id)
    {
        Material storage m = material[id];
        bytes32 d = keccak256(abi.encodePacked(m.data));
        require(
            baseInfo[d].userId == user[msg.sender].id,
            "Only Owner Can Do It!"
        );
        for (uint256 i; i < num; i++) {
            IPMT721(PMT721).mint();
            uint256 currentID = IPMT721(PMT721).currentID();
            material[currentID] = Material(
                currentID,
                m.time,
                m.position,
                m.zIndex,
                0,
                msg.sender,
                d
            );
        }
    }

    // 158551
    function collect(uint256 id) public payable MustExist(id) {
        collection[msg.sender].push(id);
    }

    function cancelCollect(uint256 index) public MustUser(msg.sender) {
        uint256[] memory c = collection[msg.sender];
        require(c.length > index, "index not exist");
        collection[msg.sender][index] = 0;
    }

    function compose(uint256[] memory ids) public MustUser(msg.sender) {
        for (uint256 i; i < ids.length; i++) {
            uint256 id = ids[i];
            Material memory m = material[id];
            require(
                msg.sender == m.owner,
                "The current item is not your asset!"
            );
            material[id].isCompose = 1;
            IPMT721(PMT721).safeTransferFrom(msg.sender, address(this), id);
        }

        IPMT721(PMT721).mint();
        uint256 currentID = IPMT721(PMT721).currentID();
        material[currentID] = Material(currentID, 0, 0, 0, 0, msg.sender, "");
        composes[currentID] = ids;
    }

    function cancelCompose(uint256 id)
        public
        MustUser(msg.sender)
        MustExist(id)
        MustOwner(msg.sender, id)
    {
        uint256[] memory c = composes[id];
        uint256 len = c.length;
        require(len > 1, "The id no composed");
        for (uint256 i; i < len; i++) {
            uint256 idd = c[i];
            material[c[i]].isCompose = 0;
            IPMT721(PMT721).safeTransferFrom(address(this), msg.sender, idd);
        }
        composes[id] = [0];
        IPMT721(PMT721).burn(id);
        material[id] = Material(0, 0, 0, 0, 0, address(0), "");
    }

    function setTime(uint256 id, uint16 time)
        public
        MustExist(id)
        MustOwner(msg.sender, id)
    {
        material[id].time = time;
    }

    function setPosition(uint256 id, uint16 position)
        public
        MustExist(id)
        MustOwner(msg.sender, id)
    {
        material[id].position = position;
    }

    function setZindex(uint256 id, uint16 zIndex)
        public
        MustExist(id)
        MustOwner(msg.sender, id)
    {
        material[id].zIndex = zIndex;
    }

    function subjion(uint256 ids, uint256 id)
        public
        MustExist(ids)
        MustExist(id)
        MustOwner(msg.sender, ids)
        MustOwner(msg.sender, id)
    {
        uint256[] memory c = composes[ids];
        uint256 len = c.length;
        require(len > 1, "The id no composed");
        Material memory m = material[id];
        require(m.isCompose == 0, "The id subjion");
        material[id].isCompose = 1;
        composes[ids].push(id);
    }

    function subtract(uint256 ids, uint256 index)
        public
        MustExist(ids)
        MustOwner(msg.sender, ids)
    {
        uint256[] memory c = composes[ids];
        uint256 len = c.length;
        require(len > index, "The id no composed");
        uint256 id = c[index];
        material[id].isCompose = 0;
        composes[ids][index] = 0;
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
        Material memory m = material[tokenId];
        if (to == address(0)) {
            material[tokenId].owner = address(this);
        }
        if (m.owner == from && from != address(0)) {
            material[tokenId].owner = to;
        }
    }
}
