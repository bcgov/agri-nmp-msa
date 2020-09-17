import axios from 'axios';
import Keycloak from 'keycloak-js';
import React, { useEffect, useState } from 'react';

const KeycloakContext = React.createContext({});

const AuthRequired = (props) => {
    const { children } = props;

    const [authenticated, setAuthenticated] = useState(false);

    const [keycloakInstance] = useState(Keycloak(
      {
        clientId: window.KEYCLOAK_CLIENT_ID,
        realm: window.KEYCLOAK_REALM,
        url: window.KEYCLOAK_URL,
        flow: 'implicit',
      }));
    useEffect(() => {
      keycloakInstance.init(
        {
          checkLoginIframe: false,
          onLoad: 'check-sso',
          flow: 'implicit',
        },
      ).then((auth) => {
        setAuthenticated(auth);
      });
    }, []);

    const signin = () => {
      keycloakInstance.login();
    };

    useEffect(() => {
      console.dir('authentication state changed');
      if (keycloakInstance.authenticated) {
        axios.defaults.headers.common.authorization = `Bearer ${keycloakInstance.idToken}`;
        console.dir(axios.defaults.headers);
      }
    }, [authenticated]);

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
