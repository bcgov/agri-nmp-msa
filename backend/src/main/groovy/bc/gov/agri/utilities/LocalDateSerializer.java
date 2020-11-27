package bc.gov.agri.utilities;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public class LocalDateSerializer extends JsonSerializer<LocalDate> {

  @Override
  public void serialize(
      final LocalDate value, final JsonGenerator gen, final SerializerProvider serializers)
      throws IOException {
    gen.writeString(value.format(DateTimeFormatter.ISO_LOCAL_DATE.withZone(ZoneId.of(
        "America/Vancouver"))));

  }
}
