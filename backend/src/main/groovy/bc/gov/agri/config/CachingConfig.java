package bc.gov.agri.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import java.util.Arrays;
import java.util.concurrent.TimeUnit;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CachingConfig {

  @Bean
  public CacheManager cacheManager() {
    SimpleCacheManager cacheManager = new SimpleCacheManager();
    cacheManager.setCaches(Arrays.asList(new CaffeineCache("geojson",
            Caffeine.newBuilder().expireAfterWrite(6, TimeUnit.HOURS).maximumSize(5).build()),
        new CaffeineCache("settings",
            Caffeine.newBuilder().expireAfterWrite(24, TimeUnit.HOURS).maximumSize(5).build())));
    return cacheManager;
  }
}
