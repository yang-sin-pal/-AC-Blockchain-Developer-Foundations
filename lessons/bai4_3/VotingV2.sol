// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingV2 {
    struct Candidate {
        string name;
        uint voteCount;
    }

    address public owner;

    mapping(bytes32 => Candidate) public candidates;
    mapping(address => bool) public hasVoted;

    uint public candidatesCount;

    event Voted(address indexed voter, bytes32 indexed candidateId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addCandidate(string memory _name) public onlyOwner {
        // Trộn nhiều input để id trở nên khác biệt.
        bytes32 id = keccak256(abi.encodePacked(_name, candidatesCount, block.timestamp));
        candidates[id] = Candidate(_name, 0);
        candidatesCount++;
    }

    function vote(bytes32 _candidateId) public {
        require(!hasVoted[msg.sender], "You have already voted");
        require(bytes(candidates[_candidateId].name).length > 0, "Candidate does not exist");

        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit Voted(msg.sender, _candidateId);
    }
}
