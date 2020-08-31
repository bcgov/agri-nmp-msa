package bc.gov.agri.representations


import java.time.LocalDate
import java.time.LocalDateTime

class RunoffRiskAssessment {

  LocalDateTime computedAt;

  List<RiskAt> riskDates = new ArrayList<>(5);

  static class RiskAt {
    LocalDate validFor;
    String authority;
    BigDecimal oneDay;
    BigDecimal threeDay;
  }

}
