package bc.gov.agri.services;

import bc.gov.agri.representations.ArchivedForecast;
import bc.gov.agri.representations.RiskRating;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/*

create table public.archived_forecasts (
  precipgrp smallint not null,
  for_date date not null,
  archived_at timestamp without time zone default now(),
  next24 numeric(7,3),
  next72 numeric(7,3),
  risk smallint
);
alter table station_points add constraint unique_precipgrp unique(precipgrp);
alter table public.archived_forecasts add constraint unique_for_date unique(precipgrp,for_date);
alter table public.archived_forecasts add constraint fk_precipgrp foreign key(precipgrp) references station_points(precipgrp) on delete cascade;

*/

@Service
@Transactional
public class ForecastArchiveService {

  @Autowired JdbcTemplate template;

  @Scheduled(cron = "0 46 3 * * ?", zone = "America/Vancouver")
  public void cleanupOldArchives() {
    template.update(
        "delete from archived_forecasts where for_date < (now() - interval '6 " + "months');");
  }


  public List<ArchivedForecast> getArchivedForecasts(String stationId) {
    List<ArchivedForecast> archive = new LinkedList<>();

    template.query("select next24, next72, risk, for_date from archived_forecasts "
        + "where precipgrp = ? order by for_date desc;", row -> {

      ArchivedForecast f = new ArchivedForecast();
      f.setNext24(row.getBigDecimal(1));
      f.setNext72(row.getBigDecimal(2));

      int risk = row.getInt(3);

      if (!row.wasNull()) {
        f.setRiskRating(Arrays
            .stream(RiskRating.values())
            .filter(r -> (r.getValue() == risk))
            .findFirst()
            .orElse(null));
      }

      f.setForDate(row.getDate(4).toLocalDate());

      archive.add(f);

    }, Integer.parseInt(stationId));

    return archive;

  }


}

