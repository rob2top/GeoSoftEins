"use strict"

/**
 * berechnet die Distanz zwischen zwei Punkten und rechnet die Distanz am ende von Meter in Kilometer um
 * @param {number} lon1 longitude von Punkt 1
 * @param {number} lat1 latitude von Punkt 1
 * @param {number} lon2 longitude von Punkt 2
 * @param {number} lat2 latitude von Punkt 2
 * @returns Distanz Meter zwischen Punkt 1 und 2 (Großkreisdistanz)
 */
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
 
     const d = R * c ; 
       
     return d;  // die Distanz in Kilometern wird ausgeben
 }  
 
 function inKiloMeter(distanz){
     return distanz /1000;
 }