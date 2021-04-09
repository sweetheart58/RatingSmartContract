// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract EmployeeRating {
    uint public constant MAX_RATING = 5;
    uint public constant MIN_RATING = 1;

    struct Employee{
        string name;
        mapping (address => uint) rating;
    }

    event RatingCast (address indexed from, address indexed to, uint rating );

    mapping (address => Employee) employees;

    function getRating (address fromAddress, address toAddress) public view returns (uint){
        return  employees[toAddress].rating[fromAddress];
    }

    function rate(address employee, uint rating) external {
        require(rating >= MIN_RATING && rating <= MAX_RATING, 'Rating must be between 1 and 5');

        employees[employee].rating[msg.sender] = rating;
        
        emit RatingCast (msg.sender, employee, rating);
    }
}