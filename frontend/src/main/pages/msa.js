import axios from 'axios';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { GeoJSON, Map, Popup, TileLayer, } from 'react-leaflet';
import styles from '../../shared/colors.scss';
import Loading from '../../shared/components/loading';
import CONFIG from '../../shared/config';
import Legend from '../components/legend';
import { PageCustomizationContext } from '../page';

const tileLayers = [
  {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    name: 'OpenStreetMap',
  },
];

const Msa = () => {
  const [geojson, setGeoJSON] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const pageCustomization = useContext(PageCustomizationContext);

  useEffect(() => {
    axios.get(`${CONFIG.API_BASE}/v1/groups/geojson`).then((response) => {
      setGeoJSON(response.data);
      setLoaded(true);
    });
  }, []);

  const [tileLayer, setTileLayer] = useState(tileLayers[0]);

  const getStyle = (feature) => {
    const firstDay = feature?.properties?.forecasts?.statistics[0]?.runoffRisk;

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

  const formatDate = (v) => (v.format('l'));
  const formatNumeric = (v) => (Math.round(v));

  const riskMap = {};
  riskMap.LOW = 'Low';
  riskMap.MEDIUM = 'Medium';
  riskMap.MEDIUM_HIGH = 'Med-High';
  riskMap.HIGH = 'High';

  if (loaded) {
    return (
      <>
        <Map
          id="msa"
          center={[49, -123]}
          zoom={9}
        >
          <GeoJSON data={geojson} onEachFeature={onEachFeature.bind(null, this)} style={getStyle}>

            {selectedFeature && (
              <Popup maxWidth="320">
                {(selectedFeature.properties.link && pageCustomization.enableWeatherLink)
                && <a className="weatherLink" target="_" href={selectedFeature.properties.link}>Weather Report</a>}
                <table className="riskTable">
                  <thead>
                  <tr>
                    <th>Date</th>
                    <th>24-hr precipitation (mm)</th>
                    <th>72-hr precipitation (mm)</th>
                    <th>Rainfall amount</th>
                  </tr>
                  </thead>
                  <tbody>
                  {[0, 1, 2, 3, 4].map((v) => {
                    const s = selectedFeature.properties.forecasts.statistics[v];
                    if (!!s) {
                      return (
                        <tr key={`forecast-${v}`}>
                          <td>{formatDate(moment(s.associatedForecast.forDate))}</td>
                          <td>{formatNumeric(s.next24 ? s.next24 : 0)}</td>
                          <td>{formatNumeric(s.next72 ? s.next72 : 0)}</td>
                          <td className={`risk-${s.runoffRisk}`}>
                            {riskMap[s.runoffRisk]}
                          </td>
                        </tr>
                      );
                    }
                    return null;
                  })}
                  </tbody>
                  <tfoot>
                  <tr>
                    {[{ i: 0, name: 'today' }, { i: 1, name: 'tomorrow' }].map((v) => {
                      const s = selectedFeature.properties.forecasts.statistics[v.i];
                      if (!!s) {
                        const formatted24 = formatNumeric(s.next24 ? s.next24 : 0);
                        const formatted72 = formatNumeric(s.next72 ? s.next72 : 0);
                        const worksheetLink = pageCustomization.armLink.replace('{24}', formatted24).replace('{72}', formatted72);
                        return (
                          <td key={`assessment-${v.i}`} colSpan={2}>
                            <a target="_" href={worksheetLink} className="worksheetLink">
                              {`Complete a risk assessment for ${v.name}`}
                            </a>
                          </td>
                        );
                      }
                      return (<td colSpan={2} />);
                    })}
                  </tr>
                  </tfoot>
                </table>
              </Popup>
            )}
          </GeoJSON>

          <TileLayer
            attribution={tileLayer.attribution}
            url={tileLayer.url}
          />

          <Legend />

        </Map>
      </>
    );
  }
  return <Loading />;
};

export default Msa;
