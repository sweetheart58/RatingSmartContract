// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract EmployeeRating {
    // TODO: Add safe mathf
    uint public constant MAX_RATING = 5;
    uint public constant MIN_RATING = 1;

    struct Employee{
        string name;
        mapping (address => mapping(uint => uint)) rating;
    }
    mapping (address => Employee) employees;

    mapping (uint => string) skillNames;
    uint public constant skillCount = 2;

    event RatingCast (address indexed from, address indexed to, uint rating );


    function getRating (address fromAddress, address toAddress) public view returns (uint){
        // TODO: Return the average rating
        return  employees[toAddress].rating[fromAddress][0];
    }

    function rate(address employee, uint[] memory ratings) external {
        require(ratings.length == skillCount, 'Ratings array should have count equal to skilCount');
        
        uint totalRating;
        for(uint i; i < ratings.length; i++){
            require(ratings[i] >= MIN_RATING && ratings[i] <= MAX_RATING, 'Rating must be between 1 and 5');
            employees[employee].rating[msg.sender][i] = ratings[i];
            totalRating = totalRating + ratings[i];
        }
        
        emit RatingCast (msg.sender, employee, totalRating/ratings.length);
    }

    function getSkillName (uint skillIndex) external view returns (string memory){
        return skillNames[skillIndex];
    } 
}