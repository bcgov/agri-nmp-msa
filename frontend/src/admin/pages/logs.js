import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Loading from '../../shared/components/loading';
import CONFIG from '../../shared/config';
import { KeycloakContext } from '../auth';
import RunlogTable from '../components/run_log';

const RunLogs = () => {

  const [report, setReport] = useState({});
  const [loaded, setLoaded] = useState(false);
  const keycloak = useContext(KeycloakContext);

  useEffect(() => {
    keycloak.updateToken(30).then(() => {
      const authHeader = `Bearer ${keycloak.idToken}`;
      const promises = [
        axios.get(`${CONFIG.API_BASE}/v1/admin/dashboard`, { headers: { authorization: authHeader } }).then((response) => {
          setReport(response.data);
        }),
      ];
      Promise.all(promises).then(() => {
        setLoaded(true);
      });
    });
  }, []);

  if (loaded) {
    return (
      <div>
        <h2>Recent Update History</h2>
        <RunlogTable runlogs={report.runLogs} />
      </div>
    );
  }
  return (<Loading />);
};

export default RunLogs;
