package bc.gov.agri.endpoints;

import bc.gov.agri.representations.AdminDashboardReport;
import bc.gov.agri.representations.geojson.FeatureCollection;
import bc.gov.agri.services.AdminDashboardService;
import bc.gov.agri.services.PrecipitationGroupsService;
import java.time.Duration;
import java.util.concurrent.TimeUnit;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

@RestController
@RequestMapping(value = "/v1/admin")
@CrossOrigin(origins = "*")
public class Admin {

  private AdminDashboardService service;

  public Admin(AdminDashboardService service) {
    this.service = service;
  }

  @RequestMapping(value = "/dashboard", method = RequestMethod.GET)
  public ResponseEntity<AdminDashboardReport> dashboard(WebRequest request) {
    return ResponseEntity
        .ok()
        .cacheControl(CacheControl.maxAge(2, TimeUnit.MINUTES))
        .body(service.computeDashboard());
  }

}
