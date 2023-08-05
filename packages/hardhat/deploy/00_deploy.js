const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log(deployer, "deployer")

  const PMT721 = await deploy("PMT721", {
    from: deployer,
    log: true,
  });
  console.log("PMT721", PMT721.address)

  // Getting a previously deployed contract
  const PMT721Contract = await ethers.getContract("PMT721", deployer);

  const PixelsMetaverse = await deploy("PixelsMetaverse", {
    from: deployer,
    args: [PMT721Contract.address],
    log: true,
  });
  console.log("PixelsMetaverse", PixelsMetaverse.address)

  // Getting a previously deployed contract
  const PixelsMetaverseContract = await ethers.getContract("PixelsMetaverse", deployer);

  await PMT721Contract.setMinter(PixelsMetaverseContract.address);
  console.log("deploy success")
};
module.exports.tags = ["PMT721"];
