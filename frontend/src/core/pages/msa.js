import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GeoJSON, Map, TileLayer } from 'react-leaflet';
import { useHistory } from 'react-router';
import axios from 'axios';

const Msa = () => {

  const history = useHistory();
  const { t } = useTranslation();

  const zoom = useState(13);

  const [geojson, setGeoJSON] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5002/groups').then((response) => {
      setGeoJSON(response.data);
      setLoaded(true);
    });
  }, []);


  function onEachFeature(component, feature, layer) {
    //bind click

    //
    layer.on({
      click: () => {
        console.log('click registered');
        console.log(feature);
      }
    });
  }

  if (loaded) {
    return (
      <Map
        id="msa"
        center={[49, -123]}
        zoom={9}
      >
        <GeoJSON data={geojson} onEachFeature={onEachFeature.bind(null, this)}>
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
