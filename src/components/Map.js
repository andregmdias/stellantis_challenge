import React, { useEffect, useState, useCallback } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import uuid from 'react-uuid';
import env from 'react-dotenv';

const containerStyle = {
  width: '800px',
  height: '800px'
};

function Map() {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  if (!localStorage.getItem("markers")) {
    localStorage.setItem("markers", JSON.stringify([]))
  }

  const [markers, setMarkers] = useState(JSON.parse(localStorage.getItem("markers")));

  const createMarkersOnClick = (event) => {
    setMarkers((prevState) => (
      [...prevState, { lat: event.latLng.lat(), lng: event.latLng.lng() }]
    ))
  }

  const removeMarkerOnClick = ((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    setMarkers(
      markers.filter(
        (marker) => marker.lat !== lat && marker.lng !== lng
      )
    )
  })

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLat(position.coords.latitude);
      setLng(position.coords.longitude);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("markers", JSON.stringify(markers))
  }, [markers]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: env.MAPS_API_KEY
  });

  const [, setMap] = useState(null)

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  if (!isLoaded) return null;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat, lng }}
      zoom={18}
      onUnmount={onUnmount}
      onClick={createMarkersOnClick}
    >
      {
        markers.map((marker) =>
          <Marker
            key={uuid()}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={removeMarkerOnClick}
          />
        )
      }
      <></>
    </GoogleMap>
  )
}

export default Map