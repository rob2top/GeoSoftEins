"use strict"

var poiDistance = [];   //Array für Distanz beliebiger Punkt- PointOfInterest
var pointsOf = [];      //Array für PointsOfInterest nach extraktion aus geoJSON
var x_lat = document.getElementById("text_lat"); // Inhalt des longitude Textfeldes
var x_lon = document.getElementById("text_lon"); // Inhalt des latitude Textfeldes
var stand_lat;      //globale lat Koordinate
var stand_lon;      //globale lon Koordinate
var x_geoJSON = document.getElementById("eingabe_geoJSON"); //Inhalt des Textareas für geoJSON eingabe

/**
 * bei Klick auf den "Berechne" Button, werden die lat und lon Koordinaten für den Startpunkt aus dem Eingabefeld übernommen.
 * im Anschluss wird die Funktion "uebung2" ausgeführt 
 */
 document.getElementById("button_berechne").addEventListener("click", () => {
    stand_lat = x_lat.value;
    stand_lon = x_lon.value;
    uebung2();
});

/**
 * bei Klick auf den "Standort abfragen" Button, wird die Funktion "getLocation" ausgeführt und der Standort des Browsers abgefragt
 */
document.getElementById("button_standort").addEventListener("click", ()=> getLocation());

/**
 * bei Klick auf den "berechne geoJSON" Button wird die Funktion "textfeldParse" ausgeführt, bei dem die eingegebenen geoJSON Koordinaten eingelesen werden
 */
document.getElementById("button_berechne_geoJSON").addEventListener("click", () => textfeldParse());

/**
 * bei Klick auf den "clear all" Button werden alle Textfelder, sowie die Ergebnisse im unteren Feld mit leere überschrieben
 */
document.getElementById("button_clear").addEventListener("click", ()=>{
    
    document.getElementById("text_lat").value = "";
    document.getElementById("text_lon").value = "";
    document.getElementById("eingabe_geoJSON").value = "";
    document.getElementById("whereTheMagicHappens").innerHTML = "";
});

/**
 * bei Klick auf den "Seitentitel setzen" Button wird der Text aus dem Textfeld als Titel der Seite abgespeichert
 */
 document.getElementById("button_titel").addEventListener("click", ()=> document.title = document.getElementById("eingabe_geoJSON").value);

 /**
  * bei Klick auf den "Autor setzen" Button wird der Text aus dem Textfeld als Autor im Meta Tag des Dokuments gespeichert. 
  */
 document.getElementById("button_author").addEventListener("click", ()=>{
   const meta1 = document.createElement("meta");
     meta1.setAttribute("name", "author");
     meta1.setAttribute("content", document.getElementById("eingabe_geoJSON").value);
 });
 
 /**
  * bei Klick auf den "Autor setzen" Button wird der Text aus dem Textfeld als Autor im Meta Tag des Dokuments gespeichert. 
  */
 document.getElementById("button_description").addEventListener("click", ()=>{
     const meta2 = document.createElement("meta");
       meta2.setAttribute("name", "description");
       meta2.setAttribute("content", document.getElementById("eingabe_geoJSON").value);
 });





 /**
 * Berechnet die Übung 2 - also die distanzen von einem beliebigen Punkt zu einer Liste von Points of Interest in Münster (in Kilometer)
 * führt leseGEOJSON() aus.
 * erstellt ein temporäres Array um den beliebigen Standpunkt dort drin zu speichern (globale lat / lon)
 * führt fuelleArray() mit dem Standpunkt, dem Array der gelesenen geoJSON features und dem Zielarray poiDistance[] aus.
 * führt sortiere() aus und sortiert das Zielarray poiDistance aufsteigend
 * und printed das ergebnis als Tabelle in den Div bereich
 */
function uebung2()
{
    leseGEOJSON();
    const standpunkt =[];
    standpunkt.push(stand_lon);
    standpunkt.push(stand_lat);
    fuelleArray(standpunkt, pointsOf, poiDistance, "Meter");
    sortiere(poiDistance);
    let header = "<tr> <th colspan= 2>dein Standpunkt: lat. "+stand_lat+" , lon. "+stand_lon+"</th></tr> <tr> <th> Distanz (in Kilometer) </th><th> Vergleichspunkt</th> </tr> ";
    document.getElementById("whereTheMagicHappens").innerHTML = makeTableHTML(poiDistance, header, 2); // Bringt das Ergebnis als Tabelle ins HTML Dokument


}

/**
 * Funktion nimmt ein 'geoJSON' String aus dem Textfeld entgegen, speichert es zunächst in einem temporären String, 
 * welcher dann in ein geoJSON Objekt übersetzt wird aus dem die Koordinaten in die "globalen lat/lon" gespeichert werden 
 * dann wird die uebung2() ausgeführt 
 */
 function textfeldParse()
 {
     const string_geoJSON = document.getElementById("eingabe_geoJSON").value;
     const object_geoJSON = JSON.parse(string_geoJSON); 
     
     stand_lon = object_geoJSON.geometry.coordinates[0];
     stand_lat = object_geoJSON.geometry.coordinates[1];
     uebung2();
 
 }
 
 /**
  * Funktion liest eine geoJSON file ein und speichert Koordinaten aller Features mit den dazugehörigen Namen in ein Array
  * 
  */
 function leseGEOJSON ()
 {
     poi.features.forEach((item) => //forEach schleife iteriert durch alle Features der geoJSON
     {
         const packagePOI =[];       //temporäres Array um Koordinatenbündel und Name zu speichern
         const packCoordinates = []; //temporäres Array um Kooridnaten als Bündel zu speichern
         packCoordinates.push(item.geometry.coordinates[0]); 
         packCoordinates.push(item.geometry.coordinates[1]); //füllt das Koordinatenbündel Array mit Koordinaten aus der geoJSON
         packagePOI.push(packCoordinates);   
         packagePOI.push(item.properties.name); //füllt das Array mit Koordinatenbündel und Name
         pointsOf.push(packagePOI);              //füllt das Gesamtarray mit Koordinatenbündel und Name
     })
     console.log("[leseGEOJSON] geladen");
 }

 
 /**
 * fragt die Position des Browsers ab, prüft ob der Browser dies zulässt, gibt sonst default Wert an.
 * Wenn erlaubt, gibt er Position aus und weiter an shoPosition(), welche die Koordinaten in die Textfelder schreibt.
 */
 function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
      console.log("[Standort] gezogen");
    } else {
      x_lat.value = "Geolocation is not "; //falls nicht erlaubt, alternativtext um exception zu fangen 
      x_lon.value = "supported by this browser.";
      console.log("[Standort] errror]");
    }
  }
  
  /**
   * schreibt die Koordinaten des Browsers in die "globalen lat/lon" Variablen und damit in die Textfelder
   * @param {*} position 
   */
   function showPosition(position) {
    x_lat.value = position.coords.latitude;
    x_lon.value = position.coords.longitude;
    stand_lat = x_lat.value;
    stand_lon = x_lon.value;
    console.log("[Standort] eingetragen");
  }