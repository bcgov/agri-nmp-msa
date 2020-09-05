package bc.gov.agri.representations.geojson

import com.fasterxml.jackson.annotation.JsonRawValue

class FeatureCollection {
  String type = "FeatureCollection"
  List<Feature> features = new LinkedList<>();

  static class Feature {
    String type = "Feature";
    Map<String, Object> properties = new HashMap<>();
    @JsonRawValue
    String geometry;
  }
}
