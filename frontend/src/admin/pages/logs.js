import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Loading from '../../shared/components/loading';
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
    console.dir(axios.defaults.headers);
    Promise.all(promises).then(() => {
      setLoaded(true);
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
