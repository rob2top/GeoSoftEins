"use strict"
var arrayAlleBushaltestellen = []; //Array um alle Bushaltestellen - OBjekte abzuspeichern
var arrayBushalteDistanz =[]; //Array berechneter Distanz, Haltestellenname + richtung , ID
var arrayAktuelleBH = [];   // Array für die Abfahrtzeiten an der nähesten Bushaltestelle 
var headerBHList = "<TR> <TH> Distanz</TH> <TH> Haltestelle</TH></TR>"; //Kopfzeile für die Bushaltestellen Tabelle
var tabelleAbfahrt; // variable für die Abfahrtszeitentabelle
var tabelleBushalte;    // variable für die Bushaltestellentabelle

/**
 * Funktion, es ist notwendig zuerst den Standort über den Knopf "Standort abfragen" abzufragen, 
 * - dann die Bushaltestellen Objekte zu erzeugen ("Bushaltestellen abfragen")
 * - dann die Abfahrtszeiten Laden
 * - am ende den PRINT button drücken
 * Ein wenig zeit vergehen lassen zwischen den Knöpfen
 * 
 * Eventhandler für die Knöpfe Bushaltestellen laden, Abfahrtzeiten laden, und final zum Printen der Tabelle
*/
document.getElementById("button_bushalte").addEventListener("click", ()=> loadNearbyBushalte());
document.getElementById("button_abfahrten").addEventListener("click", ()=> loadAktuelleBH());
document.getElementById("button_bushalte_print").addEventListener("click", ()=>  document.getElementById("whereTheMagicHappens").innerHTML = printAufgabe3());

/**
 * führt die Übung 3 aus, 
 * Standpunkt wird aus den globalen koordinaten in ein Array gepackt um direkt weiter zu nutzen 
 
function uebung3()
{

    console.log("[Übung3] anfang.");
    const standpunkt =[];
    standpunkt.push(stand_lon);
    standpunkt.push(stand_lat);
    loadNearbyBushalte();
   // loadAktuelleBH();
    console.log("[Übung3] fertig.");

}*/


/**
 * führt printAbfahrten() aus führt Strings von Abfahrten und Haltestellen zusammen
 * @returns String der die ausgabe für die beiden Tabellen Speichert wird ausgegeben
 */
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


/**
 * Funktion lädt über XHR Protokoll die Bushaltestellen vom Busradar von Conterra gibt den String an die Show Funktion weiter
 */
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

/**
 * übernimmt das undifferenzierte Array an Objekten, erstellt neue Objekte der Klasse Bushaltestelle mit den Elementen aus dem übergebenem Array
 * For Schleife iteriert durch alle Elemente von nbbushalte, erzeugt bei jedem durchlauf ein Objekt von Bushaltestelle.js
 * - hängt alle Objekte an das Array "arrayAlleBushaltestellen"
 * - packt päckchen mit Distanz (berechnet aus methode der jedes Objektes), Name der Bushalte + Fahrtrichtung, und ID der Bushalte
 * - Packt das ganze Päckchen auf das Array "arrayBushalteDistanz"
 * @param {Array} nbbushalte 
 */
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

/**
 *  Baut den Ausgabestring für die Abfahrzeiten Tabelle zusammen 
 */
function printAbfahrten()
{
    console.log("[printAbfahrten] anfang.");
    let res = "<table border= 1 vertical-align=top>";
    res += "<TR><TH colspan = 3 >Bushaltestelle: "+arrayBushalteDistanz[0][1] +"</TH></TR>"; //erste Überschrift mit betreffender Bushaltestelle
    let headerBH = "<TR> <TH> Linie </TH><TH> Richtung </TH> <TH> Abfahrt um</TH></TR>"; // zweite Überschrift 
    res += "<TR><TD colspan = 3>"+ makeTableHTML(arrayAktuelleBH, headerBH ,3)+"</TD></TR>"; //erzeugt Tabelle mit Abfahrtzeiten
    res += "</table>";
    console.log("[printAbfahrten] fertig.");
    tabelleAbfahrt = res;
}

/**
 * Lädt die abfahrtszeiten der nähesten Haltestelle über das XHR Tool
 */
function loadAktuelleBH()
{
    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200)
        {
            let res = JSON.parse(this.responseText);
           if(res.length != 0){    //prüft ob Array Leer ist bevor es weitergegeben wird 
            showAktuelleBH(res);
           }
           console.log(res);
        }
    }
    xhttp.open("GET", "https://rest.busradar.conterra.de/prod/haltestellen/"+arrayBushalteDistanz[0][2]+"/abfahrten?sekunden=300", true); //get request modular mit oberstem Element des Bushaltestellen Arrays und da direkt die ID der BH
    xhttp.send();

}


/**
 * übersetzt den Unix Zeitstempel in ein Zeitstempel im Format HH:MM:SS
 * kopiert von Stackoverflow
 * @param unix Zeitstempel im unix format
 * @returns    Zeitstempel im HH:MM:SS Format
 */
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

/**
 * erstellt Array aus den geladenen Abfahrzeiten 
 * For Schleife: 
 * - Päckchen mit Liniennummer, Richtungsangabe , Abfahrtzeit
 * prüft vorher ob das übergebene Array leer ist 
 * @param {Array} akBH 
 */
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

