import axios from 'axios';
import fileDownload from 'js-file-download';
import React, { useContext, useState } from 'react';
import { KeycloakContext } from '../auth';
import {ConfigContext} from "../context";

const StationTable = (props) => {
  const { stations, updateStation } = props;
  const CONFIG = useContext(ConfigContext);

  const [editing, setEditing] = useState(null);
  const [dirtyValue, setDirtyValue] = useState(null);
  const keycloak = useContext(KeycloakContext);

  const downloadArchive = (s) => {
    keycloak.updateToken(30).then(() => {
      const authHeader = `Bearer ${keycloak.idToken}`;
      const promises = [
        axios.get(`${CONFIG.API_BASE}/v1/admin/archives/${s.id}`, {
          headers: {
            authorization: authHeader,
            accept: 'text/csv',
          },
        }).then((response) => {
          fileDownload(response.data, `Archive for group ${s.id}.csv`);
        }),
      ];
      Promise.all(promises).then(() => {
      });
    });
  };

  const beginEdit = (s) => {
    setEditing(s.id);
    if (s.link === null) {
      setDirtyValue('');
    } else {
      setDirtyValue(s.link);
    }
  };

  const save = (s) => {
    setEditing(null);
    const update = {
      ...s,
      link: dirtyValue,
    };
    updateStation(s.id, update);
  };

  const cancel = (s) => {
    setEditing(null);
  };

  return (
    <table id={'stations'}>
      <thead>
      <tr>
        <th>ID</th>
        <th colSpan={2}>Link</th>
        <th>Archival Data</th>
      </tr>
      </thead>
      <tbody>
      {stations.map((s) => (
        <tr key={s.id}>
          <td>{s.id}</td>
          <td className="left">
            {s.id === editing &&
            <input type="text" maxLength={255} className="stationLink" onChange={(ev) => setDirtyValue(ev.target.value)}
                   value={dirtyValue} />}
            {s.id !== editing && s.link}
          </td>
          <td className="buttons">
            {s.id === editing && <button onClick={() => cancel(s)}>Cancel</button>}
            {s.id === editing && <button onClick={() => save(s)}>Save</button>}
            {s.id !== editing && <button onClick={() => beginEdit(s)} disabled={editing !== null}>Edit</button>}
          </td>
          <td>
            <button onClick={() => downloadArchive(s)}>Download Archive</button>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default StationTable;
