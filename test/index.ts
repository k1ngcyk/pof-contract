import { expect } from "chai";
import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { beforeEach } from "mocha";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity);

describe("Phone On Face", () => {
  let pof: Contract;
  let owner: SignerWithAddress;
  let address1: SignerWithAddress;

  beforeEach(async () => {
    const POFFactory = await ethers.getContractFactory("POF");
    [owner, address1] = await ethers.getSigners();
    const baseuri = "https://api.phoneonface.xyz/metadata/"
    pof = await POFFactory.deploy(baseuri);
    await pof.deployed();
  });

  it("Should initialize the contract", async () => {
    expect(await pof.maxSupply()).to.equal(5555);
  });

  it("Should set the right owner", async () => {
    expect(await pof.owner()).to.equal(await owner.address);
  });

  it("Should mint an nft", async () => {
    const nftCost = await pof.cost();
    const tokenId = await pof.totalSupply();
    expect(
      // pof.mint(amount)
      await pof.mint(5, {
        value: 5 * nftCost,
      })
    )
    .to.emit(pof, "Transfer")
    .withArgs(ethers.constants.AddressZero, owner.address, tokenId + 4);
  });
});
