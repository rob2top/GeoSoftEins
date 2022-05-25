"use strict"
var bushalteFetch = [];
var map = L.map('map').setView([51.9694511, 7.5955581], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


var standort_marker ;
var rec; // variable für das gezeichnete rechteck
var pt; // variable für den turf.point
var poly;    // variable für den Turf.polygon
var markerArray = [];   // Array, in dem alle Marker gespeichert werden, damit sie auch wieder einzeln gelöscht /removed werden können


/**
 * 
 * Funktion erstellt alle Marker auf der Karte.
 * prüft ob bereits marker vorhanden, löscht ggf.
 * 
 * @param {Koordinate} lat 
 * @param {Koordinate} lon 
 */
function printMap(lat, lon) {

    if(standort_marker){
        standort_marker.remove();
    }
    
    /**
     * Icon für die Haltestellen wird definiert
    */
    let haltestellenIcon = L.icon(
        {
            iconUrl: "icon_bushalte.png",
            iconSize:[20, 20],
            iconAnchor:[10,10],
            popupAnchor:[0,-10]
        }
    );

    /**
     * Icon für Standort wrid definiert
     */
    let standortIcon = L.icon(
        {
        iconUrl: "icon_standort.png",
        iconSize:[30, 30],
        iconAnchor:[15,15],
        popupAnchor:[0,-15]
    }
);

    /**
     * erstellt den Marker des eigenen Standorts
     */
   standort_marker=  L.marker([lat, lon], {icon: standortIcon, zIndexOffset: 10}).addTo(map)
                 .bindPopup('du befindest dich Hier')
                 .openPopup(); 
                 
    /**
     * For Each Schleife, iteriert durch alle Bushaltestellen, und erstellt für jede einen Marker
     */
    bushalteFetch.forEach(element => {
                      
        markerArray.push(L.marker([element.geometry.coordinates[1], element.geometry.coordinates[0]], {icon: haltestellenIcon, zIndexOffset: -10}).addTo(map)
        .bindPopup('Haltestelle: '+element.properties.lbez +' <BR> in Richtung: '+ element.properties.richtung +'<BR> <BR> Entfernung zum Standort: '+ Math.round(distance(element.geometry.coordinates[0], element.geometry.coordinates[1],lon, lat))+' Meter <BR><BR>'));
        
    });

}

/**
 * tba
 */
function aktuelleBushalteMarker(){
    bushalteFetch.forEach(element => {
         let abfahrtArray =[];
          fetch("https://rest.busradar.conterra.de/prod/haltestellen/"+element.properties.nr+"/abfahrten?sekunden=300")
              .then(response => {
                  let res = response.json() // return a Promise as a result
                  console.log(res)
                  res.then(data => { // get the data in the promise result
                      console.log(data)
                      abfahrtArray = data.features;
                  })
              })
              .catch(error => console.log(error))

              let tabelleAbfahrtArray = [];

              abfahrtArray.forEach( item =>{
                 let abfahrtPackage = [];
                 abfahrtPackage.push(item.linienid);
                 abfahrtPackage.push(item.richtungstext);
                 abfahrtPackage.push(unixINTOdate(item.tatsaechliche_abfahrtszeit));
                 tabelleAbfahrtArray.push(abfahrtPackage)
             })

              let tabelle = "<table>";
              let headerBH = "<TR> <TH> Linie </TH><TH> Richtung </TH> <TH> Abfahrt um</TH></TR>"; // zweite Überschrift 
              tabelle += "<TR><TD colspan = 3>"+ makeTableHTML(tabelleAbfahrtArray, headerBH ,3)+"</TD></TR>"; //erzeugt Tabelle mit Abfahrtzeiten
              tabelle += "</table>";
              tabelleAbfahrt = tabelle;


            
           markerArray.push(L.marker([element.geometry.coordinates[1], element.geometry.coordinates[0]], {icon: haltestellenIcon, zIndexOffset: -10}).addTo(map)
         .bindPopup('Haltestelle: '+element.properties.lbez +' <BR> in Richtung: '+ element.properties.richtung +'<BR> <BR> Entfernung zum Standort: '+ Math.round(distance(element.geometry.coordinates[0], element.geometry.coordinates[1],lon, lat))+' Meter <BR><BR>'+tabelleAbfahrt));

});
}

/**
 * Lädt alle Bushaltestellen aus der Conterra API über die fetch API, speichert diese in einem Array
 */
function loadBushaltestelenFetch() {
    fetch("https://rest.busradar.conterra.de/prod/haltestellen")
            .then(response => {
                let res = response.json() // return a Promise as a result
                console.log(res)
                res.then(data => { // get the data in the promise result
                    console.log(data)
                    bushalteFetch = data.features;
                })
            })
            .catch(error => console.log(error))
            console.log("[Fetchload] fertig");
            console.log(bushalteFetch);
}

loadBushaltestelenFetch();

/**
 * Erstellt die Toolbar für die Leaflet karte
 */
// FeatureGroup is to store editable layers
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({    
    draw: {
        marker:false,
        polygon: false,
        polyline: false,
        circle: false,
    },
    edit: {
        featureGroup: drawnItems,
        edit: false,
    }
});
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function (e) {
   
   rec = e.layer;
    map.addLayer(rec);

    let boundingBox = rec.getLatLngs();
    console.log(boundingBox);
 });

 map.on(L.Draw.Event.DRAWSTART, function (e){
     if(rec != null){
         map.removeLayer(rec);
     }
 })


 /**
  * Button um die Funktion zum löschen aller Marker außerhalb des polygons zu triggern
  */
 document.getElementById("button_isInBox").addEventListener("click", ()=> isInBox());
 
 /**
  * prüft Alle Marker mit der Turf.js API ob diese Marker in einem Polygon liegen. 
  */
 function isInBox(){

    let polyArray = rec.getLatLngs();
    //polyArray.push(rec.getLatLngs());
    console.log(rec.getLatLngs());
    console.log(polyArray);
    
    //erstellung des speziellen turf polygons (komische Struktur), erste und letzte Koordinate müssen gleich sein 
    poly = turf.polygon([
        [
            [polyArray[0][0].lat, polyArray[0][0].lng],
            [polyArray[0][1].lat, polyArray[0][1].lng],
            [polyArray[0][2].lat, polyArray[0][2].lng],
            [polyArray[0][3].lat, polyArray[0][3].lng],
            [polyArray[0][0].lat, polyArray[0][0].lng],
        ]
    ]);
    

    /**
     * Erstellt des speziellen turf punktes für jeden Marker um zu prüfen ob im polygon, prüft im anschluss direkt ob im Polygon, und removed dann ggf.
     */
    markerArray.forEach(element => {
        
        
        pt = element.getLatLng();
       

        if(turf.booleanPointInPolygon(turf.point([pt.lat,pt.lng]),poly)== false){
            map.removeLayer(element);
        }
    })
    pt = turf.point();
   


 }
 
 
 
