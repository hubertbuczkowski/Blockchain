pragma solidity >=0.4.0 <0.6.0;

contract Elections {
  
  mapping (bytes32 => uint256) public candidateVotes;
  
  bytes32[] public listOfCandidates;

  constructor(bytes32[] memory candidateNames) public {
    listOfCandidates = candidateNames;
  }

  function totalVotes(bytes32 candidate) view public returns (uint256) {
    require(validCandidate(candidate));
    return candidateVotes[candidate];
  }

  function votesFor(bytes32 candidate) public {
    require(validCandidate(candidate));
    candidateVotes[candidate] += 1;
  }

  function validCandidate(bytes32 candidate) view public returns (bool) {
    for(uint i = 0; i < listOfCandidates.length; i++) {
      if (listOfCandidates[i] == candidate) {
        return true;
      }
    }
    return false;
  }

  function getlistOfCandidates() view public returns (bytes32[] memory data) {
    return listOfCandidates;
  }
}
