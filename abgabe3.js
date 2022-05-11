"use strict"
var arrayAlleBushaltestellen = [];
var arrayBushalteDistanz =[];
var arrayAktuelleBH = [];
var headerBHList = "<TR> <TH> Distanz</TH> <TH> Haltestelle</TH></TR>";
var tabelleAbfahrt;
var tabelleBushalte;


document.getElementById("button_bushalte").addEventListener("click", ()=> uebung3());
document.getElementById("button_abfahrten").addEventListener("click", ()=> loadAktuelleBH());


document.getElementById("button_bushalte_print").addEventListener("click", ()=>  document.getElementById("whereTheMagicHappens").innerHTML = printAufgabe3());


function uebung3()
{

    console.log("[Übung3] anfang.");
    const standpunkt =[];
    standpunkt.push(stand_lon);
    standpunkt.push(stand_lat);
    loadNearbyBushalte();
   // loadAktuelleBH();
    console.log("[Übung3] fertig.");

}



function printAufgabe3()
{
    printAbfahrten();
    tabelleBushalte = makeTableHTML(arrayBushalteDistanz, headerBHList,2 );
    let result = "\n <table border=1 vertical-align='top'> ";
     result += "<TR> <TH align=center> Bushaltestellen</TH> <TH align=center> nächste Bushaltestelle </TH> </TR>";
     result += "<TR align=top vertical-align=top> <TD> "+ tabelleBushalte +"</TD> <TD rowspan=0> "+ tabelleAbfahrt +"</TD> </TR>";
     result += "</table>";

     return result;

}



function loadNearbyBushalte()
{
    console.log("[loadBushalte] anfang.");
    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200)
        {
            let res = JSON.parse(this.responseText);
              showNearbyBushalte(res.features);
           console.log(res);

        }
    }
    xhttp.open("GET", "https://rest.busradar.conterra.de/prod/haltestellen", true);
    xhttp.send();
    console.log("[loadBushalte] fertig.");

}

function showNearbyBushalte(nbbushalte)
{
    console.log(nbbushalte);
    console.log("[showBushalte] anfang.");
    for(const element of nbbushalte){
            let myBushalte =  new Bushaltestelle(element.geometry.coordinates[0],element.geometry.coordinates[1],element.properties.lbez, element.properties.richtung, element.properties.nr);
           arrayAlleBushaltestellen.push(myBushalte)
           let distanzPackage =[];
           distanzPackage.push(myBushalte.distanceBushalte(stand_lon,stand_lat));  
           distanzPackage.push(myBushalte.name +", "+ myBushalte.richtung);
           distanzPackage.push(myBushalte.ID);
           arrayBushalteDistanz.push(distanzPackage);
           sortiere(arrayBushalteDistanz);
    }
    console.log(arrayBushalteDistanz);
    console.log("[showBushalte] fertig.");
}


function printAbfahrten()
{
    console.log("[printAbfahrten] anfang.");
    let res = "<table border= 1 vertical-align=top>";
    res += "<TR><TH colspan = 3 >Bushaltestelle: "+arrayBushalteDistanz[0][1] +"</TH></TR>";
    let headerBH = "<TR> <TH> Linie </TH><TH> Richtung </TH> <TH> Abfahrt in</TH></TR>";
    res += "<TR><TD colspan = 3>"+ makeTableHTML(arrayAktuelleBH, headerBH ,3)+"</TD></TR>";
    res += "</table>";
    console.log("[printAbfahrten] fertig.");
    tabelleAbfahrt = res;
}

function loadAktuelleBH()
{
    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200)
        {
            let res = JSON.parse(this.responseText);
              
            showAktuelleBH(res);
           console.log(res);
        }
    }
    xhttp.open("GET", "https://rest.busradar.conterra.de/prod/haltestellen/"+arrayBushalteDistanz[0][2]+"/abfahrten?sekunden=300", true);
    xhttp.send();

}

function unixINTOdate(unix)
{
    let unix_timestamp = unix
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unix_timestamp * 1000);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}

function showAktuelleBH(akBH)
{
    console.log("[showAktuelle] anfang.");
    console.log(akBH);
    if(akBH.length ==0)
    {
        let leereAbfahrt = [];
        leereAbfahrt.push("keine");
        leereAbfahrt.push("Abfahrt in den nächsten 5 Minuten");

    }
    else
    {
        for(const element of akBH){
            let abfahrtPackage = [];
            abfahrtPackage.push(element.linienid);
            abfahrtPackage.push(element.richtungstext);
            abfahrtPackage.push(unixINTOdate(element.tatsaechliche_abfahrtszeit));
            arrayAktuelleBH.push(abfahrtPackage);
        }
    }
    console.log("[showAktuelle] fertig.");


}

