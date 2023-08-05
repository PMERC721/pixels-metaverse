// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./IPMT721.sol";

contract PixelsMetaverse {
    IPMT721 private PMT721;
    mapping(address => uint256) public avater;
    event AvaterEvent(address indexed owner, uint256 indexed avater);

    mapping(bytes32 => address) public dataOwner;
    event DataOwnerEvent(address indexed owner, bytes32 dataBytes);

    struct Material {
        uint256 composed; //被合并到哪个id去了
        bytes32 dataBytes; //原属数据data转换成bytes32
        bool remake; //是否基于当前id再次制作了与该id同样的其他虚拟物品
    }
    mapping(uint256 => Material) public material;

    /**
        rawData 当前ID的原始数据
        dataID 当前ID的基本数据来自于哪个id
     */
    event MaterialEvent(
        address indexed owner,
        uint256 indexed id,
        uint256 indexed dataID,
        uint256 configID,
        string rawData,
        bool remake
    );

    /**
        sort 当前配置信息拼接的顺序
     */
    event ConfigEvent(
        uint256 indexed id,
        string name,
        string time,
        string position,
        string zIndex,
        string decode,
        uint256 sort
    );

    /**
        fromID 被合并或解除合并之前的上级id
        toID 被合并或解除合并之后的上级id
     */
    event ComposeEvent(uint256 fromID, uint256 toID, uint256[] id, bool isAdd);

    modifier Owner(address sender, uint256 id) {
        require(IPMT721(PMT721).exits(id), "Items must exist");
        require(sender == IPMT721(PMT721).ownerOf(id), "Only the owner");
        _;
    }

    constructor(address pmt721) {
        PMT721 = IPMT721(pmt721);
    }

    function setAvater(uint256 id) public Owner(msg.sender, id) {
        avater[msg.sender] = id;
        emit AvaterEvent(msg.sender, id);
    }

    function setDataOwner(bytes32 dataBytes, address to) public {
        require(dataOwner[dataBytes] == msg.sender, "Items must exist");
        dataOwner[dataBytes] = to;
        emit DataOwnerEvent(msg.sender, dataBytes);
    }

    function setConfig(
        uint256 id,
        string memory name,
        string memory time,
        string memory position,
        string memory zIndex,
        string memory decode,
        uint256 sort
    ) public Owner(msg.sender, id) {
        require(
            material[id].composed == 0,
            "The item must not have been synthesized"
        );
        emit ConfigEvent(id, name, time, position, zIndex, decode, sort);
        emit MaterialEvent(msg.sender, id, 0, id, "", false);
    }

    function make(
        string memory name,
        string memory rawData,
        string memory time,
        string memory position,
        string memory zIndex,
        string memory decode,
        uint256 num
    ) public {
        require(num > 0, "The quantity must be greater than 0");

        bytes32 d = keccak256(abi.encodePacked(rawData));
        require(dataOwner[d] == address(0), "This data already has an owner");

        uint256 ID = IPMT721(PMT721).currentID() + num;
        emit ConfigEvent(ID, name, time, position, zIndex, decode, 0);

        for (uint256 i; i < num; i++) {
            _make(msg.sender, rawData, d, 0, ID);
        }

        dataOwner[d] = msg.sender;
    }

    function reMake(uint256 id, uint256 num) public Owner(msg.sender, id) {
        Material storage m = material[id];
        require(dataOwner[m.dataBytes] == msg.sender, "Only the owner");

        emit MaterialEvent(msg.sender, id, 0, 0, "", true);
        for (uint256 i; i < num; i++) {
            _make(msg.sender, "", m.dataBytes, id, id);
        }
        material[id].remake = true;
    }

    function compose(
        uint256[] memory idList,
        string memory name,
        string memory time,
        string memory position,
        string memory zIndex,
        string memory decode
    ) public {
        uint256 len = idList.length;
        require(len > 1, "The quantity must be greater than 1");

        uint256 nextID = IPMT721(PMT721).currentID() + 1;
        bytes32 dataBytes = keccak256(abi.encodePacked(msg.sender, nextID));
        emit ConfigEvent(nextID, name, time, position, zIndex, decode, 0);
        _make(msg.sender, "", dataBytes, nextID, nextID);

        for (uint256 i; i < len; i++) {
            _compose(nextID, idList[i], msg.sender);
        }
        emit ComposeEvent(0, nextID, idList, true);
        dataOwner[dataBytes] = msg.sender;
    }

    function _make(
        address sender,
        string memory rawData,
        bytes32 dataBytes,
        uint256 dataID,
        uint256 configID
    ) private {
        IPMT721(PMT721).mint(sender);
        uint256 id = IPMT721(PMT721).currentID();
        material[id] = Material(0, dataBytes, false);
        emit MaterialEvent(msg.sender, id, dataID, configID, rawData, false);
    }

    function addition(uint256 ids, uint256[] memory idList)
        public
        Owner(msg.sender, ids)
    {
        for (uint256 i; i < idList.length; i++) {
            _compose(ids, idList[i], msg.sender);
        }
        emit ComposeEvent(0, ids, idList, false);
    }

    function _compose(
        uint256 ids,
        uint256 id,
        address _sender
    ) private Owner(_sender, id) {
        require(material[id].composed == 0, "this Material composed");
        material[id].composed = ids;
    }

    function subtract(uint256 ids, uint256[] memory idList)
        public
        Owner(msg.sender, ids)
    {
        Material memory m = material[ids];
        require(m.composed == 0, "The item must not have been synthesized");
        for (uint256 i; i < idList.length; i++) {
            uint256 id = idList[i];
            require(
                material[id].composed == ids,
                "The item was not synthesized into the ids"
            );
            material[id].composed = 0;
        }
        emit ComposeEvent(ids, 0, idList, false);
    }

    function handleTransfer(
        address from,
        address to,
        uint256 id
    ) public {
        Material memory m = material[id];
        require(m.composed == 0, "The item must not have been synthesized");
        require(msg.sender == address(PMT721), "Only the owner");
        require(avater[from] != id, "This id been avater");

        if (to == address(0)) {
            require(!m.remake, "This id been remake");
            delete material[id];
        }
        if (from != address(0)) {
            emit MaterialEvent(to, id, 0, 0, "", false);
        }
    }
}
