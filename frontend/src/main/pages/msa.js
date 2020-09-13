import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MapControl, GeoJSON, Map, Popup, TileLayer } from 'react-leaflet';
import { Control, DomUtil } from 'leaflet';
import Legend from '../components/legend';
import Sidebar from '../components/sidebar';
import CONFIG from '../../shared/config';
import styles from '../../shared/colors.scss';

const Msa = () => {

  const [geojson, setGeoJSON] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    axios.get(`${CONFIG.API_BASE}/v1/groups/geojson`).then((response) => {
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
          fillColor: styles.lowRiskColor,
        };
        break;
      case 'MEDIUM':
        style = {
          ...style,
          fillColor: styles.mediumRiskColor,
        };
        break;
      case 'MEDIUM_HIGH':
        style = {
          ...style,
          fillColor: styles.mediumHighRiskColor,
        };
        break;
      case 'HIGH':
        style = {
          ...style,
          fillColor: styles.highRiskColor,
        };
        break;
      default:
        style = {
          ...style,
          fillColor: styles.unknownRiskColor,
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
      <>
        <Map
          id="msa"
          center={[49, -123]}
          zoom={9}
        >
          <GeoJSON data={geojson} onEachFeature={onEachFeature.bind(null, this)} style={getStyle}>

            {selectedFeature && (<Popup maxWidth="400">
                <h2>Feature {selectedFeature.properties.precipgrp} Details</h2>
                {selectedFeature.properties.link &&
                <a className={`weatherLink`} target='_' href={selectedFeature.properties.link}>Weather Report</a>}
                <table className={'riskTable'}>
                  <thead>
                  <tr>
                    <th>Date</th>
                    <th>24-hr precipitation (mm)</th>
                    <th>72-hr precipitation (mm)</th>
                    <th>Runoff risk rating</th>
                    <th>ARM Worksheet</th>
                  </tr>
                  </thead>
                  <tbody>
                  {[0, 1, 2, 3, 4].map((v) => {
                      const s = selectedFeature.properties.forecasts.statistics[v];
                      const formatted24 = formatNumeric(s.next24);
                      const formatted72 = formatNumeric(s.next72);
                      const worksheetLink = `https://arm-web-agri-nmp-prod.pathfinder.gov.bc.ca/?24=${formatted24}&72=${formatted72}`;
                      return (
                        <tr>
                          <td>{formatDate(new Date(s.associatedForecast.dt))}</td>
                          <td>{formatNumeric(s.next24)}</td>
                          <td>{formatNumeric(s.next72)}</td>
                          <td className={`risk-${s.runoffRisk}`}>
                            {s.runoffRisk}
                          </td>
                          <td>
                            {v in [0, 1] && <a target="_" href={worksheetLink}>
                              Field Risk Assessment
                            </a>
                            }
                          </td>
                        </tr>
                      );
                    }
                  )}
                  </tbody>
                </table>
              </Popup>
            )
            }
          </GeoJSON>

          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Legend />

        </Map>
        <Sidebar />
      </>
    );
  }
  return <p>loading</p>;
};

export default Msa;
