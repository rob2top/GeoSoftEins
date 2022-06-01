

"use strict"
var cityDistance = []; //Array für Distanz Geo1-Städte







/**
 * bei Klick auf den "aufgabe1" Button wird die Funktion "uebung1" ausgeführt und somit das ergebnis der letzten Übung aufgerufen
 */
document.getElementById("button_aufgabe1").addEventListener("click", ()=> uebung1());






/**
 * Berechnet die distanzen zwischen dem GEO1 Gebäude und verschiedenen Städten auf der Welt (in Kilometer)
 * führt die erste Übung aus, indem sie die globalen lat / lon Variablen mit den Koordinaten aus der point.js datei übernimmt und dann 
 *  "fuelleArray" und "sortiere" ausführt welche das CityDistance Array füllen und sortieren. 
 */
function uebung1()
{
    stand_lat = point[0];
    stand_lon = point[1];
    let header = "<TR><TH colspan = 2> Distanz zum GEO1 in Kilometern</TH></TR><TR><TH> Distanz</TH><TH>Stadt</TH></TR>";
    fuelleArray(point, cities, cityDistance, "Kilometer"); // füllt das Array "cityDistance" mit den Distanzen der Städte zu Münster
    sortiere(cityDistance); //sortiert das Array mit einer selectionSort Methode, sodass die geringste Strecke vorne steht
    document.getElementById("whereTheMagicHappens").innerHTML = makeTableHTML(cityDistance, header, 2); // Bringt das Ergebnis als Tabelle in den <DIV> bereich ins HTML Dokument

}








/**
 * Füllt das Zielarray mit der Distanz von dem Ausgangspunkt zu allen Zielpunkten mit Namen 
 * @param {Array[][]} home Ausgangs / Startpunkt - Koordinaten im Array 
 * @param {Array[][][]} destination Array mit Liste aller Zielpunkte [[lat,lon],"name"]
 * @param {Array} result ergebnisArray, in welches die Distanz und der name gespeichert werden sollen
 * @param {string} einheit "Meter" oder "Kilometer" entscheidet ob distanz in Metern oder Kilometern ausgegeben werden soll 
 * @returns ergebnisArray "result"
 */
function fuelleArray(home, destination, result, einheit) 
{
    if(einheit == "Kilometer"){
        for (let i = 0; i < destination.length; i++) // schleife läuft durch, alle Koordinaten aus "cities.js" mit "point.js" geschnitten wurden
        {
            const coordinatePackage= [] // erstellt ein leeres Array, in dem die Distanz und der Stadtname als "Päckchen" gespeichert werden sollen
            coordinatePackage.push(inKiloMeter(distance(home[0], home[1], destination[i][0][0], destination[i][0][1])));  // führt die Distanzberechnung durch und speichert die Distanz direkt in dem Array
            coordinatePackage.push(destination[i][1]);  //Speichert den Namen der Stadt als zweites Element in das "Päckchen"-Array      
            result.push(coordinatePackage);     //Speichert das "Päckchen"-Array als ein Element in das Gesamt Array, um die Distanz und den Stadtnamen beisammen abrufen zu können
        }
    }
    if(einheit == "Meter"){
        for (let i = 0; i < destination.length; i++) // schleife läuft durch, alle Koordinaten aus "cities.js" mit "point.js" geschnitten wurden
        {
            const coordinatePackage= [] // erstellt ein leeres Array, in dem die Distanz und der Stadtname als "Päckchen" gespeichert werden sollen
            coordinatePackage.push(distance(home[0], home[1], destination[i][0][0], destination[i][0][1]));  // führt die Distanzberechnung durch und speichert die Distanz direkt in dem Array
            coordinatePackage.push(destination[i][1]);  //Speichert den Namen der Stadt als zweites Element in das "Päckchen"-Array      
            result.push(coordinatePackage);     //Speichert das "Päckchen"-Array als ein Element in das Gesamt Array, um die Distanz und den Stadtnamen beisammen abrufen zu können
        }
    }
return result;
}

/**
 * Sortiert das eingabeArray aufsteigend mit einem Selection Sort verfahren 
 * @param {Array} myArray Array [number, String]
 * @returns sortiertes Array
 */
function sortiere(myArray) //selectionSort, Sortiert das Array nach dem SelectionSort verfahren , SelectionSort ist nur nötig, da die array.sort function nicht funktioniert, aufgrund der ergänzten Städtenamen in der cities.js
{
    let n = myArray.length;  //Iterationsvariable = die Länge des Arrays
    for(let i = 0; i < n ; i++)
    {

       let min = i;         //variable speichert den kleinsten gefundenen Wert
       for(let j = i+1; j < n; j++)
       {
           if(myArray[j][0] < myArray[min][0]) //prüft ob die aktuelle Distanz kleiner ist als das aktuelle Minimum
           {
               min = j; //setzt das aktuelle Minimum auf die aktuelle Distanz 
           }
       }
       if(min!= i)      //wenn die kleinste Zahl nicht die aktuelle und vorne stehende ist, wird die aktuelle Zahl mit der niedrigsten getauscht
       {
           let tmp = myArray[i];           //aktuelle Distanz wird zwischengespeichert
           myArray[i] = myArray[min];      //aktuelle Distanz wird mit niedrigster Distanz ersetzt
           myArray[min] = tmp;              //minimale Distanz wird mit aktueller Distanz ersetzt --> im endeffekt wird ei minimale distanz nach vorne durch getauscht
       }
    }
    return myArray;     //sortiertes Array wird ausgegeben
}

/**
 * erstellt aus einem Array eine HTML Tabelle, die alle Werte des Arrays in eigene Zellen der Tabelle steckt
 * @param {Array} myArray Array [number, String]
 * @param ueberschrift string um die überschriftzeile der Tabelle zu definieren
 * @param spalten gibt die anzahl an spalten an die geprintet werden sollen 
 * @returns HTML Tabelle mit Array als Inhalt
 */
function makeTableHTML(myArray, ueberschrift,spalten) {    //nimmt ein Array als Parameter entgegen und trägt die einzelnen Array Elemente als einzelne Zellen in eine HTML Tabelle ein
var result = "\n <table border=1> ";    // definiere zunächst eine Variable, welche am ende den ganzen Code für die zu erstellende Tabelle enthält
result += ueberschrift;
for(var i=0; i<myArray.length; i++) {       //schleife iteriert durch die länge des Arrays
    result += "<tr>";                       // bei jedem Schleifendurchlauf wird eine neue Zeile der Tabelle in das  Ergebnis geschrieben
    for(var j=0; j<spalten; j++){ //Innerere Schleife iteriert ebenso über die ersten beiden Elemente jeden inneren Arrays
        result += "<td>"+myArray[i][j]+"</td>";    //Bei jedem inneren Schleifendurchlauf wird für jedes "innere" Arrayelement eine Zelle der Tabelle beschrieben in den Resulsstring
    }
    result += "</tr>";                      
}
result += "</table> ";

return result;      //fertige Tabelle wird als string zurückgegeben
}


/**
 * erstellt aus einem Array eine HTML Tabelle, die alle Werte des Arrays in eigene Zellen der Tabelle steckt
 * @param {Array} myArray Array [number, String]
 * @returns HTML Tabelle mit Array als Inhalt
 *
 function makeTableHTML(myArray, ueberschrift) {    //nimmt ein Array als Parameter entgegen und trägt die einzelnen Array Elemente als einzelne Zellen in eine HTML Tabelle ein
    var result = "\n <table border=1> ";    // definiere zunächst eine Variable, welche am ende den ganzen Code für die zu erstellende Tabelle enthält
    result += ueberschrift;
    for(var i=0; i<myArray.length; i++) {       //schleife iteriert durch die länge des Arrays
        result += "<tr>";                       // bei jedem Schleifendurchlauf wird eine neue Zeile der Tabelle in das  Ergebnis geschrieben
        for(var j=0; j<myArray[i].length; j++){ //Innerere Schleife iteriert ebenso über die länge des Arrays
            result += "<td>"+myArray[i][j]+"</td>";    //Bei jedem inneren Schleifendurchlauf wird für jedes "innere" Arrayelement eine Zelle der Tabelle beschrieben in den Resulsstring
        }
        result += "</tr>";                      
    }
    result += "</table> ";
    
    return result;      //fertige Tabelle wird als string zurückgegeben
    }
    **/