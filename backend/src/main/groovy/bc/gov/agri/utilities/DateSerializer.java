package bc.gov.agri.utilities;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import java.io.IOException;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public class DateSerializer extends JsonSerializer<Date> {

  @Override
  public void serialize(
      final Date value, final JsonGenerator gen, final SerializerProvider serializers)
      throws IOException {

    gen.writeString(DateTimeFormatter.ISO_LOCAL_DATE_TIME
        .withZone(ZoneId.of("America/Vancouver"))
        .format(value.toInstant()));

  }
}
