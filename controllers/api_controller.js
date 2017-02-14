var blockexplorer = require('blockchain.info/blockexplorer');
var DataFrame = require('dataframe-js').DataFrame;

var https = require('https');
var fs = require('fs');

//var info = "";
//var txs= "";
var bc = [];

var options = {
  host: 'blockchain.info',
  path: '/es/rawaddr/1NfRMkhm5vjizzqkp2Qb28N7geRQCa4XqC'
};

//function from https://docs.nodejitsu.com/articles/HTTP/clients/how-to-create-a-HTTP-request/

callback = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    //console.log(str);
    var info = JSON.parse(str);
    var txs = info.txs;
    console.log(info.address);
    console.log(txs[0].hash)

    for(t in txs){
    	console.log("Entra en el for 1")
    	var inp = txs[t].inputs;
    	console.log(typeof inp)
    	console.log("Tras inp")

    	for(inputs in inp){
    		console.log("Entra en el for 2")
    		var from = inp[inputs].prev_out.addr;
    		var tout = txs[t].out;
    		for(out in tout){
    			console.log("Entra en el  for 3")
    			var to = tout[out].addr;
    			console.log(to)
    			var va = tout[out].value
    			console.log(va)
    			bc.push([from,to,va]);

    		}
    	}
    }

    console.log(bc.length)
    //http://stackoverflow.com/questions/18848860/javascript-array-to-csv

    var lineArray = [];
	bc.forEach(function (infoArray, index) {
	    var line = infoArray.join(",");
	    lineArray.push(index == 0 ? "origin,destination,value"+ "\n" + line : line);
	});
	var csvContent = lineArray.join("\n");
	fs.writeFile("force.csv", csvContent);

  });
}

exports.api = function(req, res, next){
	var ad = blockexplorer.getAddress(address="1NfRMkhm5vjizzqkp2Qb28N7geRQCa4XqC", limit=1000);
	
	https.request(options, callback).end();


	res.render('resultados/result', {dir: "info.address"});
	
}