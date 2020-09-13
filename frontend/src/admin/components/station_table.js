import React, { useState } from 'react';

const Station_table = (props) => {
  const { stations, updateStation } = props;
  const formatTimestamp = (v) => (v.toLocaleString());

  let [editing, setEditing] = useState(null);

  const save = (s) => {
    setEditing(null);
    updateStation(s.id, s);
  };

  const handlerFor = (s) => {
    return (event) => {
      console.log('handling event for ' + s.id);
      console.dir(event.target.value);
      s.link = event.target.value;
    };
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
          <td>
            {s.id === editing && <input onChange={handlerFor(s)} value={s.link} />}
            {s.id !== editing && s.link}
          </td>
          <td>
            {s.id === editing && <button onClick={() => save(s)}>Save</button>}
            {s.id !== editing && <button onClick={() => setEditing(s.id)} disabled={editing !== null}>Edit</button>}
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default Station_table;
