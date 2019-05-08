
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import elections_artifacts from '../../build/contracts/Elections.json'

var Elections = contract(elections_artifacts);

let candidates = []

let account

window.voteForCandidate = function(candidate) {
  	let candidateName = $("#candidate").val();
  	try {
	 	$("#msg").html("Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.")
	 	$("#candidate").val("");
		document.getElementById("candidate-vote").disabled = true;
	 	document.getElementById("candidate-vote").className = "btn btn-secondary btn-lg";
	 	let voted = document.getElementById("candidate-options").value;
	 	Elections.deployed().then(function(contractInstance) {
			contractInstance.votesFor(asciiToHex(voted), {gas: 140000, from: account}).then(function() {
		  	let divID = "#vote-" + voted.replace(/ /g, "");
		  	return contractInstance.totalVotes.call(asciiToHex(voted)).then(function(v) {
				 	$(divID).html(v.words[0]);
				 	$("#msg").html("");
				 	document.getElementById("candidate-vote").disabled = false;
				 	document.getElementById("candidate-vote").className = "btn btn-primary btn-lg";
		  		});
			});
		});
  	} catch (err) {
	 	console.log(err);
  	}
}

$( document ).ready(function() {
  
	window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

	web3.eth.getAccounts(function (err, accs) {
		account = accs[0]
	})
	Elections.setProvider(web3.currentProvider);

	let converter = new Web3();

	Elections.deployed().then(function(contractInstance) {
		contractInstance.getlistOfCandidates.call().then(function(v) {
		  	let allCandidates = v.sort(sortHex)
		  	for(let i=0; i<v.length; i++)
		  	{   
				let candidate = hexToAscii(allCandidates[i])
				candidates.push(candidate);
				const candidateOption = document.createElement("option");
				candidateOption.value = candidate.trim();
				candidateOption.innerText = candidate;
				document.getElementById("candidate-options").appendChild(candidateOption);
				
				Elections.deployed().then(function(contractInstance) {
				  	contractInstance.totalVotes.call(asciiToHex(candidate)).then(function(v) {

					 	const rowElem = document.createElement("tr");
	 
					 	const nameCell = document.createElement("td");
					 	nameCell.innerText = candidate;
					 	rowElem.appendChild(nameCell);

					 	// Creates a cell element for the votes.
					 	const voteCell = document.createElement("td");
					 	voteCell.id = "vote-" + candidate.replace(/ /g, ""); 
					 	voteCell.innerText = v.words[0];
					 	voteCell.scope = "col"
					 	rowElem.appendChild(voteCell);

					 	// Adds the new row to the voting table.
					 	document.getElementById("table-body").appendChild(rowElem);
				  	});
				})
		 	}
		});
	})
});

function asciiToHex(str){
	var arr1 = ['0x'];
	for (var n = 0, l = str.length; n < l; n ++) {
		var hex = Number(str.charCodeAt(n)).toString(16);
		arr1.push(hex);
	}
	return arr1.join('');
}

function hexToAscii(str){
	var hex  = str.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		  let chck = parseInt(hex.substr(n, 2), 16)
		  if( chck )
		{ str += String.fromCharCode(chck); }
	}
	return str;
}

function sortHex(a,b){
	a = hexToAscii(a)
	b = hexToAscii(b)

	if (a < b) return -1;
	if (a > b) return 1;
	return 0;
}
