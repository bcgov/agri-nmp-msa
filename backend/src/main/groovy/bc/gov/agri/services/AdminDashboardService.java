package bc.gov.agri.services;

import bc.gov.agri.representations.AdminDashboardReport;
import bc.gov.agri.representations.OWMForecast;
import bc.gov.agri.representations.WeatherStation;
import bc.gov.agri.representations.geojson.FeatureCollection;
import com.github.benmanes.caffeine.cache.Cache;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AdminDashboardService {

  @Autowired CacheManager cache;
  @Autowired RunLogService runLogService;
  @Autowired JdbcTemplate template;

  public AdminDashboardReport computeDashboard() {
    AdminDashboardReport report = new AdminDashboardReport();
    template.query(
        "select count(*) as total, min(retrieved_at) as earliest, max(retrieved_at)  as latest "
            + "from forecast",
        row -> {
          report.setLastForecastUpdate(row.getTimestamp(3));
        });

    report.setRunLogs(runLogService.getRunLogs());

    return report;

  }

}
