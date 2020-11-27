package bc.gov.agri.representations

import bc.gov.agri.utilities.LocalDateDeserializer
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import org.apache.commons.lang3.builder.ToStringBuilder

import java.time.LocalDate
import java.util.stream.Collectors

class OWMForecast {
  List<Forecast> list = new LinkedList<>();

  static class Forecast {

    @JsonDeserialize(using = LocalDateDeserializer.class)
    LocalDate dt;

    Double rain = 0;
    Double snow = 0;

    @JsonProperty("forDate")
    LocalDate forDate() {
      return dt;
    }

    double totalPrecip() {
      return rain + snow;
    }

    @Override
    String toString() {
      return ToStringBuilder.reflectionToString(this);
    }
  }

  @Override
  String toString() {
    return ToStringBuilder.reflectionToString(this);
  }

  List<Statistics> getStatistics() {
    try {
      return list.stream().map(e -> {
        Statistics s = new Statistics();
        s.associatedForecast = e;
        s.next24 = e.totalPrecip();
        s.next72 = e.totalPrecip();

        LocalDate currentDay = e.dt;

        for (int i = 1; i <= 2; i++) {
          LocalDate nextDay = currentDay.plusDays(1 * i);
          Forecast nextForecast = list.find(f -> f.dt.equals(nextDay));

          if (nextForecast != null && s.next72 != null) {
            s.next72 += nextForecast.totalPrecip();
          } else {
            s.next72 = null;
          }
        }
        return s;
      }
      ).collect(Collectors.toList());
    } catch (Exception e) {
      e.printStackTrace(System.err);
      throw e;
    }
  }

  static class Statistics {

    Forecast associatedForecast;

    Double next24 = 0;
    Double next72 = 0;

    @Override
    String toString() {
      return ToStringBuilder.reflectionToString(this);
    }

    @JsonProperty("runoffRisk")
    RiskRating computedRiskRating() {
      RiskRating risk24 = RiskRating.LOW, risk72 = RiskRating.LOW;

      if (next24 >= 0 && next24 < 2) {
        risk24 = RiskRating.LOW;
      } else if (next24 >= 2 && next24 < 5) {
        risk24 = RiskRating.MEDIUM;
      } else if (next24 >= 5 && next24 < 8.75) {
        risk24 = RiskRating.MEDIUM_HIGH;
      } else if (next24 >= 8.75) {
        risk24 = RiskRating.HIGH;
      }

      if (next72 >= 0 && next72 < 5) {
        risk72 = RiskRating.LOW;
      } else if (next72 >= 5 && next72 < 8.75) {
        risk72 = RiskRating.MEDIUM;
      } else if (next72 >= 8.75 && next72 < 12.5) {
        risk72 = RiskRating.MEDIUM_HIGH;
      } else if (next72 >= 12.5) {
        risk72 = RiskRating.HIGH;
      }

      return risk72.value > risk24.value ? risk72 : risk24;
    }

  }
}
