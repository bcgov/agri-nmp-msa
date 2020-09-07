package bc.gov.agri.endpoints;

import bc.gov.agri.representations.geojson.FeatureCollection;
import bc.gov.agri.services.PrecipitationGroupsService;
import java.util.concurrent.TimeUnit;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

@RestController
@RequestMapping(value = "/v1/health")
@CrossOrigin(origins = "*")
public class HealthCheck {

  @RequestMapping(value = "/", method = RequestMethod.GET)
  public String healthCheck() {
    return "up";
  }
}
