import { ethers } from "hardhat";
import { Contract } from "@ethersproject/contracts";
const { assert, expect } = require("chai");


describe("Unit tests", function () {
  describe("Rating an employee", () => {
    let hardhatToken: Contract; 
    before( async () => {
      const EmployeeRating = await ethers.getContractFactory("EmployeeRating");
      hardhatToken = await EmployeeRating.deploy();
    });
    
    it("Should have inital rating of 0", async () => {
      const [owner, addr1] = await ethers.getSigners();
      const ratings = [];
      ratings.push(await hardhatToken.getRating(owner.address, owner.address));
      ratings.push(await hardhatToken.getRating(owner.address, addr1.address));
      assert.equal(ratings[0], 0);
      assert.equal(ratings[1], 0);
    });

    it("Should have updated rating after casting Rating", async () => {
      const [owner, addr1] = await ethers.getSigners();
      await hardhatToken.rate(addr1.address, 5)
      const aliceRating = await hardhatToken.getRating(owner.address, addr1.address);
      assert.equal(aliceRating, 5);
    });

    it("Should reject a 0 rating", async () => {
      const [addr1] = await ethers.getSigners();
      await expect(
      hardhatToken.rate(addr1.address, 0)
      ).to.be.revertedWith('Rating must be between 1 and 5');
    });

    it("Should reject a 6 rating", async () => {
      const [addr1] = await ethers.getSigners();
      await expect(
        hardhatToken.rate(addr1.address, 6)
        ).to.be.revertedWith('Rating must be between 1 and 5');
    });
  });
});
