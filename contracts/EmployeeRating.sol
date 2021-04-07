// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract EmployeeRating {
    struct Employee{
        string name;
        mapping (address => uint) rating;
    }

    event VoteCast (address indexed from, address indexed to, uint rating );

    mapping (address => Employee) employeesMapping;

    function getEmployeeRating (address toAddress, address fromAddress) public view returns (uint){
        return  employeesMapping[toAddress].rating[fromAddress];
    }

    function rate(address employee, uint rating) public {
        address caller = msg.sender;
        employeesMapping[employee].rating[caller] = rating;
        emit VoteCast (caller, employee, rating);
    }
}