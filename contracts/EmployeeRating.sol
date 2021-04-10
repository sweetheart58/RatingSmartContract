// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract EmployeeRating {
    uint256 public constant MAX_RATING = 5;
    uint256 public constant MIN_RATING = 1;

    struct Employee{
        string name;
    // TODO: Try cahnging internal maping to array and use .length
        mapping (address => mapping(uint256 => uint256)) rating;
    }
    mapping (address => Employee) employees;
    mapping (uint256 => string) skillNames;

    uint256 public skillCount;
    constructor () {
        skillNames[0] = "Test Skill 1";
        skillNames[1] = "Test Skill 2";
        skillCount = 2;
    }

    event RatingCast (address indexed from, address indexed to, uint256 rating );


    function getRating (address fromAddress, address toAddress) public view returns (uint256){
        uint256 totalRating;
        for(uint256 i; i < skillCount; i++){
            totalRating += employees[toAddress].rating[fromAddress][i];
        }
        return  totalRating/skillCount;
    }

    function rate(address employee, uint256[] memory ratings) external {
        require(ratings.length == skillCount, 'Ratings array should have count equal to skillCount');
        
        uint256 totalRating;
        for(uint256 i; i < ratings.length; i++){
            require(ratings[i] >= MIN_RATING && ratings[i] <= MAX_RATING, 'Rating must be between 1 and 5');
            employees[employee].rating[msg.sender][i] = ratings[i];
            totalRating = totalRating + ratings[i];
        }
        
        emit RatingCast (msg.sender, employee, totalRating/ratings.length);
    }

    function getSkillName(uint256 skillIndex) external view returns (string memory){
        return skillNames[skillIndex];
    }

    function getSkillCount() public view returns (uint256){
        return skillCount;
    } 
}