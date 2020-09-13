package bc.gov.agri.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.cors.CorsUtils;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
        .authorizeRequests()
        .requestMatchers(CorsUtils::isPreFlightRequest)
        .permitAll()
        .anyRequest()
        .permitAll()
        .and()
        .csrf()
        .disable();

    //        .authenticated()
    //        .and()
    //        .httpBasic();
  }

}
