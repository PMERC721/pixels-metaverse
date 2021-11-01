var PixelsMetavers = artifacts.require("./PixelsMetavers.sol");

module.exports = function(deployer) {
  deployer.deploy(PixelsMetavers);
};