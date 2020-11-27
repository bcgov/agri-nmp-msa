package bc.gov.agri.representations

import bc.gov.agri.utilities.DateSerializer
import com.fasterxml.jackson.databind.annotation.JsonSerialize

class AdminDashboardReport {
  @JsonSerialize(using = DateSerializer.class)
  Date lastForecastUpdate;
  List<RunLog> runLogs = new ArrayList<>();
}
