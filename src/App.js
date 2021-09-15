import React, { useRef, useEffect, useState } from 'react';
import 'antd/dist/antd.css'
import { Card } from 'antd';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import jawaTimurGeoJson from './data/jawa-timur.geojson'

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hvY29vcmVvIiwiYSI6ImNrdDgxZG5ibzB4dGkycGxqZmU0YnNuMzEifQ.smJZQqkcsSI_Su9WCxbQvQ'

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(112.9277);
  const [lat, setLat] = useState(-7.7432);
  const [zoom, setZoom] = useState(7.7);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
    container: mapContainer.current,
    style: 'mapbox://styles/mapbox/light-v10',
    center: [lng, lat],
    zoom: zoom
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
    setLng(map.current.getCenter().lng.toFixed(4));
    setLat(map.current.getCenter().lat.toFixed(4));
    setZoom(map.current.getZoom().toFixed(2));
    });
  });
  //polygon
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('load', () => {
      map.current.addSource('jatim', {
        'type': 'geojson',
        'data': jawaTimurGeoJson
      });
      map.current.addLayer({
        'id': 'outline-cities',
        'type': 'line',
        'source': 'jatim',
        'layout': {},
        'paint': {
        'line-color': '#000',
        'line-width': 0.5
        }
      });
      map.current.addLayer({
        'id': 'fill-cities',
        'type': 'fill',
        'source': 'jatim', // reference the data source
        'layout': {},
        'paint': {
          'fill-color': 'red', // red color fill
          'fill-opacity': 0.1
        },
      });
    });
  });

  return (
  <div>
    <div className="sidebar">
      Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
    </div>
    <Card bordered={true}>
      <div ref={mapContainer} className="map-container" />
    </Card>
  </div>
  );
};