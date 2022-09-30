/* global _CONFIG_SOURCE */
/* global _API_BASE */
/* globals _KEYCLOAK_REALM, _KEYCLOAK_CLIENT_ID, _KEYCLOAK_URL */

let CONFIG;

switch (_CONFIG_SOURCE) {
  case 'Caddy':
    CONFIG = {
      API_BASE: '{{env "API_BASE"}}',
      KEYCLOAK_CLIENT_ID: '{{env "KEYCLOAK_CLIENT_ID"}}',
      KEYCLOAK_REALM: '{{env "KEYCLOAK_REALM"}}',
      KEYCLOAK_URL: '{{env "KEYCLOAK_URL"}}',
    };
    break;

  case 'Hardcoded':
  default:
    CONFIG = {
      API_BASE: _API_BASE,
      KEYCLOAK_CLIENT_ID: _KEYCLOAK_CLIENT_ID,
      KEYCLOAK_REALM: _KEYCLOAK_REALM,
      KEYCLOAK_URL: _KEYCLOAK_URL,
    };
    break;
}

export { CONFIG };
