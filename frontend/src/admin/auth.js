import Keycloak from 'keycloak-js';
import React, { useContext, useEffect, useState } from 'react';
import { ConfigContext } from './context';

const KeycloakContext = React.createContext({});

const AuthRequired = (props) => {
  const { children } = props;
  const CONFIG = useContext(ConfigContext);

  const [authenticated, setAuthenticated] = useState(false);

  const [keycloakInstance] = useState(Keycloak(
    {
      url: CONFIG.KEYCLOAK_URL,
      realm: CONFIG.KEYCLOAK_REALM,
      sslRequired: "external",
      resource: CONFIG.KEYCLOAK_CLIENT_ID,
      publicClient: true,
      confidentialPort: 0,
      realmPublicKey: CONFIG.KEYCLOAK_PUBLIC_KEY,
      clientId: CONFIG.KEYCLOAK_CLIENT_ID,
    },
  ));

  useEffect(() => {
    keycloakInstance.init(
      {
        checkLoginIframe: false,
        onLoad: 'check-sso',
        pkceMethod: 'S256'
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
    <div className="authRequired">
      <h1>Administration Console</h1>

      <p>Authentication is required to access this resource.</p>
      <button
        id="loginButton"
        onClick={() => {
          signin();
        }}
      >
        Authenticate
      </button>

    </div>
  );
};
export default AuthRequired;
export { KeycloakContext };
