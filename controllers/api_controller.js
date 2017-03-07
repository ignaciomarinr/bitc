var blockexplorer = require('blockchain.info/blockexplorer');
var DataFrame = require('dataframe-js').DataFrame;

var https = require('https');
var fs = require('fs');
var originAddress = "";

var valid = 0;

//var info = "";
//var txs= "";
var bc = [];
var A = "a";

// var options = 'blockchain.info/es/rawaddr/1JygMEn42dRJCYQ4s9sjk3Mi5AFvTvpNbA'

var options = {
  host: 'blockchain.info',
  path: '/es/rawaddr/1JygMEn42dRJCYQ4s9sjk3Mi5AFvTvpNbA'
};


console.log("options.host: "+ options.host)
//function from https://docs.nodejitsu.com/articles/HTTP/clients/how-to-create-a-HTTP-request/




exports.api = function(req, res, next){
  
  var answer = req.query.answer;

  console.log("Direcion introducida: " + answer)

  originAddress = answer;
  var path1 ='/es/rawaddr/'+ originAddress;
  options.path = path1;
  console.log("originAddress: " + answer)
  console.log("PATH= "+options.path)

  callback = function(response) {

      bc = [];
      var str = '';

      valid = 0;

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
        originAddress = info.address;
        console.log(txs[0].hash)

        for(t in txs){
          console.log("Entra en el for 1")
          var inp = txs[t].inputs;
          var tout = txs[t].out;
          console.log(typeof inp)
          console.log("Tras inp")

          for(inputs in inp){
            console.log("Entra en el for 2")
            var from = inp[inputs].prev_out.addr;
            for(out in tout){
              console.log("Entra en el  for 3")
              var to = tout[out].addr;
              console.log("to: "+to)
              var va = tout[out].value
              console.log("va: "+va)
              bc.push([from,to,va]);

            }
          }
        }

        console.log(bc.length)
        //http://stackoverflow.com/questions/18848860/javascript-array-to-csv

        var lineArray = [];
      bc.forEach(function (infoArray, index) {
          var line = infoArray.join(",");
          lineArray.push(index == 0 ? "source,target,value"+ "\n" + line : line);
      });
      var csvContent = lineArray.join("\n");
      fs.writeFile("force.csv", csvContent);

      res.render('resultados/result', {dir: originAddress});
      console.log("Tras el RENDER")

      });
  }
  
  https.request(options, callback.bind({res: res})).end();

  
   //res.render('resultados/result', {dir: originAddress});
   //console.log("Tras el RENDER")
  
  
}