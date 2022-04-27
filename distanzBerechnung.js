

var cityDistance = [];
var poiDistance = [];
var pointsOf = [];
var x_lat = document.getElementById("text_lat");
var x_lon = document.getElementById("text_lon");
var stand_lat;
var stand_lon;
var x_geoJSON = document.getElementById("eingabe_geoJSON");
var x_berechne = document.getElementById("button_berechne");

//leseGEOJSON();
//getLocation();
//fuelleArray(point, pointsOf, poiDistance);
//sortiere(poiDistance);

//document.body.innerHTML = document.body.innerHTML + makeTableHTML(poiDistance); // Bringt das Ergebnis als Tabelle ins HTML Dokument


document.getElementById("button_berechne").addEventListener("click", () => {
    stand_lat = x_lat.value;
    stand_lon = x_lon.value;
    uebung2([x_lat, x_lon])
});
document.getElementById("button_standort").addEventListener("click", ()=> getLocation());

document.getElementById("button_berechne_geoJSON").addEventListener("click", () => textfeldParse());

document.getElementById("button_clear").addEventListener("click", ()=>{
    
    document.getElementById("text_lat").value = "";
    document.getElementById("text_lon").value = "";
    document.getElementById("eingabe_geoJSON").value = "";
    document.getElementById("whereTheMagicHappens").innerHTML = "";
});

document.getElementById("button_aufgabe1").addEventListener("click", ()=> uebung1());

document.getElementById("button_titel").addEventListener("click", ()=> document.title = document.getElementById("eingabe_geoJSON").value);

document.getElementById("button_author").addEventListener("click", ()=>{
  const meta1 = document.createElement("meta");
    meta1.setAttribute("name", "author");
    meta1.setAttribute("content", document.getElementById("eingabe_geoJSON").value);
});

document.getElementById("button_description").addEventListener("click", ()=>{
    const meta1 = document.createElement("meta");
      meta1.setAttribute("name", "description");
      meta1.setAttribute("content", document.getElementById("eingabe_geoJSON").value);
});



function uebung1()
{
    stand_lat = point[0];
    stand_lon = point[1];
    fuelleArray(point, cities, cityDistance); // füllt das Array "cityDistance" mit den Distanzen der Städte zu Münster
    sortiere(cityDistance); //sortiert das Array mit einer selectionSort Methode, sodass die geringste Strecke vorne steht
    document.getElementById("whereTheMagicHappens").innerHTML = makeTableHTML(cityDistance); // Bringt das Ergebnis als Tabelle ins HTML Dokument

}

function uebung2()
{
    leseGEOJSON();
    const standpunkt =[];
    standpunkt.push(stand_lon);
    standpunkt.push(stand_lat);
    fuelleArray(standpunkt, pointsOf, poiDistance);
    sortiere(poiDistance);
    //document.body.innerHTML = document.body.innerHTML + makeTableHTML(poiDistance); // Bringt das Ergebnis als Tabelle ins HTML Dokument
    document.getElementById("whereTheMagicHappens").innerHTML = makeTableHTML(poiDistance); // Bringt das Ergebnis als Tabelle ins HTML Dokument


}

function textfeldParse()
{
    const string_geoJSON = document.getElementById("eingabe_geoJSON").value;
    const object_geoJSON = JSON.parse(string_geoJSON); 
    
    stand_lon = object_geoJSON.geometry.coordinates[0];
    stand_lat = object_geoJSON.geometry.coordinates[1];
    uebung2();

}

function leseGEOJSON ()
{
    poi.features.forEach((item) =>
    {
        const packagePOI =[];
        const packCoordinates = [];
        packCoordinates.push(item.geometry.coordinates[0]);
        packCoordinates.push(item.geometry.coordinates[1]);
        packagePOI.push(packCoordinates);
        packagePOI.push(item.properties.name);
        pointsOf.push(packagePOI);

    })
}

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


function fuelleArray(home, destination, result) 
{
    for (let i = 0; i < destination.length; i++) // schleife läuft durch, alle Koordinaten aus "cities.js" mit "point.js" geschnitten wurden
    {
        const cityPackage= []
        cityPackage.push(distance(home[0], home[1], destination[i][0][0], destination[i][0][1]));
        cityPackage.push(destination[i][1]);        
        result.push(cityPackage);
    }
return result;
}


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



function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x_lat.value = "Geolocation is not ";
    x_lon.value = "supported by this browser.";
  }
}

function showPosition(position) {
  x_lat.value = position.coords.latitude;
  x_lon.value = position.coords.longitude;
}