package bc.gov.agri.services;

import bc.gov.agri.representations.HashedResult;
import bc.gov.agri.representations.OWMForecast;
import bc.gov.agri.representations.WeatherStation;
import bc.gov.agri.representations.geojson.FeatureCollection;
import java.math.BigDecimal;
import java.security.MessageDigest;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import org.apache.commons.codec.binary.Hex;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

/*
alter table forecast alter column rain type numeric(7,3);
alter table forecast alter column snow type numeric(7,3);
alter table forecast alter column next24 type numeric(7,3);
alter table forecast alter column next72 type numeric(7,3);
*/

@Service
@Transactional
public class PrecipitationGroupsService {

  @Autowired JdbcTemplate template;

  public List<WeatherStation> getWeatherStations() {
    List<WeatherStation> stations = new LinkedList<>();

    template.query(
        "select sp.precipgrp, sp.longitude, sp.latitude, sp.userlink from station_points sp order"
            + " by sp.precipgrp asc",
        row -> {
          String station = row.getString(1);
          BigDecimal lon = row.getBigDecimal(2);
          BigDecimal lat = row.getBigDecimal(3);
          String link = row.getString(4);
          WeatherStation ws = new WeatherStation();

          ws.setLongitude(lon);
          ws.setLatitude(lat);
          ws.setId(station);
          ws.setLink(link);
          stations.add(ws);
        });
    return stations;
  }

  public void updateWeatherStation(String id, @Validated WeatherStation station) {
    template.update("update station_points set userlink = ? where precipgrp = ?",
        station.getLink(),
        Integer.parseInt(id));
  }

  public LocalDateTime lastForecastUpdate(String stationId) {
    LocalDateTime[] lastUpdate = new LocalDateTime[1];
    lastUpdate[0] = null;

    template.query("select max(retrieved_at) as last_update from forecast where precipgrp = ?",
        new Integer[]{Integer.parseInt(stationId)},
        row -> {
          Timestamp ts = row.getTimestamp(1);
          if (ts != null) {
            lastUpdate[0] = ts.toLocalDateTime();
          }
        });

    return lastUpdate[0];
  }

  public OWMForecast retrieveForecasts(String stationId) {

    OWMForecast forecast = new OWMForecast();

    template.query("select rain, snow, valid_for from forecast where precipgrp = ? and "
            + "valid_for >= date(timezone('America/Vancouver', now())) order by valid_for asc",
        new Integer[]{Integer.parseInt(stationId)},
        row -> {
          OWMForecast.Forecast fc = new OWMForecast.Forecast();
          forecast.getList().add(fc);
          fc.setRain(row.getDouble(1));
          fc.setSnow(row.getDouble(2));
          fc.setDt(row.getDate(3).toLocalDate());
        });

    return forecast;
  }

  @CacheEvict(allEntries = true, cacheNames = "geojson")
  public void storeForecast(String stationId, OWMForecast forecast) {
    template.update("delete from forecast where precipgrp = ?", Integer.parseInt(stationId));
    List<OWMForecast.Statistics> statistics = forecast.getStatistics();

    forecast.getList().forEach(d -> {
      Optional<OWMForecast.Statistics> s1 =
          statistics.stream().filter(s -> s.getAssociatedForecast() == d).findFirst();
      template.update(
          "insert into forecast (precipgrp, rain, snow, valid_for, retrieved_at, next24, next72, "
              + "risk) values (?, ?, ?, ?, now(), ?, ?, ?)",
          Integer.parseInt(stationId),
          d.getRain(),
          d.getSnow(),
          Date.valueOf(d.getDt()),
          s1.map(OWMForecast.Statistics::getNext24).orElse(null),
          s1.map(OWMForecast.Statistics::getNext72).orElse(null),
          s1.map(s -> s.computedRiskRating().getValue()).orElse(null));
    });
  }


  @Cacheable(cacheNames = "geojson")
  public HashedResult<FeatureCollection> getGeoJSON() {
    FeatureCollection fc = new FeatureCollection();

    MessageDigest md = DigestUtils.getSha1Digest();

    String Q =
        "SELECT pg.precipgrp as id, ST_AsGEOJSON(pg.geom)::json AS geometry, sp.longitude, sp"
            + ".latitude, sp.userlink as link from precip_groups pg inner join station_points sp "
            + "on sp.precipgrp = pg" + ".precipgrp;";

    template.query(Q, row -> {
      String id = row.getString(1);
      String geometry = row.getString(2);
      BigDecimal lon = row.getBigDecimal(3);
      BigDecimal lat = row.getBigDecimal(4);
      String link = row.getString(5);

      WeatherStation ws = new WeatherStation();
      ws.setLatitude(lat);
      ws.setLongitude(lon);

      FeatureCollection.Feature f = new FeatureCollection.Feature();
      f.setGeometry(geometry);
      f.getProperties().put("weatherStation", ws);
      f.getProperties().put("precipgrp", id);
      OWMForecast forecasts = this.retrieveForecasts(id);
      f.getProperties().put("forecasts", forecasts);
      f.getProperties().put("link", link);

      fc.getFeatures().add(f);

      DigestUtils.updateDigest(md, id);
      DigestUtils.updateDigest(md, Optional.ofNullable(link).orElse("none"));
      forecasts.getList().stream().forEach(forecast -> {
        DigestUtils.updateDigest(md, String.valueOf(forecast.getDt().getDayOfMonth()));
        DigestUtils.updateDigest(md, String.valueOf(forecast.getSnow()));
        DigestUtils.updateDigest(md, String.valueOf(forecast.getRain()));
      });
    });

    HashedResult<FeatureCollection> result = new HashedResult<>();

    result.setResult(fc);
    result.setHash(Hex.encodeHexString(md.digest()));

    return result;
  }

}
