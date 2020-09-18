import React, { useState } from 'react';

const StationTable = (props) => {
  const { stations, updateStation } = props;

  const [editing, setEditing] = useState(null);
  const [dirtyValue, setDirtyValue] = useState(null);

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
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default StationTable;
