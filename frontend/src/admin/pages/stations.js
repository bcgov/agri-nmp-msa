import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import PageCustomizationEditor from '../components/markup_editor';
import RunlogTable from '../components/run_log';
import StationTable from '../components/station_table';
import CONFIG from '../../shared/config';

const Stations = () => {
  const [stations, setStations] = useState([]);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const promises = [
      axios.get(`${CONFIG.API_BASE}/v1/admin/stations`).then((response) => {
        setStations(response.data);
      }),
    ];
    Promise.all(promises).then(() => {
      setLoaded(true);
    });
  }, []);

  const updateStation = (id, station) => {
    axios.put(`${CONFIG.API_BASE}/v1/admin/stations/${id}`, station).then(() => {
      const index = stations.findIndex((st) => st.id === station.id);
      const updatedStations = [...stations];
      updatedStations[index] = station;
      setStations(updatedStations);
    });
  };

  if (loaded) {
    return (
      <div>
        <StationTable stations={stations} updateStation={updateStation} />
      </div>
    );
  }
  return <p>loading</p>;
};

export default Stations;
