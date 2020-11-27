import moment from 'moment';
import React from 'react';

const RunlogTable = (props) => {
  const { runlogs } = props;
  const formatTimestamp = (v) => (v.format('l HH:mm z'));

  return (
    <table id={'runlogs'}>
      <thead>
      <tr>
        <th>ID</th>
        <th>Run Started</th>
        <th>Run Finished</th>
        <th>Zones Updated</th>
        <th>Error Count</th>
        <th>Remarks</th>
      </tr>
      </thead>
      <tbody>
      {runlogs.map((rl) => (
        <tr key={rl.id}>
          <td>{rl.id}</td>
          <td>{formatTimestamp(moment(rl.runStart))}</td>
          <td>{formatTimestamp(moment(rl.runFinish))}</td>
          <td>{rl.groupsUpdated}</td>
          <td>{rl.errorCount}</td>
          <td className={'remarks'}>
            <div className={'content'}>{rl.remarks || '--'}</div>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default RunlogTable;
