

var cityDistance = [];
fuelleArray(); // füllt das Array "cityDistance" mit den Distanzen der Städte zu Münster
sortiere(); //sortiert das Array mit einer selectionSort Methode, sodass die geringste Strecke vorne steht
document.body.innerHTML = document.body.innerHTML + makeTableHTML(cityDistance); // Bringt das Ergebnis als Tabelle ins HTML Dokument


window.alert(cityDistance.join(" ; \n"));


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


function fuelleArray() 
{
    for (let i = 0; i < cities.length; i++) // schleife läuft durch, alle Koordinaten aus "cities.js" mit "point.js" geschnitten wurden
    {
        const cityPackage= []
        cityPackage.push(distance(point[1], point[0], cities[i][0][0], cities[i][0][1]));
        cityPackage.push(cities[i][1]);        
        cityDistance.push(cityPackage);
    }
} 

function sortiere() //selectionSort
{
    let n = cityDistance.length;
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


function makeTableHTML(myArray) {
var result = "<table border=1> ";
result += "<tr> <th> Distanz (in Kilometer) </th><th> Stadt</th> </tr>";
for(var i=0; i<myArray.length; i++) {
    result += "<tr>";
    for(var j=0; j<myArray[i].length; j++){
        result += "<td>"+myArray[i][j]+"</td>";
    }
    result += "</tr>";
}
result += "</table>";

return result;
}
