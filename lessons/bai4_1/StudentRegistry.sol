// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StudentRegistry {
    struct Student {
        string name;
        uint age;
        bool isRegistered;
    }

    mapping(address => Student) private students;

    function register(string memory _name, uint _age) public {
        students[msg.sender] = Student(_name, _age, true);
    }

    function getStudent(address _user) public view returns (string memory, uint, bool) {
        Student memory s = students[_user];
        return (s.name, s.age, s.isRegistered);
    }

    function isStudentRegistered(address _user) public view returns (bool) {
        return students[_user].isRegistered;
    }
}
