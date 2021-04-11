import { ethers } from "hardhat";
import { Contract } from "@ethersproject/contracts";
const { assert, expect } = require("chai");


describe("Rating Tests", function () {
  let ratingCountract: Contract; 
  before( async () => {
    const EmployeeRating = await ethers.getContractFactory("EmployeeRating");
    ratingCountract = await EmployeeRating.deploy();
  });

  describe("Checking and adding skills", () => {
    it("Should throw error if no skill is added", async () => {
      const [addr1] = await ethers.getSigners();
      await expect(
      ratingCountract.rate(addr1.address, [1,5])
      ).to.be.revertedWith('Add skills before rating');
    })

    it("Should add a new skill", async () => {
      await ratingCountract.addNewSkill('Skill 1');
      const newSkill = await ratingCountract.skillNames(0);
      assert.equal(newSkill, 'Skill 1');
    });

    it("Should return skillCount Integer", async () => {
      const skillCount = await ratingCountract.getSkillCount();
      assert.equal(skillCount, 1);
    });
  });

  describe("Rating an employee", () => {
    before( async () => {
      await ratingCountract.addNewSkill('Skill 2');
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
      await ratingCountract.rate(addr1.address, [1, 3241])
      const aliceRating = await ratingCountract.getAverageRating(owner.address, addr1.address);
      assert.equal(aliceRating, 1621);
    });

    it("Should have updated and returened all ratings", async () => {
      const [owner, addr1] = await ethers.getSigners();
      await ratingCountract.rate(addr1.address, [1, 3241])
      const aliceRatings = await ratingCountract.getRatings(owner.address, addr1.address);
      assert.equal(aliceRatings[0], 1);
      assert.equal(aliceRatings[1], 3241);
    });

    it("Should reject a 0 rating", async () => {
      const [addr1] = await ethers.getSigners();
      await expect(
      ratingCountract.rate(addr1.address, [0,0])
      ).to.be.revertedWith('Rating must be within limits');
    });

    it("Should reject a 6 rating", async () => {
      const [addr1] = await ethers.getSigners();
      await expect(
        ratingCountract.rate(addr1.address, [BigInt(6000000000000000000),
          BigInt(6000000000000000000)])
        ).to.be.revertedWith('Rating must be within limits');
    });
  });
});
