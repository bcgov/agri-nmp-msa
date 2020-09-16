import Keycloak from 'keycloak-js';
import React, { useEffect, useState } from 'react';

const KeycloakContext = React.createContext({});

const AuthRequired = (props) => {
    const { children } = props;

    const [authenticated, setAuthenticated] = useState(false);

    const [keycloakInstance] = useState(Keycloak({
        clientId: 'nmp',
        realm: 'msa',
        url: 'http://localhost:8080/auth',
        flow: 'implicit',
      })
    );

    useEffect(() => {
      keycloakInstance.init(
        {
          checkLoginIframe: false,
          onLoad: 'check-sso',
          flow: 'implicit',
        }
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
      <p>Click to <a onClick={() => {
        signin();
      }}
      >signin
      </a>
      </p>
    );
  }
;

export default AuthRequired;
export { KeycloakContext };
