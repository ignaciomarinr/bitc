var blockexplorer = require('blockchain.info/blockexplorer');
var DataFrame = require('dataframe-js').DataFrame;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var https = require('https');
var fs = require('fs');
var originAddress = "";

var valid = 0;

//var info = "";
//var txs= "";

//bc incluye los valores from, to y value que se incluirán en el fichero
var bc = [];
var A = "a";

// var options = 'blockchain.info/es/rawaddr/1JygMEn42dRJCYQ4s9sjk3Mi5AFvTvpNbA'

var options = {
    host: 'https://blockchain.info',
    path: '/es/rawaddr/1JygMEn42dRJCYQ4s9sjk3Mi5AFvTvpNbA'
};


console.log("options.host: "+ options.host);
//function from https://docs.nodejitsu.com/articles/HTTP/clients/how-to-create-a-HTTP-request/

var direccionesPrueba =["1NfRMkhm5vjizzqkp2Qb28N7geRQCa4XqC",
                        "1JygMEn42dRJCYQ4s9sjk3Mi5AFvTvpNbA",
                        "1EFg9XXX1U99pNJJTeQwuuEpbHFW4XS8uL",
                        "12vAHkg7VaDUDKm9HdysEfQhgErVxnGREV"];



exports.api = function(req, res, next){

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
            console.log(txs[0].hash);

            for(t in txs){
                console.log("Entra en el for txs");
                var inp = txs[t].inputs;
                var tout = txs[t].out;

                for(inputs in inp){
                    console.log("Entra en el for inp");
                    var from = inp[inputs].prev_out.addr;
                    var to = originAddress;
                    var va = inp[inputs].prev_out.value;
                    bc.push([from,to,va]);
                    direcciones.push(from);

                }
                for(out in tout){
                    console.log("Entra en el  for tout");
                    var from = originAddress;
                    var to = tout[out].addr;
                    var va = tout[out].value;
                    bc.push([from,to,va]);
                    direcciones.push(to);

                }
            }

            console.log("bc: "+bc.length);
            //http://stackoverflow.com/questions/18848860/javascript-array-to-csv

            var lineArray = [];
            bc.forEach(function (infoArray, index) {
                var line = infoArray.join(",");
                lineArray.push(index == 0 ? "source,target,value"+ "\n" + line : line);
            });
            var csvContent = lineArray.join("\n");
            fs.appendFile("force.csv", csvContent);

            var dirContent = direcciones.join("\n");
            fs.appendFile("direcciones.txt",dirContent);

            res.render('resultados/result', {dir: originAddress});
            console.log("Antes de long");
            console.log("longitud array direcciones: "+ direcciones.length);

            console.log("Tras el RENDER");


        });
    }//Fin de la función callback


    //Obtenemos la dirección origen y la incluimos como primera dirección a buscar.
    var answer = req.query.answer;
    var direcciones = [answer];

    //El siguiente código ha sido obtenido y tras ello modificado de la url:
    //https://developers.google.com/web/fundamentals/getting-started/primers/promises
    //Realiza peticiones HTTP usando XMLHttpRequest()
    
    function get(url) {
        console.log("Entra en get");
        // Return a new promise.
        return new Promise(function(resolve, reject) {
            console.log("Entra en Promise");
            // Do the usual XHR stuff
            var req = new XMLHttpRequest();
            req.open('GET', url);
            console.log("Tras req.open('GET', url)");

            req.onload = function() {
                console.log("Entra en onload");
                // This is called even on 404 etc
                // so check the status
                if (req.status == 200) {
                    // Resolve the promise with the response text
                    resolve(req.response);
                }
                else {
                    // Otherwise reject with the status text
                    // which will hopefully be a meaningful error
                    reject(Error(req.statusText));
                }
            };

            // Handle network errors
            req.onerror = function() {
                reject(Error("Network Error"));
            };

            // Make the request
            req.send();
            console.log("Tras req.send()");

        });
    }


    //Función que realiza las peticiones HTTP usando la función get previamente creada.
    function llamadasHttp(){
        console.log("Entra en llamadasHttp");
        if(direccionesPrueba.length >= 1){
            originAddress = direccionesPrueba.shift();
            var path1 = '/es/rawaddr/' + originAddress;
            options.path = path1;

            get(options.host + options.path).then(
                function (response) {
                    console.log("SUCCESS! " + originAddress, response);
                    llamadasHttp();
                },
                function (error) {
                    console.error("FAILED!", error);
                });
        }

    }

    llamadasHttp();



}