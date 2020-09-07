import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import RunlogTable from '../components/runlog';
import CONFIG from '../config';

const AdminPage = () => {

  const history = useHistory();
  const { t } = useTranslation();

  const zoom = useState(13);

  const [report, setReport] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    axios.get(`${CONFIG.API_BASE}/v1/admin/dashboard`).then((response) => {
      setReport(response.data);
      setLoaded(true);
    });
  }, []);

  if (loaded) {
    return (
      <div>
        <h2>Admin Dashboard</h2>
        <hr />
        <h4>Run Logs</h4>
        <RunlogTable runlogs={report.runLogs} />
      </div>
    );
  }
  return <p>loading</p>;
};

export default AdminPage;
