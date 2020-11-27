package bc.gov.agri.config;

import bc.gov.agri.utilities.DateSerializer;
import bc.gov.agri.utilities.LocalDateSerializer;
import java.time.LocalDate;
import java.util.Date;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

@Configuration
public class ObjectMapperConfig {

  @Bean
  Jackson2ObjectMapperBuilder objectMapperBuilder() {
    Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder();

    builder.serializerByType(Date.class, new DateSerializer());
    builder.serializerByType(LocalDate.class, new LocalDateSerializer());

    return builder;
  }

}
