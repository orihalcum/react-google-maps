import React, { useEffect, useState } from 'react'
import { useGoogleMaps } from "react-hook-google-maps";
import Geocode from "react-geocode";

const REACT_APP_GMAP_API_KEY = process.env.REACT_APP_GMAP_API_KEY

Geocode.setApiKey(REACT_APP_GMAP_API_KEY);
Geocode.enableDebug();

let infoWindow;
let marker;

const App = () => {

  const [center] = useState({ lat: -6.229728, lng: 106.8271494 })
  const { ref, map, google } = useGoogleMaps(REACT_APP_GMAP_API_KEY, { center, zoom: 17 });

  const onDragEnd = async (e) => {
    if(infoWindow) infoWindow.close()
    let { latLng : { lat, lng } } = e
    let position = {
      lat: lat(),
      lng: lng(),
    }
    showInfoWindow(position)
    infoWindow.open(map, marker);
  }

  const showInfoWindow = ({ lat, lng }) => {
    Geocode.fromLatLng(lat, lng)
    .then(response => {
      if(infoWindow) infoWindow.close()
      infoWindow = new google.maps.InfoWindow({
        content: response.results[0].formatted_address || JSON.stringify({ lat, lng }),
      })
      infoWindow.open(map, marker);
    },error => {
      console.error(error);
    });    
  }

  useEffect(() => {
    if(
      typeof google !== 'undefined' && 
      typeof map !== 'undefined'
    ) {
      // Setting Marker Icon 
      const icon = {
        url: 'https://www.flaticon.com/svg/static/icons/svg/2642/2642502.svg',
        scaledSize: new google.maps.Size(40, 70),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(20, 55),
      }
      // Instance Marker
      marker = new google.maps.Marker({
        position: center,
        map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        title: 'Tarik untuk merubah lokasi',
        icon
      })
      // Setting Marker Listener
      marker.addListener("click", () => {
        showInfoWindow(center)
      });
      marker.addListener('dragend', onDragEnd)
      // Setting Info Window
      infoWindow = new google.maps.InfoWindow({
        content: JSON.stringify(center),
      })
    }
  }, [google, map, center])

  return <div ref={ref} style={{ width: '100%', height: '100vh' }} />

};

export default App;