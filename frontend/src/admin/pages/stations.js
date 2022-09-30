import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Loading from '../../shared/components/loading';
import { KeycloakContext } from '../auth';
import StationTable from '../components/station_table';
import {ConfigContext} from "../context";

const Stations = () => {
  const [stations, setStations] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const keycloak = useContext(KeycloakContext);
  const CONFIG = useContext(ConfigContext);

  useEffect(() => {
    keycloak.updateToken(30).then(() => {
      const authHeader = `Bearer ${keycloak.idToken}`;
      const promises = [
        axios.get(`${CONFIG.API_BASE}/v1/admin/stations`, { headers: { authorization: authHeader } }).then((response) => {
          setStations(response.data);
        }),
      ];
      Promise.all(promises).then(() => {
        setLoaded(true);
      });
    });
  }, []);

  const updateStation = (id, station) => {
    keycloak.updateToken(30).then(() => {
      const authHeader = `Bearer ${keycloak.idToken}`;
      axios.put(`${CONFIG.API_BASE}/v1/admin/stations/${id}`, station, { headers: { authorization: authHeader } }).then(() => {
        const index = stations.findIndex((st) => st.id === station.id);
        const updatedStations = [...stations];
        updatedStations[index] = station;
        setStations(updatedStations);
      });
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
