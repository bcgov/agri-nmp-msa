import Keycloak from 'keycloak-js';
import React, { useEffect, useState } from 'react';

const KeycloakContext = React.createContext({});

/* globals _KEYCLOAK_REALM, _KEYCLOAK_CLIENT_ID, _KEYCLOAK_URL */

const AuthRequired = (props) => {
    const { children } = props;

    const [authenticated, setAuthenticated] = useState(false);

    const [keycloakInstance] = useState(Keycloak(
      {
        clientId: _KEYCLOAK_CLIENT_ID,
        realm: _KEYCLOAK_REALM,
        url: _KEYCLOAK_URL,
      }));
    useEffect(() => {
      keycloakInstance.init(
        {
          checkLoginIframe: false,
          onLoad: 'check-sso',
        },
      ).then((auth) => {
        setAuthenticated(auth);
      });
    }, []);

    const signin = () => {
      keycloakInstance.login();
    };

    if (authenticated) {
      return (
        <KeycloakContext.Provider value={keycloakInstance}>
          {children}
        </KeycloakContext.Provider>
      );
    }

    return (
      <div className={'authRequired'}>
        <h1>Administration Console</h1>

        <p>Authentication is required to access this resource.</p>
        <button
          id={'loginButton'}
          onClick={() => {
            signin();
          }}
        >
          Authenticate
        </button>

      </div>
    );
  }
;

export default AuthRequired;
export { KeycloakContext };
