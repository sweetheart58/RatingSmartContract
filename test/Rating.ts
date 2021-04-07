import hre from "hardhat";
import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { EmployeeRating } from "../typechain/EmployeeRating";
import { Signers } from "../types";

const { deployContract } = hre.waffle;

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await hre.ethers.getSigners();
    this.signers.admin = signers[0];
    this.alice = signers[1];
    this.bob = signers[2];
  });

  describe("Greeter", () => {
    beforeEach(async () => {
      const contractArtifact: Artifact = await hre.artifacts.readArtifact("EmployeeRating");
      this.deployedContract = <EmployeeRating>await deployContract(this.signers.admin, contractArtifact, [5]);
    });

    it("should return the rating after casting rating", async () => {
        await this.deployedContract.connect(this.signers.alice).rate(this.signers.bob.address, 4);
        expect(await this.deployedContract.connect(this.signers.admin).getEmployeeRating(this.alice.address, this.bob.address)).to.equal(4);
    });
  });
});
