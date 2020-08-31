package bc.gov.agri.endpoints;

import bc.gov.agri.representations.PrecipitationGroup;
import bc.gov.agri.services.PrecipitationGroupsService;
import java.util.List;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/v1/groups")
public class PrecipitationGroups {

  final private PrecipitationGroupsService service;

  public PrecipitationGroups(PrecipitationGroupsService service) {
    this.service = service;
  }

  @RequestMapping(value = "/", method = RequestMethod.GET)
  public String allGroups() {
    return service.getAll();
  }

  @RequestMapping(value = "/j", method = RequestMethod.GET)
  public List<PrecipitationGroup> jsonGroups() {
    return service.getGroups();
  }
}
