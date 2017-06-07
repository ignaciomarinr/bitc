var blockexplorer = require('blockchain.info/blockexplorer');
var DataFrame = require('dataframe-js').DataFrame;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var csv = require('express-csv');

var https = require('https');
var fs = require('fs');
var originAddress = "";
var elementoExtraido;




var options = {
    host: 'https://blockchain.info',
    path: '/es/rawaddr/1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
};


console.log("options.host: "+ options.host);
console.time("TIEMPO TOTAL");
//function from https://docs.nodejitsu.com/articles/HTTP/clients/how-to-create-a-HTTP-request/

var csvArray = [];
var csvPrueba = [["source","tarjet","value"],["A","B",2],["A","C",2],["D","A",2]];

exports.csv = function (req, res) {
    //res.csv(csvArray);
    console.log("exportsCSV= "+csvArray)
    res.csv(csvArray);
};


exports.api = function(req, res){


    //Obtenemos la dirección origen y la incluimos como primera dirección a buscar.
    //Se inicia con valor 0 ya que es el nivel cero del árbol.

    var answer;
    answer = req.query.answer;
    var nodos;
    nodos = req.query.nodos;




    var profundidadIndicada = req.query.prof;

    console.log("profundidadIndicada= "+profundidadIndicada);

    var profundidadDeseada = profundidadIndicada;
    profundidadDeseada--;
    console.log("profundidadDESEADA= "+profundidadDeseada);
    var profundidad;

    //inicializamos el array de direcciones introducimos la primera dirección
    csvArray = [];
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
        var textB = ["source","target","value"];
        csvArray.push(textB);
        var csvContent = textA.join("\n");
        console.log("------IMPRIMO: "+ JSON.stringify(csvContent));
        //fs.writeFile("prueba.csv", csvContent);//escribir en un stream
    }

    //El siguiente código ha sido obtenido y tras ello modificado de la url:
    //https://developers.google.com/web/fundamentals/getting-started/primers/promises
    //Realiza peticiones HTTP usando XMLHttpRequest()


    //Función que realiza las peticiones HTTP usando la función get previamente creada.
    function llamadasHttp(){
        console.log("llamadasHttp()");
        console.log("Entra en llamadasHttp");


        profundidad = direcciones[0][0];
        console.log("profundidadDESEADA= "+profundidadDeseada);
        console.log("Profundidad antes de comprobar: "+profundidad);
        if(profundidad <= profundidadDeseada){
            console.log("profundidad <= profundidadDeseada");
        }
        //Mientras el array de direcciones no este vacio y no se haya sobrepasado la profundidad deseada.
        if(direcciones.length >= 1 && profundidad <= profundidadDeseada){
            console.log("Profundidad TRAS  comprobar: "+direcciones[0][0]);
            //extraemos el primer elemento del array direcciones(direcciones[0]) que sera de la forma Array[int(profundidad),address]
            elementoExtraido = direcciones.shift();
            console.log("elemento extraido->originAddress: "+ elementoExtraido);
            //elementoExtraido = direcciones.shift();
            profundidad = elementoExtraido[0];
            console.log("profundidad en llamadasHttp= "+profundidad);
            originAddress = elementoExtraido[1];
            console.log("origin address en llamadasHttp: "+originAddress);

            console.log("origin Address: "+originAddress);


            var path1 = '/es/rawaddr/' + originAddress, request, jsonResponse;
            options.path = path1;


            get(options.host + options.path).then(
                //The promise has been resolved with response.
                function (response) {
                    generarCSV(response);
                    //console.log("SUCCESS!! Address en response del get= "+info.address);
                    llamadasHttp();
                },
                function (error) {
                    console.error("FAILED!", error);
                });
        }else{

            console.log("LANZA RENDER");
            console.log("originAdress antes del render: "+answer);
            //res.csv(csvArray);
            res.render('resultados/result', {dir: answer});
            //////////////////////////////
            console.timeEnd("TIEMPO TOTAL");
            //////////////////////////////
        }


    }//fin funcion llamadasHttp()

    function get(url) {
        console.log("get(url)");
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

        console.log("generarCSV()");

        var info = JSON.parse(response);
        var txs = info.txs;

        // array incluye los valores from, to y value que se incluirán en el fichero
        var array = [];

        console.log("Profundidad inicio generarCSV: "+ profundidad);

        profundidad++;
        console.log("Profundidad tras aumento generarCSV: "+ profundidad);

        console.log("Entra en generarCSV()");

        // En test se van guardando temporalente los datos a guardar en el archivo antes de hacerlo. Tras ello se borran.
        var test=[];

        for(t in txs){
             console.log("Entra en el for txs");
             var inp = txs[t].inputs;
             var tout = txs[t].out;
             var envio = false;

            console.log("inp[0].prev_out.addr= "+ inp[0].prev_out.addr +"\n");
            console.log("originAddress= "+originAddress);

            for(input in inp){
                if(inp[input].prev_out.addr===originAddress){
                    envio = true;
                    console.log("envio= "+envio);
                }
            }
            // if(inp[0].prev_out.addr === originAddress){
            if(envio){
                     for(out in tout){
                         console.log("Entra en el  for tout");
                         var from = originAddress;
                         var to = tout[out].addr;
                         var va = tout[out].value;
                         var sum = from.concat(","+to).concat(","+va+"\n");
                         csvArray.push([from,to,va]);
                         test.push(sum);
                         // var csvContent = test.join("\n");
                         var csvContent = test;
                         console.log("------IMPRIMO: "+ JSON.stringify(csvContent));
                       //  fs.appendFile("prueba.csv", csvContent);
                         test = [];
                         var incluirEnDirecciones = [profundidad,to];
                         direcciones.push(incluirEnDirecciones);
                         console.log("++++incluyo en direcciones: "+JSON.stringify(incluirEnDirecciones));
                     }
            } else{
                     for(inputs in inp){
                         console.log("Entra en el for inp");
                         var from = inp[inputs].prev_out.addr;
                         var to = originAddress;
                         var va = inp[inputs].prev_out.value;
                         var sum = from.concat(","+to).concat(","+va+"\n");
                         csvArray.push([from,to,va]);
                         test.push(sum);
                         // var csvContent = test.join("\n");
                         console.log("------IMPRIMO: "+ JSON.stringify(test));
                      //  fs.appendFile("prueba.csv", test);
                         test = [];
                         var incluirEnDirecciones = [profundidad,from];
                         direcciones.push(incluirEnDirecciones);
                         console.log("++++incluyo en direcciones: "+JSON.stringify(incluirEnDirecciones));

                     }
                 }
             }

    }//Fin de la función generarCSV



}//fin exports.api