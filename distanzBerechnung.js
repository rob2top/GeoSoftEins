

var cityDistance = []; //Array für Distanz Geo1-Städte
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
 * bei Klick auf den "aufgabe1" Button wird die Funktion "uebung1" ausgeführt und somit das ergebnis der letzten Übung aufgerufen
 */
document.getElementById("button_aufgabe1").addEventListener("click", ()=> uebung1());

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
 * Berechnet die distanzen zwischen dem GEO1 Gebäude und verschiedenen Städten auf der Welt (in Kilometer)
 * führt die erste Übung aus, indem sie die globalen lat / lon Variablen mit den Koordinaten aus der point.js datei übernimmt und dann 
 *  "fuelleArray" und "sortiere" ausführt welche das CityDistance Array füllen und sortieren. 
 */
function uebung1()
{
    stand_lat = point[0];
    stand_lon = point[1];
    fuelleArray(point, cities, cityDistance); // füllt das Array "cityDistance" mit den Distanzen der Städte zu Münster
    sortiere(cityDistance); //sortiert das Array mit einer selectionSort Methode, sodass die geringste Strecke vorne steht
    document.getElementById("whereTheMagicHappens").innerHTML = makeTableHTML(cityDistance); // Bringt das Ergebnis als Tabelle in den <DIV> bereich ins HTML Dokument

}

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
    fuelleArray(standpunkt, pointsOf, poiDistance);
    sortiere(poiDistance);
    document.getElementById("whereTheMagicHappens").innerHTML = makeTableHTML(poiDistance); // Bringt das Ergebnis als Tabelle ins HTML Dokument


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
}


/**
 * berechnet die Distanz zwischen zwei Punkten und rechnet die Distanz am ende von Meter in Kilometer um
 * @param {number} lon1 longitude von Punkt 1
 * @param {number} lat1 latitude von Punkt 1
 * @param {number} lon2 longitude von Punkt 2
 * @param {number} lat2 latitude von Punkt 2
 * @returns Distanz in Kilometer zwischen Punkt 1 und 2 (Großkreisdistanz)
 */
function distance(lon1, lat1, lon2, lat2) // berechnet die Distanz zwischen einer Koordinate zu einer Anderen 
{
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1)* Math.PI/180;
    const Δλ = (lon2-lon1)* Math.PI/180;

    const a =  Math.sin(Δφ/2) * Math.sin(Δφ/2) +
               Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c /1000; // schreibt die Distanz in Metern auf Kilometer um
      
    return d;
}  

/**
 * Füllt das Zielarray mit der Distanz von dem Ausgangspunkt zu allen Zielpunkten mit Namen 
 * @param {Array[][]} home Ausgangs / Startpunkt - Koordinaten im Array 
 * @param {Array[][][]} destination Array mit Liste aller Zielpunkte [[lat,lon],"name"]
 * @param {Array} result ergebnisArray, in welches die Distanz und der name gespeichert werden sollen
 * @returns ergebnisArray "result"
 */
function fuelleArray(home, destination, result) 
{
    for (let i = 0; i < destination.length; i++) // schleife läuft durch, alle Koordinaten aus "cities.js" mit "point.js" geschnitten wurden
    {
        const coordinatePackage= []
        coordinatePackage.push(distance(home[0], home[1], destination[i][0][0], destination[i][0][1]));
        coordinatePackage.push(destination[i][1]);        
        result.push(coordinatePackage);
    }
return result;
}

/**
 * Sortiert das eingabeArray aufsteigend mit einem Selection Sort verfahren 
 * @param {Array} myArray Array [number, String]
 * @returns sortiertes Array
 */
function sortiere(myArray) //selectionSort
{
    let n = myArray.length;
    for(let i = 0; i < n ; i++)
    {

       let min = i;
       for(let j = i+1; j < n; j++)
       {
           if(myArray[j][0] < myArray[min][0])
           {
               min = j;
           }
       }
       if(min!= i)
       {
           let tmp = myArray[i];
           myArray[i] = myArray[min];
           myArray[min] = tmp;
       }
    }
    return myArray;
}

/**
 * erstellt aus einem Array eine HTML Tabelle, die alle Werte des Arrays in eigene Zellen der Tabelle steckt
 * @param {Array} myArray Array [number, String]
 * @returns HTML Tabelle mit Array als Inhalt
 */
function makeTableHTML(myArray) {
var result = "\n <table border=1> ";
result += "<tr> <th> Distanz (in Kilometer) </th><th> Vergleichspunkt</th> </tr> <tr> <th>dein Standpunkt:</th><th>"+stand_lat+" , "+stand_lon+"</th></tr>";
for(var i=0; i<myArray.length; i++) {
    result += "<tr>";
    for(var j=0; j<myArray[i].length; j++){
        result += "<td>"+myArray[i][j]+"</td>";
    }
    result += "</tr>";
}
result += "</table> ";

return result;
}


/**
 * fragt die Position des Browsers ab, prüft ob der Browser dies zulässt, gibt sonst default Wert an.
 * Wenn erlaubt, gibt er Position aus und weiter an shoPosition(), welche die Koordinaten in die Textfelder schreibt.
 */
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x_lat.value = "Geolocation is not "; //falls nicht erlaubt, alternativtext um exception zu fangen 
    x_lon.value = "supported by this browser.";
  }
}

/**
 * schreibt die Koordinaten des Browsers in die "globalen lat/lon" Variablen und damit in die Textfelder
 * @param {*} position 
 */
function showPosition(position) {
  x_lat.value = position.coords.latitude;
  x_lon.value = position.coords.longitude;
}