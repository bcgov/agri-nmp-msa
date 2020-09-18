package bc.gov.agri.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.cors.CorsUtils;

@Configuration
@EnableWebSecurity
@Profile("dev")
public class DevSecurityConfig extends WebSecurityConfigurerAdapter {

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
        .cors()
        .and()
        .csrf()
        .disable()
        .authorizeRequests()
        .requestMatchers(CorsUtils::isPreFlightRequest)
        .permitAll()
        .antMatchers(HttpMethod.GET, "/v1/admin/dashboard")
        .authenticated()
        .antMatchers(HttpMethod.GET, "/v1/admin/stations")
        .authenticated()
        .antMatchers(HttpMethod.GET, "/v1/admin/stations/**")
        .authenticated()
        .antMatchers(HttpMethod.PUT, "/v1/admin/stations/**")
        .authenticated()
        .antMatchers(HttpMethod.POST, "/v1/page")
        .authenticated()
        .anyRequest()
        .permitAll()
        .and()
        .oauth2ResourceServer()
        .jwt();
  }


}
