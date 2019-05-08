var Voting = artifacts.require("Elections");

var candidates = ['Frances Fitzgerald TD',
'Mark Durkan',
'Barry Andrews',
'Lynn Boylan MEP',
'Alex White',
'Clare Daly TD',
'Ciarán Cuffe',
'Gary Gannon',
'Eílis Ryan',
'Gillian Brien',
'Rita Harrold',
'Alice Mary Higgins',
'Eamon Murphy',
'Hermann Kelly',
"Gemma O'Doherty",
'Ben Gilroy',
'Aisling McNiffe',
'Mark Mullan',
'Tony Bosco Lowth']
module.exports = function(deployer) {
  candidates = candidates.map(name => web3.utils.asciiToHex(name))
  deployer.deploy(Voting, candidates);
};


