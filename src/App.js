import React, { useRef, useEffect, useState } from 'react';
import 'antd/dist/antd.css'
import { Card, Button } from 'antd';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import jawaTimurGeoJson from './data/jawa-timur.geojson'

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hvY29vcmVvIiwiYSI6ImNrdDgxZG5ibzB4dGkycGxqZmU0YnNuMzEifQ.smJZQqkcsSI_Su9WCxbQvQ'

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(112.9277);
  const [lat, setLat] = useState(-7.7432);
  const [zoom, setZoom] = useState(7.7);

  const [layerOutline, setLayerOutline] = useState(true)

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
      map.current.addLayer({
        'id': 'name-of-cities',
        'type': 'symbol',
        'source': 'jatim',
        'layout': {
          'text-field': [
            'format',
            ['upcase', ['get', 'name']],
            { 'font-scale': 0.7 },
          ],
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold']
          }
      });
      map.current.addLayer({
        'id': 'counties-highlighted',
        'type': 'fill',
        'source': 'jatim',
        // 'source-layer': 'original',
        'paint': {
        'fill-outline-color': '#484896',
        'fill-color': '#6e599f',
        'fill-opacity': 0.75
        },
        'filter': ['in', 'name', '']
      })
      map.current.on('click', (e) => {
        // Set `bbox` as 5px reactangle area around clicked point.
        const bbox = [
        [e.point.x - 5, e.point.y - 5],
        [e.point.x + 5, e.point.y + 5]
        ];
        // Find features intersecting the bounding box.
        const selectedFeatures = map.current.queryRenderedFeatures(bbox, {
        layers: ['fill-cities']
        });
        const name = selectedFeatures.map(
        (feature) => feature.properties.name
        );
        // Set a filter matching selected features by FIPS codes
        // to activate the 'counties-highlighted' layer.
        map.current.setFilter('counties-highlighted', ['in', 'name', ...name]);
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