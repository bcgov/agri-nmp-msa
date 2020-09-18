package bc.gov.agri.endpoints;

import bc.gov.agri.representations.PageCustomization;
import bc.gov.agri.services.PageCustomizationService;
import java.util.concurrent.TimeUnit;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

@RestController
@RequestMapping(value = "/v1/page")
@CrossOrigin(origins = "*")
public class Page {

  private final PageCustomizationService service;

  public Page(PageCustomizationService service) {
    this.service = service;
  }

  @RequestMapping(value = {"/", ""}, method = RequestMethod.GET)
  public ResponseEntity<PageCustomization> pageCustomization(WebRequest request) {
    //@todo check modification time
    return ResponseEntity
        .ok()
        .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS))
        .body(service.getPageCustomization());
  }

  @RequestMapping(value = {"/", ""}, method = RequestMethod.POST)
  @ResponseStatus(HttpStatus.ACCEPTED)
  public void pageCustomization(@RequestBody PageCustomization pageCustomization) {
    service.updatePageCustomization(pageCustomization);
  }
}
