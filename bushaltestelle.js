class Bushaltestelle{
    constructor(lon, lat, name, richtung, ID){
        this.lon = lon;
        this.lat = lat;
        this.name = name;
        this.richtung = richtung;
        this.ID = ID;
    }
    distanceBushalte(stand_lon, stand_lat){
        return distance(this.lon, this.lat, stand_lon , stand_lat)
    }


}