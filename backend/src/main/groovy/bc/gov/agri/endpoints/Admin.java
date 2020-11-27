package bc.gov.agri.endpoints;

import bc.gov.agri.representations.AdminDashboardReport;
import bc.gov.agri.representations.ArchivedForecast;
import bc.gov.agri.representations.WeatherStation;
import bc.gov.agri.services.AdminService;
import bc.gov.agri.services.ForecastArchiveService;
import bc.gov.agri.services.PrecipitationGroupsService;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.List;
import java.util.concurrent.TimeUnit;
import javax.servlet.http.HttpServletResponse;
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
import org.supercsv.io.CsvListWriter;
import org.supercsv.prefs.CsvPreference;

@RestController
@RequestMapping(value = "/v1/admin")
@CrossOrigin(origins = "*")
public class Admin {

  private final AdminService adminService;
  private final PrecipitationGroupsService precipitationGroupsService;
  private final ForecastArchiveService archiveService;

  public Admin(
      AdminService adminService, PrecipitationGroupsService precipitationGroupsService,
      ForecastArchiveService forecastArchiveService) {
    this.adminService = adminService;
    this.precipitationGroupsService = precipitationGroupsService;
    this.archiveService = forecastArchiveService;
  }

  @RequestMapping(value = "/dashboard", method = RequestMethod.GET)
  public ResponseEntity<AdminDashboardReport> dashboard(WebRequest request) {
    return ResponseEntity.ok().cacheControl(CacheControl.maxAge(2, TimeUnit.MINUTES)).body(
        adminService.computeDashboard());
  }

  @RequestMapping(value = "/archives/{id}", method = RequestMethod.GET)
  public List<ArchivedForecast> archived(
      @PathVariable("id") String id) {
    return archiveService.getArchivedForecasts(id);
  }

  @RequestMapping(value = "/archives/{id}", method = RequestMethod.GET, produces = "text/csv")
  public void archivedCSV(@PathVariable("id") String id, HttpServletResponse response)
      throws IOException {
    List<ArchivedForecast> forecasts = archiveService.getArchivedForecasts(id);

    response.setStatus(200);

    try (final CsvListWriter csvWriter = new CsvListWriter(new OutputStreamWriter(response.getOutputStream()),
        CsvPreference.STANDARD_PREFERENCE)) {

      String[] header = {"Date", "Rainfall Amount", "Next 24 hours", "Next 72 hours"};

      csvWriter.writeComment("Archive for station " + id);
      csvWriter.writeHeader(header);

      for (ArchivedForecast f : forecasts) {
        csvWriter.write(f.getForDate().toString(),
            f.getRiskRating().toString(),
            f.getNext24().toPlainString(),
            f.getNext72().toPlainString());
      }
    }
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
