

var cityDistance = [];
fuelleArray(); // füllt das Array "cityDistance" mit den Distanzen der Städte zu Münster
sortiere(); //sortiert das Array mit einer selectionSort Methode, sodass die geringste Strecke vorne steht
document.body.innerHTML = document.body.innerHTML + makeTableHTML(cityDistance); // Bringt das Ergebnis als Tabelle ins HTML Dokument


window.alert(cityDistance.join(" ; \n"));


function distance(lon1, lat1, lon2, lat2) // berechnet die Distanz zwischen einer Koordinate zu einer Anderen 
{
    const R = 6371e3; // Radius der Erde in Metern
    const φ1 = lat1 * Math.PI/180; // φ, λ in Radiant umgerechnet
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1)* Math.PI/180;    
    const Δλ = (lon2-lon1)* Math.PI/180;

    const a =  Math.sin(Δφ/2) * Math.sin(Δφ/2) +
               Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c /1000; // schreibt die Distanz in Metern auf Kilometer um
      
    return d;  // die Distanz in Kilometern wird ausgeben
}  


function fuelleArray() 
{
    for (let i = 0; i < cities.length; i++) // schleife läuft durch, bis alle Koordinaten aus "cities.js" mit "point.js" geschnitten wurden
    {
        const cityPackage= []   // erstellt ein leeres Array, in dem die Distanz und der Stadtname als "Päckchen" gespeichert werden sollen
        cityPackage.push(distance(point[1], point[0], cities[i][0][1], cities[i][0][0])); // führt die Distanzberechnung durch und speichert die Distanz direkt in dem Array
        cityPackage.push(cities[i][1]);     //Speichert den Namen der Stadt als zweites Element in das "Päckchen"-Array        
        cityDistance.push(cityPackage);     //Speichert das "Päckchen"-Array als ein Element in das Gesamt Array, um die Distanz und den Stadtnamen beisammen abrufen zu können
    }
} 

function sortiere() //Sortiert das Array nach dem SelectionSort verfahren
{
    let n = cityDistance.length;    //iterationsvariable = die länge des Arrays
    for(let i = 0; i < n ; i++)     
    {

       let min = i;
       for(let j = i+1; j < n; j++)
       {
           if(cityDistance[j][0] < cityDistance[min][0])
           {
               min = j;
           }
       }
       if(min!= i)
       {
           let tmp = cityDistance[i];
           cityDistance[i] = cityDistance[min];
           cityDistance[min] = tmp;
       }
    }
    return cityDistance;
}


function makeTableHTML(myArray)     //nimmt ein Array als Parameter entgegen und trägt die einzelnen Array Elemente als einzelne Zellen in eine HTML Tabelle ein
{
var result = "<table border=1> ";   // definiere zunächst eine Variable, welche am ende den ganzen Code für die zu erstellende Tabelle enthält
result += "<tr> <th> Distanz (in Kilometer) </th><th> Stadt</th> </tr>";    // variable wird mit der Kopfzeile der Tabelle gefüllt
for(var i=0; i<myArray.length; i++) {       //schleife iteriert durch die länge des Arrays
    result += "<tr>";                       // bei jedem Schleifendurchlauf wird eine neue Zeile der Tabelle in das  Ergebnis geschrieben
    for(var j=0; j<myArray[i].length; j++){         //Innerere Schleife iteriert ebenso über die länge des Arrays
        result += "<td>"+myArray[i][j]+"</td>";     //Bei jedem inneren Schleifendurchlauf wird für jedes "innere" Arrayelement eine Zelle der Tabelle beschrieben in den Resulsstring
    }
    result += "</tr>";                      
}
result += "</table>";

return result;      //fertige Tabelle wird als string zurückgegeben
}
