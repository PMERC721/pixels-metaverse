// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./IPMT721.sol";

contract PixelsMetavers {
    IPMT721 private PMT721;
    address private immutable _owner;

    uint256 public amount;

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
        string decode;
        string name;
        uint256 userId;
    }
    mapping(bytes32 => BaseInfo) public baseInfo;

    struct MaterialInfo {
        Material material;
        BaseInfo baseInfo;
        uint256[] composes;
    }

    event ComposeEvent(address indexed owner, uint256 indexed id);

    modifier Exist(uint256 id) {
        require(IPMT721(PMT721).exits(id), "error");
        _;
    }

    modifier IsUser(address u) {
        require(user[u].id > 0, "error");
        _;
    }

    modifier IsOwner(address sender, uint256 id) {
        Material memory m = material[id];
        require(sender == m.owner, "error");
        _;
    }

    modifier NoCompose(uint256 id) {
        Material memory m = material[id];
        require(m.compose == 0, "error");
        _;
    }

    constructor() {
        _owner = msg.sender;
    }

    function register() public {
        require(user[msg.sender].id == 0, "error");
        require(amount <= 1024000, "error");
        user[msg.sender].id = ++amount;
    }

    function setConfig(
        string memory role,
        uint256 id,
        string memory other
    ) public IsOwner(msg.sender, id) {
        user[msg.sender].other = other;
        user[msg.sender].role = role;
        user[msg.sender].avater = id;
    }

    /*     function resetUser(address to) public IsUser(msg.sender) {
        require(user[to].id == 0, "error");
        User memory u = user[msg.sender];
        user[to].id = u.id;
        user[to].role = u.role;
        user[msg.sender].id = 0;
        user[msg.sender].role = "";
    } */

    /* function setConfigMaterial(
        uint256 id,
        string memory time,
        string memory position,
        string memory zIndex
    ) public IsOwner(msg.sender, id) {
        material[id].time = time;
        material[id].position = position;
        material[id].zIndex = zIndex;
    } */

    function getMaterialLength() public view returns (uint256) {
        return IPMT721(PMT721).currentID();
    }

    function getMaterial(uint256 id) public view returns (MaterialInfo memory) {
        Material storage m = material[id];
        BaseInfo memory b = baseInfo[m.data];
        uint256[] memory c = composes[id];
        return MaterialInfo(m, b, c);
    }

    function make(
        string memory name,
        string memory category,
        string memory data,
        string memory decode,
        uint256 num
    ) public IsUser(msg.sender) {
        bytes32 d = keccak256(abi.encodePacked(data));
        require(d != keccak256(abi.encodePacked("")), "error");

        for (uint256 i; i < num; i++) {
            _make(d, msg.sender);
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

    function reMake(uint256 id, uint256 num) public IsOwner(msg.sender, id) {
        Material storage m = material[id];
        require(baseInfo[m.data].userId == user[msg.sender].id, "error");
        for (uint256 i; i < num; i++) {
            _make(m.data, msg.sender);
        }
    }

    function _make(bytes32 data, address _sender) private {
        IPMT721(PMT721).mint(_sender);
        uint256 id = IPMT721(PMT721).currentID();
        material[id] = Material(id, 0, "", "", "", _sender, data);
    }

    function collect(uint256 id) public Exist(id) {
        Material memory m = material[id];
        require(m.owner != msg.sender, "error");
        collection[msg.sender].push(id);
    }

    function cancelCollect(uint256 id, uint256 index) public Exist(id) {
        require(user[msg.sender].avater != id, "error");
        uint256[] memory c = collection[msg.sender];
        require(index < c.length, "error");
        require(c[index] == id, "error");
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

    function compose(
        uint256[] memory ids,
        string memory name,
        string memory category,
        string memory data,
        string memory decode
    ) public IsUser(msg.sender) {
        uint256 len = ids.length;
        require(len > 1, "error");
        uint256 curID = IPMT721(PMT721).currentID();
        uint256 nextID = curID + 1;
        bytes32 d = keccak256(abi.encodePacked(curID + 1));
        require(baseInfo[d].userId == 0, "error");
        _make(d, msg.sender);
        for (uint256 i; i < len; i++) {
            uint256 id = ids[i];
            _compose(nextID, id, msg.sender);
        }
        composes[nextID] = ids;
        baseInfo[d] = BaseInfo(
            data,
            category,
            decode,
            name,
            user[msg.sender].id
        );
        emit ComposeEvent(msg.sender, nextID);
    }

    function cancelCompose(uint256 ids)
        public
        IsOwner(msg.sender, ids)
        NoCompose(ids)
    {
        uint256[] memory c = composes[ids];
        uint256 len = c.length;
        require(len > 1, "error");
        for (uint256 i; i < len; i++) {
            material[c[i]].compose = 0;
        }
        IPMT721(PMT721).burn(ids);
        delete composes[ids];
    }

    function addition(uint256 ids, uint256[] memory idList)
        public
        IsOwner(msg.sender, ids)
        NoCompose(ids)
    {
        uint256[] memory c = composes[ids];
        require(c.length > 1, "error");
        for (uint256 i; i < idList.length; i++) {
            uint256 id = idList[i];
            _compose(ids, id, msg.sender);
            composes[ids].push(id);
        }
    }

    function _compose(
        uint256 ids,
        uint256 id,
        address _sender
    ) private IsOwner(_sender, ids) IsOwner(_sender, id) {
        Material memory m = material[id];
        require(_sender == m.owner, "error");
        require(m.compose == 0, "error");
        material[id].compose = ids;
    }

    function subtract(
        uint256 ids,
        uint256 id,
        uint256 index
    ) public IsOwner(msg.sender, ids) NoCompose(ids) {
        uint256[] memory c = composes[ids];
        uint256 len = c.length;
        require(len > index, "error");
        require(c[index] == id, "error");
        material[id].compose = 0;
        delete composes[ids][index];
    }

    function setPMT721(address pmt721) public {
        require(msg.sender == _owner, "error");
        PMT721 = IPMT721(pmt721);
    }

    function handleTransfer(
        address from,
        address to,
        uint256 id
    ) public NoCompose(id) {
        require(msg.sender == address(PMT721), "error");
        if (to == address(0)) {
            delete material[id];
        } else if (from != address(0)) {
            material[id].owner = to;
        }
    }
}
