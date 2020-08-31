package bc.gov.agri.representations;

import com.fasterxml.jackson.annotation.JsonRawValue;

class PrecipitationGroup {

  @JsonRawValue
  String geometry;
  String id;
  RunoffRiskAssessment runoffRiskAssessment;
  WeatherStation weatherStation;

}
