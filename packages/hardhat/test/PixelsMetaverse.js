const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Test My Dapp", function () {
  let PMT721Contract;
  let PixelsMetaverseContract;
  let owner;
  let otherAccount = "0xf0A3FdF9dC875041DFCF90ae81D7E01Ed9Bc2033"

  it("Deploy Contract", async function () {
    const signers = await ethers.getSigners();
    owner = signers[0];
    const PMT721 = await ethers.getContractFactory("PMT721");
    const PixelsMetaverse = await ethers.getContractFactory("PixelsMetaverse");

    PMT721Contract = await PMT721.deploy();
    await PMT721Contract.deployed();
    PixelsMetaverseContract = await PixelsMetaverse.deploy(PMT721Contract.address);
    await PixelsMetaverseContract.deployed();
  });

  describe("调用PixelsMetaverse合约函数", async function () {
    it("设置PMT721的发行者", async function () {
      await PMT721Contract.setMinter(PixelsMetaverseContract.address);
      expect(await PMT721Contract.minter()).to.equal(PixelsMetaverseContract.address);
    });

    it("制作2个虚拟物品1、2", async function () {
      await PixelsMetaverseContract.make("name", "rawData", "time", "position", "zIndex", "decode", 2);
      const currentID = await PMT721Contract.currentID()
      expect(currentID).to.equal(2);
    });

    it("设置头像为1和2", async function () {
      expect(await PixelsMetaverseContract.avater(owner.address)).to.equal(0)
      expect(await PixelsMetaverseContract.setAvater(1)).to.
        emit(PixelsMetaverseContract, "AvaterEvent").
        withArgs(owner.address, 1);
      expect(await PixelsMetaverseContract.avater(owner.address)).to.equal(1)
      expect(await PixelsMetaverseContract.setAvater(2)).to.
        emit(PixelsMetaverseContract, "AvaterEvent").
        withArgs(owner.address, 2);
      expect(await PixelsMetaverseContract.avater(owner.address)).to.equal(2)
    });

    it("设置1的配置信息", async function () {
      expect(await PixelsMetaverseContract.setConfig(1, "name1", "time1", "position1", "zIndex1", "decode1", 0)).to.
        emit(PixelsMetaverseContract, "ConfigEvent").
        withArgs(1, "name1", "time1", "position1", "zIndex1", "decode1", 0);
    });

    it("设置2的配置信息", async function () {
      expect(await PixelsMetaverseContract.setConfig(2, "name12222222", "time1222222", "position12222222", "zIndex1222222", "decode1222222", 0)).to.
        emit(PixelsMetaverseContract, "MaterialEvent").
        withArgs(owner.address, 2, 0, 2, "", false);
    });

    it("再次制作和2同样的2个虚拟物品3和4", async function () {
      const currentID1 = await PMT721Contract.currentID()
      expect(currentID1).to.equal(2);
      await PixelsMetaverseContract.reMake(2, 2);
      const currentID = await PMT721Contract.currentID()
      expect(currentID).to.equal(4);
    });

    it("再制作1个虚拟物品5", async function () {
      expect(await PixelsMetaverseContract.make("name5", "x-43-fdfad4-54343dfdfd4-43543543dffds-443543d4-45354353d453567554653-dfsafads", "time5", "position5", "zIndex5", "decode5", 1)).to.
        emit(PixelsMetaverseContract, "MaterialEvent").
        withArgs(owner.address, 5, 0, 5, "x-43-fdfad4-54343dfdfd4-43543543dffds-443543d4-45354353d453567554653-dfsafads", false);
    });

    it("合成2和4为第6个物品", async function () {
      expect(await PixelsMetaverseContract.compose([2, 4], "name6", "time6", "position6", "zIndex6", "decode6")).to.
        emit(PixelsMetaverseContract, "ConfigEvent").
        withArgs(6, "name6", "time6", "position6", "zIndex6", "decode6", 0);
    });

    it("再合成1和3为第7个物品", async function () {
      await PixelsMetaverseContract.compose([1, 3], "name7", "time7", "position7", "zIndex7", "decode7");
    });

    it("再合成5和6为第8个物品", async function () {
      expect(await await PixelsMetaverseContract.compose([5, 6], "name8", "time8", "position8", "zIndex8", "decode8")).to.
        emit(PixelsMetaverseContract, "ComposeEvent").
        withArgs(0, 8, [5,6], true);
    });

    it("再次制作3个不同的虚拟物品9、10、11", async function () {
      await PixelsMetaverseContract.make("name9", "rawData9", "time9", "position9", "zIndex9", "decode9", 3);
      const m9 = await PixelsMetaverseContract.material(9)
      expect(m9.composed).to.equal(0);
    });

    it("合并9到6里面去", async function () {
      const m6 = await PixelsMetaverseContract.material(6)
      expect(m6.composed).to.equal(8);
      expect(await PixelsMetaverseContract.addition(6, [9])).to.
        emit(PixelsMetaverseContract, "ComposeEvent").
        withArgs(0, 6, [9], false);
      const currentID = await PMT721Contract.currentID()
      expect(currentID).to.equal(11);
      const m9 = await PixelsMetaverseContract.material(9)
      expect(m9.composed).to.equal(6);
    });

    it("合并10和7到8里面去", async function () {
      expect(await PixelsMetaverseContract.addition(8, [10, 7])).to.
        emit(PixelsMetaverseContract, "ComposeEvent").
        withArgs(0, 8, [10, 7], false);
      const currentID = await PMT721Contract.currentID()
      expect(currentID).to.equal(11);
      const m7 = await PixelsMetaverseContract.material(7)
      expect(m7.composed).to.equal(8);
    });

    it("移除8里面的10", async function () {
      const m10 = await PixelsMetaverseContract.material(10)
      expect(m10.composed).to.equal(8);
      expect(await PixelsMetaverseContract.subtract(8, [10])).to.
        emit(PixelsMetaverseContract, "ComposeEvent").
        withArgs(8, 0, [10], false);
      const currentID = await PMT721Contract.currentID()
      expect(currentID).to.equal(11);
      const m1010 = await PixelsMetaverseContract.material(10)
      expect(m1010.composed).to.equal(0);
      const m1 = await PixelsMetaverseContract.material(1)
      expect(m1.composed).to.equal(7);
    });

    it("制作1个虚拟物品12", async function () {
      await PixelsMetaverseContract.make("name12", "rawData12", "time12", "position12", "zIndex12", "decode12", 1);
    });

    it("再次制作和6一样的2个合成虚拟物品13、14", async function () {
      await PixelsMetaverseContract.reMake(6, 2);
    });
  });

  describe("调用PMT721合约函数", async function () {
    it("检查11是否存在", async function () {
      expect(await PMT721Contract.exits(11)).to.equal(true);
    });
    it("检查11的所有者", async function () {
      expect(await PMT721Contract.ownerOf(11)).to.equal(owner.address);
    });
    it("转账11给" + otherAccount, async function () {
      expect(await PMT721Contract.ownerOf(11)).to.equal(owner.address);
      expect(await PMT721Contract.transferFrom(owner.address, otherAccount, 11)).to.
        emit(PixelsMetaverseContract, "MaterialEvent").
        withArgs(otherAccount, 11, 0, 0, "", false);
      expect(await PMT721Contract.ownerOf(11)).to.equal(otherAccount);
      const m1111 = await PixelsMetaverseContract.material(11)
      expect(m1111.composed).to.equal(0);
    });
    it("销毁10", async function () {
      const m10 = await PixelsMetaverseContract.material(10)
      expect(m10.composed).to.equal(0);

      expect(await PMT721Contract.burn(10)).to.
        emit(PMT721Contract, "Transfer").
        withArgs(owner.address, ethers.constants.AddressZero, 10);
      const m1010 = await PixelsMetaverseContract.material(10)
      expect(m1010.composed).to.equal(0);
      expect(await PMT721Contract.balanceOf(otherAccount)).to.equal(1);
    });
  });
});
