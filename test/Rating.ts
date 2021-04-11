import { ethers } from "hardhat";
import { Contract } from "@ethersproject/contracts";
const { assert, expect } = require("chai");


describe("Rating Tests", function () {
  describe("Rating an employee", () => {
    let ratingCountract: Contract; 
    before( async () => {
      const EmployeeRating = await ethers.getContractFactory("EmployeeRating");
      ratingCountract = await EmployeeRating.deploy();
    });
    
    it("Should have inital rating of 0", async () => {
      const [owner, addr1] = await ethers.getSigners();
      const ratings = [];
      ratings.push(await ratingCountract.getAverageRating(owner.address, owner.address));
      ratings.push(await ratingCountract.getAverageRating(owner.address, addr1.address));
      assert.equal(ratings[0], 0);
      assert.equal(ratings[1], 0);
    });

    it("Should have updated and returned average rating", async () => {
      const [owner, addr1] = await ethers.getSigners();
      await ratingCountract.rate(addr1.address, [1, 5])
      const aliceRating = await ratingCountract.getAverageRating(owner.address, addr1.address);
      assert.equal(aliceRating, 3);
    });

    it("Should have updated and returened all ratings", async () => {
      const [owner, addr1] = await ethers.getSigners();
      await ratingCountract.rate(addr1.address, [1, 5])
      const aliceRatings = await ratingCountract.getRatings(owner.address, addr1.address);
      assert.equal(aliceRatings[0], 1);
      assert.equal(aliceRatings[1], 5);
    });

    it("Should reject a 0 rating", async () => {
      const [addr1] = await ethers.getSigners();
      await expect(
      ratingCountract.rate(addr1.address, [0,0])
      ).to.be.revertedWith('Rating must be between 1 and 5');
    });

    it("Should reject a 6 rating", async () => {
      const [addr1] = await ethers.getSigners();
      await expect(
        ratingCountract.rate(addr1.address, [6,6])
        ).to.be.revertedWith('Rating must be between 1 and 5');
    });

    it("Should return skillCount Integer", async () => {
      const skillCount = await ratingCountract.getSkillCount();
      assert.equal(skillCount, 2);
    });
  });
});
