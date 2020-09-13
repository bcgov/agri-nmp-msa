import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CONFIG from '../../shared/config';
import RunlogTable from '../components/run_log';

const RunLogs = () => {

  const [report, setReport] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const promises = [
      axios.get(`${CONFIG.API_BASE}/v1/admin/dashboard`).then((response) => {
        setReport(response.data);
      }),
    ];
    Promise.all(promises).then(() => {
      setLoaded(true);
    });
  }, []);

  if (loaded) {
    return (
      <div>
        <h4>Run Logs</h4>
        <RunlogTable runlogs={report.runLogs} />
      </div>
    );
  }
  return <p>loading</p>;
};

export default RunLogs;
