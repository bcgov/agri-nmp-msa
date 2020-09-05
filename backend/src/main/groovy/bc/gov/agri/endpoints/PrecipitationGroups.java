package bc.gov.agri.endpoints;

import bc.gov.agri.representations.OWMForecast;
import bc.gov.agri.representations.PrecipitationGroup;
import bc.gov.agri.representations.geojson.FeatureCollection;
import bc.gov.agri.services.PrecipitationGroupsService;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/v1/groups")
@CrossOrigin(origins = "*")
public class PrecipitationGroups {

  final private PrecipitationGroupsService service;

  public PrecipitationGroups(PrecipitationGroupsService service) {
    this.service = service;
  }

  @RequestMapping(value = "/", method = RequestMethod.GET)
  public String allGroups() {
    return service.getAll();
  }

  @RequestMapping(value = "/{stationId}/forecast", method = RequestMethod.GET)
  public OWMForecast forecast(@PathVariable("stationId") String stationId) {
    return service.retrieveForecasts(stationId);
  }

  @RequestMapping(value = "/j", method = RequestMethod.GET)
  public List<PrecipitationGroup> jsonGroups() {
    return service.getGroups();
  }

  @RequestMapping(value = "/geojson", method = RequestMethod.GET)
  public FeatureCollection geojson() {
    return service.getGeoJSON();
  }
}
