package bc.gov.agri.endpoints;

import bc.gov.agri.representations.geojson.FeatureCollection;
import bc.gov.agri.services.PrecipitationGroupsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/v1/groups")
@CrossOrigin(origins = "*")
public class PrecipitationGroups {

  final private PrecipitationGroupsService service;

  public PrecipitationGroups(PrecipitationGroupsService service) {
    this.service = service;
  }

  @RequestMapping(value = "/geojson", method = RequestMethod.GET)
  public FeatureCollection geojson() {
    return service.getGeoJSON();
  }
}
