import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GeocoderResponse } from '../models/geocoder_response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  //This service will take care of all geocoding requirements
  constructor(private http: HttpClient) { }

  // Take coordinates and returns address
  geocodeLatLng(location: google.maps.LatLngLiteral): Promise<GeocoderResponse> {
    let geocoder = new google.maps.Geocoder();

    return new Promise((resolve, reject) => {
      geocoder.geocode({ 'location': location }, (results, status) => {
        const response = new GeocoderResponse(status, results??undefined);
        resolve(response);
      });
    });
  }

  // Takes a typed address and return coordinates
  getLocation(term: string): Observable<GeocoderResponse> {
    const url = `https://maps.google.com/maps/api/geocode/json?address=${term}&sensor=false&key=${environment.googleApiKey}`;
    return this.http.get<GeocoderResponse>(url);
  }
}
