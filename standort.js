"use strict"

var stand_lat;      //globale lat Koordinate
var stand_lon;      //globale lon Koordinate
/**
 * bei Klick auf den "Standort abfragen" Button, wird die Funktion "getLocation" ausgeführt und der Standort des Browsers abgefragt
 */
 document.getElementById("button_standort").addEventListener("click", ()=> getLocation());


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
    stand_lat = position.coords.latitude;
    stand_lon = position.coords.longitude;
    console.log("[Standort] eingetragen");
    //printMap(stand_lat, stand_lon);
  }