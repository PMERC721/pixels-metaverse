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
    mapping(uint256 => uint256[]) public composes; // 合成
    mapping(address => uint256[]) public collection; //非用户也能收藏

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

    //118008 ropsten 97333 local 已验证
    function register() public {
        require(user[msg.sender].id == 0, "You are already a platform user!");
        require(
            amount <= 10240000,
            "The number has exceeded the total population of the universe!"
        );
        amount++;
        user[msg.sender].id = amount;
    }

    //47900  bgColor: '#c18686', gridColor: '#472a2a'  132457 已验证
    function setConfig(string memory other) public MustUser(msg.sender) {
        user[msg.sender].other = other;
    }

    // 已验证 修改 47731
    function setRole(string memory role) public MustUser(msg.sender) {
        user[msg.sender].role = role;
    }

    //  已验证 设置70903
    function setAvater(uint256 id) public MustOwner(msg.sender, id) {
        user[msg.sender].avater = id;
    }

    // 已验证 设置 206067
    function resetUser(address to) public MustUser(msg.sender) {
        require(user[to].id == 0, "This address are already a platform user!");
        user[to] = user[msg.sender];
        user[to].avater = 0;
        user[msg.sender] = User(0, user[msg.sender].avater, "", "");
    }

    // 已验证
    function getMaterialLength() public view returns (uint256) {
        return IPMT721(PMT721).currentID();
    }

    // 已验证
    function getMaterial(uint256 id) public view returns (MaterialInfo memory) {
        Material storage m = material[id];
        BaseInfo memory b = baseInfo[m.data];
        uint256[] memory c = composes[id];
        return MaterialInfo(m, b, c);
    }

    // 已验证 356245
    function make(
        string memory name,
        string memory category,
        string memory data,
        string memory decode,
        uint256 num
    ) public MustUser(msg.sender) {
        bytes32 d = keccak256(abi.encodePacked(data));
        require(d != keccak256(abi.encodePacked("")), "Data cannot empty!");
        require(baseInfo[d].userId == 0, "Only Make Once Times!");

        for (uint256 i; i < num; i++) {
            _make(d);
        }
        baseInfo[d] = BaseInfo(
            data,
            category,
            decode,
            name,
            user[msg.sender].id
        );
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
    function collect(uint256 id) public payable MustExist(id) {
        Material memory m = material[id];
        require(m.owner != msg.sender, "This your material");
        collection[msg.sender].push(id);
    }

    function cancelCollect(uint256 id, uint256 index) public MustExist(id) {
        require(index < collection[msg.sender].length, "Not this index value");
        collection[msg.sender][index] = 0;
    }

    function compose(uint256[] memory ids) public MustUser(msg.sender) {
        _make(keccak256(abi.encodePacked("")));
        uint256 curID = IPMT721(PMT721).currentID();
        for (uint256 i; i < ids.length; i++) {
            uint256 id = ids[i];
            Material memory m = material[id];
            require(
                msg.sender == m.owner,
                "The current item is not your asset!"
            );
            material[id].compose = curID;
            IPMT721(PMT721).safeTransferFrom(msg.sender, address(this), id);
        }
        composes[curID] = ids;
    }

    function cancelCompose(uint256 id) public {
        uint256[] memory c = composes[id];
        uint256 len = c.length;
        require(len > 1, "The id no composed");
        for (uint256 i; i < len; i++) {
            uint256 idd = c[i];
            material[c[i]].compose = 0;
            IPMT721(PMT721).safeTransferFrom(address(this), msg.sender, idd);
        }
        delete composes[id];
        delete material[id];
        IPMT721(PMT721).burn(id);
    }

    function setConfig(
        uint256 id,
        string memory time,
        string memory position,
        string memory zIndex
    ) public MustOwner(msg.sender, id) {
        material[id].time = time;
        material[id].position = position;
        material[id].zIndex = zIndex;
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

    function subtract(uint256 ids, uint256 index)
        public
        MustOwner(msg.sender, ids)
    {
        uint256[] memory c = composes[ids];
        uint256 len = c.length;
        require(len > index, "The id no composed");
        uint256 id = c[index];
        material[id].compose = 0;
        composes[ids][index] = 0;
    }

    function setPMT721(address pmt721) public {
        require(msg.sender == _owner, "Only Owner Can Do It!");
        PMT721 = IPMT721(pmt721);
    }

    function transfer(
        address from,
        address to,
        uint256 id
    ) public {
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
