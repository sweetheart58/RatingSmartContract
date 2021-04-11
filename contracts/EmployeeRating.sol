// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract EmployeeRating {
    uint256 public constant MAX_RATING = 5;
    uint256 public constant MIN_RATING = 1;

    struct Employee{
        string name;
        mapping (address => uint256[]) rating;
    }

    mapping (address => Employee) employees;
    string[] public skillNames;

    modifier skillsExists {
        require(skillNames.length > 0, 'Add skills before rating');
        _;
    }

    event RatingCast (address indexed from, address indexed to, uint256 rating );
    event NewSkillAdded (address indexed from, string indexed name);

    function rate(address employee, uint256[] memory ratings) external skillsExists{
        require(ratings.length == skillNames.length, 'Ratings array should have count equal to skillCount');
        
        uint256 totalRating;
        for(uint256 i; i < ratings.length; i++){
            require(ratings[i] >= MIN_RATING && ratings[i] <= MAX_RATING, 'Rating must be between 1 and 5');
            employees[employee].rating[msg.sender].push(ratings[i]);
            totalRating +=  ratings[i];
        }
        
        emit RatingCast (msg.sender, employee, totalRating/ratings.length);
    }

    function getRatings (address fromAddress, address toAddress) public view skillsExists returns (uint256[] memory){
        return employees[toAddress].rating[fromAddress];
    }

    function getAverageRating (address fromAddress, address toAddress) public view skillsExists returns (uint256){
        uint256 totalRating;
        for(uint256 i; i < employees[toAddress].rating[fromAddress].length; i++){
            totalRating += employees[toAddress].rating[fromAddress][i];
        }
        return  totalRating/skillNames.length;
    }

    function getSkillCount() public view returns (uint256){
        return skillNames.length;
    }

    function addNewSkill(string memory skillName) external {
        skillNames.push(skillName);
        emit NewSkillAdded (msg.sender, skillName);
    }
}