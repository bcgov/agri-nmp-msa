package bc.gov.agri.representations


import com.fasterxml.jackson.annotation.JsonProperty
import org.apache.commons.lang3.builder.ToStringBuilder

import java.time.LocalDate

class ArchivedForecast {

  LocalDate forDate;

  BigDecimal next24;
  BigDecimal next72;

  @JsonProperty("runoffRisk")
  RiskRating riskRating;

  @Override
  String toString() {
    return ToStringBuilder.reflectionToString(this);
  }

}
