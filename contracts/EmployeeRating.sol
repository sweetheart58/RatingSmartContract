// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract EmployeeRating {
    struct Employee{
        string name;
        mapping (address => uint) rating;
    }

    event RatingCast (address indexed from, address indexed to, uint rating );

    mapping (address => Employee) employeesMapping;

    function getRating (address fromAddress, address toAddress) public view returns (uint){
        return  employeesMapping[toAddress].rating[fromAddress];
    }

    function rate(address employee, uint rating) public {
        address caller = msg.sender;

        require(rating > 1 && rating <= 5, 'Rating must be between 1 and 5');

        employeesMapping[employee].rating[caller] = rating;
        
        emit RatingCast (caller, employee, rating);
    }
}