package bc.gov.agri.services;

import bc.gov.agri.representations.OWMForecast;
import bc.gov.agri.representations.RunLog;
import bc.gov.agri.representations.WeatherStation;
import bc.gov.agri.utilities.RateLimiter;
import java.net.URI;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import org.apache.commons.text.StringSubstitutor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class UpdateForecastsService {

  @Autowired PrecipitationGroupsService service;
  @Autowired RunLogService runLogService;

  @Value("${GOV_BC_AGRI_OWM_APIKEY}") private String APIKEY;

  private final RestTemplate template;

  public UpdateForecastsService(RestTemplateBuilder restTemplateBuilder) {
    RateLimiter rl = new RateLimiter(0.1);
    this.template = restTemplateBuilder.additionalInterceptors((request, body, execution) -> {
      rl.acquire();
      return execution.execute(request, body);
    }).build();
  }

  @Scheduled(cron = "0 3 * * * ?", zone = "America/Vancouver")
  public void updateForecasts() {
    RunLog rl = new RunLog();
    rl.setRunStart(new Date());

    List<WeatherStation> stations = service.getWeatherStations();
    AtomicInteger groupsUpdated = new AtomicInteger(0);

    stations.forEach(weatherStation -> {
      LocalDateTime lastUpdate = service.lastForecastUpdate(weatherStation.getId());
      boolean doUpdate = false;
      if (lastUpdate == null) {
        doUpdate = true;
      } else {

        LocalDateTime cutoff = LocalDateTime.now().minus(Duration.ofHours(6));
        if (lastUpdate.isBefore(cutoff)) {
          doUpdate = true;
        }
      }

      if (doUpdate) {
        groupsUpdated.incrementAndGet();
        OWMForecast owmForecast = this.getOpenWeatherMap(weatherStation.getLatitude().toString(),
            weatherStation.getLongitude().toString());
        service.storeForecast(weatherStation.getId(), owmForecast);
      }
    });

    rl.setRunFinish(new Date());
    rl.setGroupsUpdated(groupsUpdated.get());
    runLogService.saveRunLog(rl);
  }


  public OWMForecast getOpenWeatherMap(String lat, String lon) {

    final String APIQUERY = "https://api.openweathermap.org/data/2"
        + ".5/forecast/daily?lat=${lat}&lon=${lon}&cnt=8&appid=${APIKEY}";

    Map<String, String> map = new HashMap<>();
    map.put("APIKEY", this.APIKEY);
    map.put("lat", lat);
    map.put("lon", lon);

    final StringSubstitutor sub = new StringSubstitutor(map);
    final String url = sub.replace(APIQUERY);

    return template.getForObject(URI.create(url), OWMForecast.class);
  }

}
