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

  private JwtAuthenticationConverter jwtAuthenticationConverter() {
    JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter =
        new JwtGrantedAuthoritiesConverter();
    jwtGrantedAuthoritiesConverter.setAuthoritiesClaimName("client_roles");
    jwtGrantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");
    JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
    jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
    return jwtAuthenticationConverter;
  }

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
        .hasRole("NMPAdmin")
        .antMatchers(HttpMethod.GET, "/v1/admin/stations")
        .hasRole("NMPAdmin")
        .antMatchers(HttpMethod.GET, "/v1/admin/stations/**")
        .hasRole("NMPAdmin")
        .antMatchers(HttpMethod.PUT, "/v1/admin/stations/**")
        .hasRole("NMPAdmin")
        .antMatchers(HttpMethod.POST, "/v1/page")
        .hasRole("NMPAdmin")
        .anyRequest()
        .permitAll()
        .and()
        .oauth2ResourceServer()
        .jwt();
        .jwtAuthenticationConverter(this.jwtAuthenticationConverter());
  }


}
