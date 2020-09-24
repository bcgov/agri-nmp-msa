package bc.gov.agri.endpoints;

import bc.gov.agri.representations.HashedResult;
import bc.gov.agri.representations.geojson.FeatureCollection;
import bc.gov.agri.services.PrecipitationGroupsService;
import java.time.Duration;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

@RestController
@RequestMapping(value = "/v1/groups")
@CrossOrigin(origins = "*")
public class PrecipitationGroups {

  private final PrecipitationGroupsService service;

  public PrecipitationGroups(PrecipitationGroupsService service) {
    this.service = service;
  }

  @RequestMapping(value = "/geojson", method = RequestMethod.GET)
  public ResponseEntity<FeatureCollection> geojson(WebRequest request) {

    final HashedResult<FeatureCollection> result = service.getGeoJSON();

    if (request.checkNotModified(result.getHash())) {
      return ResponseEntity.status(HttpStatus.NOT_MODIFIED).build();
    }

    return ResponseEntity
        .ok()
        .cacheControl(CacheControl.noCache().mustRevalidate())
        .eTag(result.getHash())
        .body(result.getResult());
  }
}
