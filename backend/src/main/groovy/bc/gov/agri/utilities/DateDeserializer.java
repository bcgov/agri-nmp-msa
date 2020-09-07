package bc.gov.agri.utilities;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import java.io.IOException;
import java.util.Date;

public class DateDeserializer extends JsonDeserializer<Date> {
  @Override
  public Date deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
    return new Date(p.getLongValue() * 1000);
  }
}
