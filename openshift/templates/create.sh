#!/bin/sh

if [[ -z "${GOOGLE_ANALYTICS_PROPERTY}"  || -z "${OWM_APIKEY}" || -z "${ENV_NAME}" || -z "${JWT_ISSUER_URI}" || -z "${KEYCLOAK_URL}" || -z "${KEYCLOAK_REALM}" ]]
then
      echo "Please set required environment vars before running"
      exit 2
fi

DATABASE_PASSWORD=`openssl rand -base64 40 |  tr -cd '[:alpha:]' |  head -c 20`
DATABASE_REPLICATION_PASSWORD=`openssl rand -base64 40 |  tr -cd '[:alpha:]' |  head -c 20`
DATABASE_ROOT_PASSWORD=`openssl rand -base64 40 |  tr -cd '[:alpha:]' |  head -c 20`

#oc create configmap envoy-config --from-file=envoy-config.yaml
#oc process -f ./envoy.yaml CPU_REQUEST=100m CPU_LIMIT=500m MEMORY_REQUEST=500M MEMORY_LIMIT=1G ENV_NAME=${ENV_NAME}
oc process -f ./secrets.yaml ENV_NAME=${ENV_NAME} GOOGLE_ANALYTICS_PROPERTY=${GOOGLE_ANALYTICS_PROPERTY}  OWM_APIKEY=${OWM_APIKEY} DATABASE_PASSWORD=${DATABASE_PASSWORD} DATABASE_REPLICATION_PASSWORD=${DATABASE_REPLICATION_PASSWORD} DATABASE_ROOT_PASSWORD=${DATABASE_ROOT_PASSWORD} JWT_ISSUER_URI=${JWT_ISSUER_URI} KEYCLOAK_REALM=${KEYCLOAK_REALM} KEYCLOAK_URL=${KEYCLOAK_URL} BACKEND_SPRING_PROFILES="${BACKEND_SPRING_PROFILES}"
# oc process -f ./postgres-crunchy.yaml CPU_REQUEST=100m CPU_LIMIT=500m MEMORY_REQUEST=1100M MEMORY_LIMIT=2G ENV_NAME=${ENV_NAME}
 #| oc apply -f -
#oc process -f ./backend-bc.yaml ENV_NAME=${ENV_NAME}
# | oc apply -f -
#oc process -f ./backend.yaml CPU_REQUEST=100m CPU_LIMIT=500m MEMORY_REQUEST=1100M MEMORY_LIMIT=2G ENV_NAME=${ENV_NAME}

#oc process -f ./postgres.yaml CPU_REQUEST=100m CPU_LIMIT=500m MEMORY_REQUEST=1100M MEMORY_LIMIT=2G | oc apply -f -
