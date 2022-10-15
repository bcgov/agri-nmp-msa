# BC NMP Manure Spreading Advisory Tool

## Local setup

### Running each component separately

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

### Docker

Docker can also be used to run NMP-MSA locally.

Set the environment variables by creating a copy of `.env.sample` and renaming it to `.env`, modifying values as appropriate (an external Keycloak server and OpenWeatherMap API key are required).

Run `docker-compose up`. After a few minutes, the application will be available at http://localhost:5001 with the admin console at http://localhost:5001/admin.

## CI/CD pipeline

As all three NMP projects share the same namespace on OpenShift, they share a similar deployment process.

Image builds are automatically triggered via GitHub webooks, whenever there is a push or PR merge to the main branch. A Tekton pipeline then performs image promotion, auto-deploying the build to DEV. 

Deploying to TEST and PROD are done by manually starting the `promote-test-nmp-msa` and `promote-prod-nmp-msa` pipelines respectively. This can be done in the OpenShift web conosle, under **Pipelines** > **Pipelines** in the tools namespace, and clicking "Start" for the respective pipeline.

To rollback PROD to the previous build, run the `undo-last-promote-prod-nmp-msa` pipeline.
