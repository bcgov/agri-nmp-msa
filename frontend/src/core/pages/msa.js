import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GeoJSON, Map, Popup, TileLayer } from 'react-leaflet';
import { useHistory } from 'react-router';

const Msa = () => {

  const history = useHistory();
  const { t } = useTranslation();

  const zoom = useState(13);

  const [geojson, setGeoJSON] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/v1/groups/geojson').then((response) => {
      setGeoJSON(response.data);
      setLoaded(true);
    });
  }, []);

  const getStyle = (feature) => {

    const firstDay = feature.properties.forecasts.statistics[0].runoffRisk;

    let style = {
      weight: 1,
      opacity: 0.3,
      fillOpacity: 0.7,
      color: 'white',
    };

    switch (firstDay) {
      case 'LOW':
        style = {
          ...style,
          fillColor: 'green',
        };
        break;
      case 'MEDIUM':
        style = {
          ...style,
          fillColor: 'yellow',
        };
        break;
      case 'MEDIUM_HIGH':
        style = {
          ...style,
          fillColor: 'orange',
        };
        break;
      case 'HIGH':
        style = {
          ...style,
          fillColor: 'red',
        };
        break;
      default:
        style = {
          ...style,
          fillColor: 'blue',
        };
    }

    return style;
  };


  function onEachFeature(component, feature, layer) {
    layer.on({
      click: () => {
        setSelectedFeature(feature);
      },
    });
  }

  const formatDate = (v) => (v.toLocaleDateString());
  const formatNumeric = (v) => (v.toFixed(2));

  if (loaded) {
    return (

      <Map
        id="msa"
        center={[49, -123]}
        zoom={9}
      >
        <GeoJSON data={geojson} onEachFeature={onEachFeature.bind(null, this)} style={getStyle}>

          {selectedFeature && <Popup>
            <h2>Feature {selectedFeature.properties.precipgrp} Details</h2>
            <table>
              <thead>
              <tr>
                <th>Date</th>
                <th>24-hr precipitation (mm)</th>
                <th>72-hr precipitation (mm)</th>
                <th>Runoff risk rating</th>
              </tr>
              </thead>
              <tbody>
              {[0, 1, 2, 3, 4].map((v) => (
                  <tr>
                    <td>{formatDate(new Date(selectedFeature.properties.forecasts.statistics[v].associatedForecast.dt))}</td>
                    <td>{formatNumeric(selectedFeature.properties.forecasts.statistics[v].next24)}</td>
                    <td>{formatNumeric(selectedFeature.properties.forecasts.statistics[v].next72)}</td>
                    <td>{selectedFeature.properties.forecasts.statistics[v].runoffRisk}</td>
                  </tr>
                )
              )}
              </tbody>
            </table>
          </Popup>
          }
        </GeoJSON>

        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </Map>
    );
  }
  return <p>loading</p>;
};

export default Msa;
