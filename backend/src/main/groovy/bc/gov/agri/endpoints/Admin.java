package bc.gov.agri.endpoints;

import bc.gov.agri.representations.AdminDashboardReport;
import bc.gov.agri.representations.WeatherStation;
import bc.gov.agri.services.AdminService;
import bc.gov.agri.services.PrecipitationGroupsService;
import java.util.List;
import java.util.concurrent.TimeUnit;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

@RestController
@RequestMapping(value = "/v1/admin")
@CrossOrigin(origins = "*")
public class Admin {

  private final AdminService adminService;
  private final PrecipitationGroupsService precipitationGroupsService;

  public Admin(AdminService adminService, PrecipitationGroupsService precipitationGroupsService) {
    this.adminService = adminService;
    this.precipitationGroupsService = precipitationGroupsService;
  }

  @RequestMapping(value = "/dashboard", method = RequestMethod.GET)
  public ResponseEntity<AdminDashboardReport> dashboard(WebRequest request) {
    return ResponseEntity
        .ok()
        .cacheControl(CacheControl.maxAge(2, TimeUnit.MINUTES))
        .body(adminService.computeDashboard());
  }

  @RequestMapping(value = "/stations", method = RequestMethod.GET)
  public List<WeatherStation> listStations() {
    return precipitationGroupsService.getWeatherStations();
  }

  @RequestMapping(value = "/stations/{id}", method = RequestMethod.PUT)
  @ResponseStatus(HttpStatus.ACCEPTED)
  public void updateStation(@PathVariable("id") String id, @RequestBody WeatherStation station) {
    precipitationGroupsService.updateWeatherStation(id, station);
  }


}
