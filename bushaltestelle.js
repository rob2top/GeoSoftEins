/**
 * Klasse Bushaltestelle: 
 * übernimmt Koordinaten, Name, richtung, und ID aus den Downgeloadeten Daten
 * 
 */
class Bushaltestelle{
    constructor(lon, lat, name, richtung, ID){
        this.lon = lon;
        this.lat = lat;
        this.name = name;
        this.richtung = richtung;
        this.ID = ID;
    }

    /**
     * berechnet die Distanz der Bushaltestelle zum Standort des Benutzers 
     * @param {number} stand_lon 
     * @param {number} stand_lat 
     * @returns Distanz zwischen Koordinaten der Bushaltestelle und dem Standort des Nutzers 
     */
    distanceBushalte(stand_lon, stand_lat){
        return distance(this.lon, this.lat, stand_lon , stand_lat)
    }


}