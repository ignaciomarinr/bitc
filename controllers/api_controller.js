var blockexplorer = require('blockchain.info/blockexplorer');
var DataFrame = require('dataframe-js').DataFrame;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var https = require('https');
var fs = require('fs');
var originAddress = "";
var elementoExtraido;




var options = {
    host: 'https://blockchain.info',
    path: '/es/rawaddr/1JygMEn42dRJCYQ4s9sjk3Mi5AFvTvpNbA'
};


console.log("options.host: "+ options.host);
//function from https://docs.nodejitsu.com/articles/HTTP/clients/how-to-create-a-HTTP-request/




exports.api = function(req, res, next){


    //Obtenemos la dirección origen y la incluimos como primera dirección a buscar.
    //Se inicia con valor 0 ya que es el nivel cero del árbol.

    var profundidadDeseada = 0;//por definir
    var profundidad;
    var answer = req.query.answer;
    //inicializamos el array de direcciones introducimos la primera dirección
    var direcciones = [[0,answer]];
    var direccionesPrueba =[[0,"1NfRMkhm5vjizzqkp2Qb28N7geRQCa4XqC"],
        [1,"1JygMEn42dRJCYQ4s9sjk3Mi5AFvTvpNbA"],
        [1,"1EZBqbJSHFKSkVPNKzc5v26HA6nAHiTXq6"],
        [2,"12vAHkg7VaDUDKm9HdysEfQhgErVxnGREV"],
        [3,"1EFg9XXX1U99pNJJTeQwuuEpbHFW4XS8uL"]];

    primeraLinea();

    llamadasHttp();

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////FUNCIONES UTILIZADAS////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    //escribir primera linea csv.
    function primeraLinea(){
        console.log("ENTRA EN PRIMERALINEA");
        var textA = ["source,target,value\n"];
        var csvContent = textA.join("\n");
        fs.appendFile("prueba.csv", csvContent);
    }

    //El siguiente código ha sido obtenido y tras ello modificado de la url:
    //https://developers.google.com/web/fundamentals/getting-started/primers/promises
    //Realiza peticiones HTTP usando XMLHttpRequest()


    //Función que realiza las peticiones HTTP usando la función get previamente creada.
    function llamadasHttp(){
        console.log("Entra en llamadasHttp");


        profundidad = direcciones[0][0];
        console.log("Profundidad antes de comprobar: "+direcciones[0][0]);
        //Mientras el array de direcciones no este vacio y no se haya sobrepasado la profundidad deseada.
        if(direcciones.length >= 1 && profundidad <= profundidadDeseada){
            console.log("Profundidad TRAS de comprobar: "+direcciones[0][0]);
            //extraemos el primer elemento del array direcciones(direcciones[0]) que sera de la forma Array[int(profundidad),address]
            elementoExtraido = direcciones.shift();
            //elementoExtraido = direcciones.shift();
            profundidad = elementoExtraido[0];
            originAddress = elementoExtraido[1];
            console.log("origin address en llamadasHttp: "+originAddress);

            console.log("origin Address: "+originAddress);


            var path1 = '/es/rawaddr/' + originAddress, request, jsonResponse;
            options.path = path1;


            get(options.host + options.path).then(
                //The promise has been resolved with response.
                function (response) {
                    generarCSV(response);
                    console.log("SUCCESS!! Address en response del get= "+info.address);
                    llamadasHttp();
                },
                function (error) {
                    console.error("FAILED!", error);
                });
        }


    }//fin funcion llamadasHttp()

    function get(url) {
        console.log("Entra en get");
        console.time("Test tiempo");
        console.log("Url de get: "+url);
        // Return a new promise.
        return new Promise(function(resolve, reject) {
            console.log("Entra en Promise");
            // Do the usual XHR stuff
            var req = new XMLHttpRequest();
            req.open('GET', url);
            console.log("Tras req.open('GET', url)");

            //onload se ejecuta cuando la petición XMLHttpRequest se completa con exito.
            req.onload = function() {
                console.log("Entra en onload");
                // This is called even on 404 etc
                // so check the status
                if (req.status == 200) {
                    // Resolve the promise with the responseText
                    resolve(req.responseText);
                    console.timeEnd("Test tiempo");
                }
                else {
                    // Otherwise reject with the status text
                    // which will hopefully be a meaningful error
                    reject(Error(req.statusText));
                };
            };

            // Handle network errors
            req.onerror = function() {
                reject(Error("Network Error"));
            };

            // Make the request
            req.send();
            console.log("Tras req.send()");

        });
    }//fin funcion get;

    function generarCSV(response){

        var info = JSON.parse(response);
        var txs = info.txs;

        // array incluye los valores from, to y value que se incluirán en el fichero
        var array = [];

        console.log("Profundidad inicio generarCSV: "+ profundidad);

        profundidad++;
        console.log("Profundidad tras aumento generarCSV: "+ profundidad);
        direcciones.push([profundidad,"1EZBqbJSHFKSkVPNKzc5v26HA6nAHiTXq6"]);
        direcciones.push([profundidad,"1Fm4Carm5Cn12f9bp6pFGYw6L6yVHtLcKD"]);

        console.log("Entra en generarCSV()");

        /*
        var test0 = "test0,test0,test0";
        var test1 = "test1,test1,test1\n";
        //var test=["test0,test0,test0","test1,test1,test1\n"];
        var test=[];
        test.push(test0);
        test.push(test1);

        var csvContent = test.join("\n");
         fs.appendFile("prueba.csv", csvContent);
        */


        var test=[];

        for(t in txs){
             console.log("Entra en el for txs");
             var inp = txs[t].inputs;
             var tout = txs[t].out;

             for(inputs in inp){
                 console.log("Entra en el for inp");
                 var from = inp[inputs].prev_out.addr;
                 var to = originAddress;
                 var va = inp[inputs].prev_out.value;
                 var sum = from.concat(","+to).concat(","+va+"\n");
                 test.push(sum);
                // var csvContent = test.join("\n");
                 fs.appendFile("prueba.csv", test);
                 direcciones.push(from);

             }
             for(out in tout){
                 console.log("Entra en el  for tout");
                 var from = originAddress;
                 var to = tout[out].addr;
                 var va = tout[out].value;
                 var sum = from.concat(","+to).concat(","+va+"\n");
                 test.push(sum);
                 var csvContent = test.join("\n");
                 fs.appendFile("prueba.csv", csvContent);
                 direcciones.push(to);

             }
         }
        /*

         console.log("array: "+array.length);
         //http://stackoverflow.com/questions/18848860/javascript-array-to-csv

         var lineArray = [];
         array.forEach(function (infoArray, index) {
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
         */

    }//Fin de la función generarCSV



};//fin exports.api