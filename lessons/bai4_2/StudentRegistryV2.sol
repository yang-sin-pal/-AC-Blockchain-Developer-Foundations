// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StudentRegistryV2 {
    struct Student {
        string name;
        uint age;
        bool isRegistered;
    }

    mapping(address => Student) private students;

    address public owner;

    event StudentRegistered(address indexed student, string name, uint age);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function register(string memory _name, uint _age) public onlyOwner {
        students[msg.sender] = Student(_name, _age, true);
        emit StudentRegistered(msg.sender, _name, _age);
    }

    function getStudent(address _user) public view returns (string memory, uint, bool) {
        Student memory s = students[_user];
        return (s.name, s.age, s.isRegistered);
    }

    function isStudentRegistered(address _user) public view returns (bool) {
        return students[_user].isRegistered;
    }
}
