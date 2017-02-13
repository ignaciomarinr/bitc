var blockexplorer = require('blockchain.info/blockexplorer');
var address = blockexplorer.getAddress(address="1NfRMkhm5vjizzqkp2Qb28N7geRQCa4XqC", limit=1000);

var txs = address.address;


exports.api = function(req, res, next){
	res.render('resultados/result', {title: "Resultado BITC"});
}