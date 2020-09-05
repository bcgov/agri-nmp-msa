package bc.gov.agri.services;

import bc.gov.agri.representations.OWMForecast;
import bc.gov.agri.representations.PrecipitationGroup;
import bc.gov.agri.representations.RunoffRiskAssessment;
import bc.gov.agri.representations.WeatherStation;
import bc.gov.agri.representations.geojson.FeatureCollection;
import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PrecipitationGroupsService {

  @Autowired
  JdbcTemplate template;

  public String getAll() {
    StringBuffer sb = new StringBuffer();
    template.query("select sp.precipgrp, sp.longitude, sp.latitude from station_points sp right outer join precip_groups pg on sp.precipgrp = pg.precipgrp;",
        row -> {
          String station = row.getString(1);
          BigDecimal lat = row.getBigDecimal(2);
          BigDecimal lon = row.getBigDecimal(3);
          sb.append("station: " + station + " coords " + lat + ":" + lon + "\n");
        }
    );

    return sb.toString();
  }

  public List<WeatherStation> getWeatherStations() {
    List<WeatherStation> stations = new LinkedList<>();

    template.query("select sp.precipgrp, sp.longitude, sp.latitude from station_points sp",
        row -> {
          String station = row.getString(1);
          BigDecimal lon = row.getBigDecimal(2);
          BigDecimal lat = row.getBigDecimal(3);
          WeatherStation ws = new WeatherStation();

          ws.setLongitude(lon);
          ws.setLatitude(lat);
          ws.setId(station);
          stations.add(ws);
        }
    );
    return stations;
  }

  public LocalDateTime lastForecastUpdate(String stationId) {
    LocalDateTime[] lastUpdate = new LocalDateTime[1];
    lastUpdate[0] = null;

    template.query("select max(retrieved_at) as last_update from forecast where precipgrp = ?",
        new Integer[]{Integer.parseInt(stationId)}, row -> {
          Timestamp ts = row.getTimestamp(1);
          if (ts != null) {
            lastUpdate[0] = ts.toLocalDateTime();
          }
        });

    return lastUpdate[0];
  }

  public OWMForecast retrieveForecasts(String stationId) {

    OWMForecast forecast = new OWMForecast();

    template.query("select rain, snow, valid_for from forecast where precipgrp = ? order by valid_for asc",
        new Integer[]{Integer.parseInt(stationId)},
        row -> {
          OWMForecast.Forecast fc = new OWMForecast.Forecast();
          forecast.getList().add(fc);
          fc.setRain(row.getDouble(1));
          fc.setSnow(row.getDouble(2));
          fc.setDt(new java.util.Date((row.getDate(3).getTime())));
        });

    return forecast;
  }

  public void storeForecast(String stationId, OWMForecast forecast) {
    template.update("delete from forecast where precipgrp = ?", Integer.parseInt(stationId));
    List<OWMForecast.Statistics> statistics = forecast.getStatistics();

    forecast.getList().forEach(d -> {
      Optional<OWMForecast.Statistics> s1 = statistics.stream().filter(s -> s.getAssociatedForecast() == d).findFirst();
      System.out.println("cs for this date: " + s1.orElse(null));
      template.update("insert into forecast (precipgrp, rain, snow, valid_for, retrieved_at, next24, next72, risk) values (?, ?, ?, ?, now(), ?, ?, ?)",
          Integer.parseInt(stationId),
          d.getRain(),
          d.getSnow(),
          d.getDt(),
          s1.map(OWMForecast.Statistics::getNext24).orElse(null),
          s1.map(OWMForecast.Statistics::getNext72).orElse(null),
          s1.map(s -> s.computedRiskRating().getValue()).orElse(null));
    });
  }

  public void setRiskDates(String stationId, String authority, List<RiskRepresentation> representations) {
    template.update("delete from risk_at where precipgrp = ? and authority = ?", Integer.parseInt(stationId), authority);

    representations.forEach(r -> {
      template.update("insert into risk_at (precipgrp, authority, one_day, three_day, valid_for) values (?,?,?,?,?)",
          Integer.parseInt(stationId),
          authority,
          r.oneDay,
          r.threeDay,
          Date.valueOf(r.validfor));
    });

  }

  public static class RiskRepresentation {
    RiskRepresentation(LocalDate validFor) {
      this.validfor = validFor;
    }

    public BigDecimal oneDay;
    public BigDecimal threeDay;
    public LocalDate validfor;
  }

  public List<PrecipitationGroup> getGroups() {

    List<PrecipitationGroup> groups = new ArrayList<>();

    String Q = "SELECT pg.precipgrp as id, ST_AsGEOJSON(pg.geom)::json AS geometry, sp.longitude, sp.latitude from precip_groups pg inner join station_points sp on sp.precipgrp = pg.precipgrp;";

    template.query(Q,
        row -> {
          String id = row.getString(1);
          String geometry = row.getString(2);
          BigDecimal lon = row.getBigDecimal(3);
          BigDecimal lat = row.getBigDecimal(4);

          PrecipitationGroup pg = new PrecipitationGroup();
          pg.setId(id);
          pg.setGeometry(geometry);

          WeatherStation ws = new WeatherStation();
          ws.setLatitude(lat);
          ws.setLongitude(lon);
          pg.setWeatherStation(ws);

          RunoffRiskAssessment riskAssessment = new RunoffRiskAssessment();
          riskAssessment.setComputedAt(LocalDateTime.now(ZoneId.of("America/Vancouver")));
          pg.setRunoffRiskAssessment(riskAssessment);

          groups.add(pg);
        }
    );

    return groups;
  }


  public FeatureCollection getGeoJSON() {

    FeatureCollection fc = new FeatureCollection();

    String Q = "SELECT pg.precipgrp as id, ST_AsGEOJSON(pg.geom)::json AS geometry, sp.longitude, sp.latitude from precip_groups pg inner join station_points sp on sp.precipgrp = pg.precipgrp;";

    template.query(Q,
        row -> {
          String id = row.getString(1);
          String geometry = row.getString(2);
          BigDecimal lon = row.getBigDecimal(3);
          BigDecimal lat = row.getBigDecimal(4);

          WeatherStation ws = new WeatherStation();
          ws.setLatitude(lat);
          ws.setLongitude(lon);


          FeatureCollection.Feature f = new FeatureCollection.Feature();
          f.setGeometry(geometry);
          f.getProperties().put("weatherStation", ws);
          f.getProperties().put("precipgrp", id);
          f.getProperties().put("forecasts", this.retrieveForecasts(id));

          fc.getFeatures().add(f);
        }
    );

    return fc;
  }

}
