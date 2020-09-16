package bc.gov.agri.services;

import bc.gov.agri.representations.PageCustomization;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/* create sequence page_customization_id;
 create table page_customization (id int not null primary key default nextval
 ('page_customization_id'), sidebar_markup text);
 insert into page_customization (sidebar_markup) values ('');
 alter table page_customization add column arm_link varchar(255) not null default 'http://example/?24={24}&72={72}';
 alter table page_customization add column enable_weather_link bool not null default false;
 */

@Service
@Transactional
public class PageCustomizationService {

  @Autowired JdbcTemplate template;

  public PageCustomization getPageCustomization() {
    PageCustomization pc = new PageCustomization();

    template.query(
        "select sidebar_markup, arm_link, enable_weather_link from page_customization limit 1",
        row -> {
          pc.setSidebarMarkup(row.getString(1));
          pc.setArmLink(row.getString(2));
          pc.setEnableWeatherLink(row.getBoolean(3));
        });

    return pc;
  }

  public void updatePageCustomization(PageCustomization pc) {
    template.update(
        "update page_customization set sidebar_markup = ?, arm_link=?, enable_weather_link=?",
        pc.getSidebarMarkup(),
        pc.getArmLink(),
        pc.getEnableWeatherLink());
  }
}
