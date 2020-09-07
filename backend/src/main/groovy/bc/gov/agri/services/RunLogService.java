package bc.gov.agri.services;

import bc.gov.agri.representations.RunLog;
import java.util.LinkedList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// create sequence runlogs_id;
// create table runlogs (id int not null primary key default nextval('runlogs_id'), run_start timestamp without time zone not null, run_finish timestamp without time zone not  null, groups_updated int, error_count int, remarks text);

@Service
@Transactional
public class RunLogService {

  @Autowired JdbcTemplate template;

  public List<RunLog> getRunLogs() {

    List<RunLog> runLogs = new LinkedList<>();

    String Q = "SELECT rl.id as id, rl.run_start as run_start, rl.run_finish as run_finish, rl"
        + ".groups_updated  as groups_updated, rl.error_count as error_count, rl.remarks as "
        + "remarks from runlogs as rl order by run_finish desc limit 10";

    template.query(Q, row -> {
      String id = row.getString(1);
      RunLog rl = new RunLog();
      rl.setId(row.getInt(1));
      rl.setRunStart(row.getTimestamp(2));
      rl.setRunFinish(row.getTimestamp(3));
      rl.setGroupsUpdated(row.getInt(4));
      rl.setErrorCount(row.getInt(5));
      rl.setRemarks(row.getString(6));
      runLogs.add(rl);
    });

    return runLogs;
  }

  public void saveRunLog(RunLog rl) {
    template.update("delete from runlogs where id not in (select id from runlogs order by "
        + "run_finish desc limit 10)");

    template.update(
        "insert into runlogs (run_start, run_finish, groups_updated, error_count, remarks) values"
            + " (?, ?, ?, ?, ?)",
        rl.getRunStart(),
        rl.getRunFinish(),
        rl.getGroupsUpdated(),
        rl.getErrorCount(),
        rl.getRemarks());
  }
}
