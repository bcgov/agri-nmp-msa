package bc.gov.agri.representations

import bc.gov.agri.services.DateDeserializer
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import org.apache.commons.lang3.builder.ToStringBuilder

class OWMForecast {
  List<Forecast> list = new LinkedList<>();

  static class Forecast {

    @JsonDeserialize(using = DateDeserializer.class)
    Date dt;

    double rain = 0;
    double snow = 0;

    @Override
    String toString() {
      return ToStringBuilder.reflectionToString(this);
    }
  }

  @Override
  String toString() {
    return ToStringBuilder.reflectionToString(this);
  }
}
