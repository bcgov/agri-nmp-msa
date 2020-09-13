package bc.gov.agri.services;

import bc.gov.agri.representations.PageCustomization;
import bc.gov.agri.representations.RunLog;
import java.util.LinkedList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// create sequence page_customization_id;
// create table page_customization (id int not null primary key default nextval
//('page_customization_id'), sidebar_markup text);

@Service
@Transactional
public class PageCustomizationService {

  @Autowired JdbcTemplate template;

  public PageCustomization getPageCustomization() {
    PageCustomization pc = new PageCustomization();

    template.query("select sidebar_markup from page_customization limit 1", row -> {
      pc.setSidebarMarkup(row.getString(1));
    });

    return pc;
  }

  public void updatePageCustomization(PageCustomization pc) {
    template.update("update page_customization set sidebar_markup = ?", pc.getSidebarMarkup());
  }
}
