package bc.gov.agri.services;

import bc.gov.agri.representations.OWMForecast;
import bc.gov.agri.representations.WeatherStation;
import java.net.URI;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.Semaphore;
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

  @Value("${GOV_BC_AGRI_OWM_APIKEY}") private String APIKEY;

  @Scheduled(cron = "* 0 * * * ?", zone = "America/Vancouver")
  public void fromOas() {
    Random r = new Random();
    System.out.println("updating forecasts");
    List<WeatherStation> stations = service.getWeatherStations();

    stations.forEach(weatherStation -> {
      LocalDateTime lastUpdate = service.lastForecastUpdate(weatherStation.getId());
      boolean doUpdate = false;
      if (lastUpdate == null) {
        doUpdate = true;
        System.out.println("lastUpdate null: will update");
      } else {

        LocalDateTime cutoff = LocalDateTime.now().minus(Duration.ofHours(12));
        if (lastUpdate.isBefore(cutoff)) {
          doUpdate = true;
        }
      }

      if (doUpdate) {
        OWMForecast owmForecast = this.getOpenWeatherMap(weatherStation.getLatitude().toString(),
            weatherStation.getLongitude().toString());
        service.storeForecast(weatherStation.getId(), owmForecast);
      }
    });
  }

  private final RestTemplate template;


  public UpdateForecastsService(RestTemplateBuilder restTemplateBuilder) {
    RateLimiter rl = new RateLimiter(0.1);
    this.template = restTemplateBuilder.additionalInterceptors((request, body, execution) -> {
      long now = System.currentTimeMillis();
      rl.acquire();
      return execution.execute(request, body);
    }).build();
  }

  public OWMForecast getOpenWeatherMap(String lat, String lon) {

    final String APIQUERY = "https://api.openweathermap.org/data/2"
        + ".5/forecast/daily?lat=${lat}&lon=${lon}&cnt=8&appid=${APIKEY}";

    Map<String, String> map = new HashMap<>();
    map.put("APIKEY", this.APIKEY);
    map.put("lat", lat);
    map.put("lon", lon);

    StringSubstitutor sub = new StringSubstitutor(map);
    final String url = sub.replace(APIQUERY);

    OWMForecast response = template.getForObject(URI.create(url), OWMForecast.class);
    return response;
  }

}
