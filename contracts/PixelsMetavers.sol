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
        uint256 compose;
        string time;
        string position;
        string zIndex;
        address owner;
        bytes32 data;
    }
    mapping(uint256 => Material) public material;
    mapping(uint256 => uint256[]) public composes;
    mapping(address => uint256[]) public collection;

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
        uint256[] composes;
    }

    uint256 private unlocked = 1;
    modifier lock() {
        require(unlocked == 1, "LOCKED");
        unlocked = 0;
        _;
        unlocked = 1;
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
        require(sender == m.owner, "The current item is not your!");
        _;
    }

    constructor() {
        _owner = msg.sender;
    }

    //118008 ropsten 97333 local
    function register() public {
        require(user[msg.sender].id == 0, "You are already a platform user!");
        require(
            amount <= 1024000,
            "The number has exceeded the total population of the universe!"
        );
        user[msg.sender].id = ++amount;
    }

    // 132457
    function setConfig(string memory other) public MustUser(msg.sender) {
        user[msg.sender].other = other;
    }

    // 47731
    function setRole(string memory role) public MustUser(msg.sender) {
        user[msg.sender].role = role;
    }

    // 70903
    function setAvater(uint256 id) public MustOwner(msg.sender, id) {
        user[msg.sender].avater = id;
    }

    // 206067
    function resetUser(address to) public MustUser(msg.sender) {
        require(user[to].id == 0, "This address are already a platform user!");
        User memory u = user[msg.sender];
        user[to].id = u.id;
        user[to].role = u.role;
        user[msg.sender].id = 0;
        user[msg.sender].role = "";
    }

    function setConfigMaterial(
        uint256 id,
        string memory time,
        string memory position,
        string memory zIndex
    ) public MustOwner(msg.sender, id) {
        material[id].time = time;
        material[id].position = position;
        material[id].zIndex = zIndex;
    }

    function getMaterialLength() public view returns (uint256) {
        return IPMT721(PMT721).currentID();
    }

    function getMaterial(uint256 id) public view returns (MaterialInfo memory) {
        Material storage m = material[id];
        BaseInfo memory b = baseInfo[m.data];
        uint256[] memory c = composes[id];
        return MaterialInfo(m, b, c);
    }

    // 356245
    function make(
        string memory name,
        string memory category,
        string memory data,
        string memory decode,
        uint256 num
    ) public MustUser(msg.sender) {
        bytes32 d = keccak256(abi.encodePacked(data));
        require(d != keccak256(abi.encodePacked("")), "Data cannot empty!");

        for (uint256 i; i < num; i++) {
            _make(d);
        }

        if (baseInfo[d].userId == 0) {
            baseInfo[d] = BaseInfo(
                data,
                category,
                decode,
                name,
                user[msg.sender].id
            );
        }
    }

    function reMake(uint256 id, uint256 num) public MustOwner(msg.sender, id) {
        Material storage m = material[id];
        require(
            baseInfo[m.data].userId == user[msg.sender].id,
            "Only Owner Can Do It!"
        );
        for (uint256 i; i < num; i++) {
            _make(m.data);
        }
    }

    function _make(bytes32 data) private {
        IPMT721(PMT721).mint(msg.sender);
        uint256 id = IPMT721(PMT721).currentID();
        material[id] = Material(id, 0, "", "", "", msg.sender, data);
    }

    //
    function collect(uint256 id) public MustExist(id) {
        Material memory m = material[id];
        require(m.owner != msg.sender, "This your material");
        collection[msg.sender].push(id);
    }

    function cancelCollect(uint256 id, uint256 index) public MustExist(id) {
        uint256[] memory c = collection[msg.sender];
        require(index < c.length, "Not this index value");
        require(c[index] == id, "This index isnot id value");
        delete collection[msg.sender][index];
    }

    function getCollection(address from)
        public
        view
        returns (uint256[] memory)
    {
        return collection[from];
    }

    function getCompose(uint256 id) public view returns (uint256[] memory) {
        return composes[id];
    }

    function compose(uint256[] memory ids) public MustUser(msg.sender) lock {
        _make(keccak256(abi.encodePacked("")));
        uint256 curID = IPMT721(PMT721).currentID();
        uint256 len = ids.length;
        require(len > 1, "The id no composed");
        for (uint256 i; i < len; i++) {
            uint256 id = ids[i];
            Material memory m = material[id];
            require(
                msg.sender == m.owner,
                "The current item is not your asset!"
            );
            require(m.compose == 0, "The current item composed!");
            material[id].compose = curID;
        }
        composes[curID] = ids;
    }

    function cancelCompose(uint256 id) public MustOwner(msg.sender, id) lock {
        uint256[] memory c = composes[id];
        uint256 len = c.length;
        require(len > 1, "The id no composed");
        for (uint256 i; i < len; i++) {
            material[c[i]].compose = 0;
        }
        IPMT721(PMT721).safeTransferFrom(msg.sender, address(this), id);
        IPMT721(PMT721).burn(id);
        delete composes[id];
    }

    function subjion(uint256 ids, uint256 id)
        public
        MustOwner(msg.sender, ids)
        MustOwner(msg.sender, id)
    {
        uint256[] memory c = composes[ids];
        require(c.length > 1, "The id no composed");
        Material memory m = material[id];
        require(m.compose == 0, "The id subjion");
        material[id].compose = ids;
        composes[ids].push(id);
    }

    function subtract(
        uint256 ids,
        uint256 id,
        uint256 index
    ) public MustOwner(msg.sender, ids) {
        uint256[] memory c = composes[ids];
        uint256 len = c.length;
        require(len > index, "The id no composed");
        require(c[index] == id, "This index isnot id value");
        material[id].compose = 0;
        delete composes[ids][index];
    }

    function setPMT721(address pmt721) public {
        require(msg.sender == _owner, "Only Owner Can Do It!");
        PMT721 = IPMT721(pmt721);
    }

    function _transfer(
        address from,
        address to,
        uint256 id
    ) private {
        Material memory m = material[id];
        require(m.compose == 0, "This material composed!");
        if (to == address(0)) {
            delete material[id];
        }
        if (from != address(0)) {
            material[id].owner = to;
        }
    }

    function _testTransfer(
        address from,
        address to,
        uint256 id
    ) internal {
        Material memory m = material[id];
        require(m.compose == 0, "This material composed!");
        if (to == address(0)) {
            delete material[id];
        }
        if (from != address(0)) {
            material[id].owner = to;
        }
    }
}
