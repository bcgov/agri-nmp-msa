# BC NMP Manure Spreading Advisory Tool

_Backend_ is a Spring boot app launched with `gradle bootRun`. It requires 5 environment variables to be set appropriately:

```
GOV_BC_AGRI_DB_URL="JDBC_POSTGRES_URL_HERE"
GOV_BC_AGRI_DB_USER="USERNAME_HERE"
GOV_BC_AGRI_DB_PASSWORD="PASSWORD_HERE"
GOV_BC_AGRI_OWM_APIKEY="OPEN_WEATHERMAP_APIKEY_HERE"
SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI="KEYCLOAK_BASE_REALM_URI_HERE"
```

_Frontend_ is launched with `npm install && npm run start`. It will retrieve data from the backend for display on a Leaflet map. Set `API_BASE` to the URL where the backend is deployed. For local development, no configuration is necessary.

```
API_BASE="URL_HERE"
```
