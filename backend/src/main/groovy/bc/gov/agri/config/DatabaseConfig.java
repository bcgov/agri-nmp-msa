package bc.gov.agri.config;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import java.beans.PropertyVetoException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseConfig {

  @Value("${GOV_BC_AGRI_DB_URL}")
  private String URL;

  @Value("${GOV_BC_AGRI_DB_USER}")
  private String USERNAME;

  @Value("${GOV_BC_AGRI_DB_PASSWORD}")
  private String PASSWORD;

  @Bean("primaryDatabase")
  public ComboPooledDataSource dataSource() {

    ComboPooledDataSource cpds = new ComboPooledDataSource();

    try {
      cpds.setDriverClass("org.postgresql.Driver");
    } catch (
        PropertyVetoException e) {
      e.printStackTrace();
    }
    cpds.setJdbcUrl(this.URL);

    cpds.setUser(this.USERNAME);
    cpds.setPassword(this.PASSWORD);

    cpds.setMinPoolSize(10);
    cpds.setInitialPoolSize(10);
    cpds.setAcquireIncrement(10);
    cpds.setMaxPoolSize(50);

    return cpds;
  }
}
