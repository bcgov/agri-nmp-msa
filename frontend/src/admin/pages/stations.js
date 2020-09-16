import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Loading from '../../shared/components/loading';
import CONFIG from '../../shared/config';
import StationTable from '../components/station_table';

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
        <h2>Weather Stations</h2>

        <StationTable stations={stations} updateStation={updateStation} />
      </div>
    );
  }
  return (<Loading />);
};

export default Stations;
