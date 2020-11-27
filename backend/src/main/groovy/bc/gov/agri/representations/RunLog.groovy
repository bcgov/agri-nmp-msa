package bc.gov.agri.representations

import bc.gov.agri.utilities.DateSerializer
import com.fasterxml.jackson.databind.annotation.JsonSerialize

class RunLog {
  int id;
  @JsonSerialize(using = DateSerializer.class)
  Date runStart;
  @JsonSerialize(using = DateSerializer.class)
  Date runFinish;
  int groupsUpdated;
  int errorCount;
  String remarks;
}
