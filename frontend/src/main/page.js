import React from 'react';

import axios from 'axios';
import { useEffect, useState } from 'react';
import CONFIG from '../shared/config';

const PageCustomizationContext = React.createContext({ sidebarMarkup: null });

const PageStructure = (props) => {
  const { children } = props;
  const [pageCustomization, setPageCustomization] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    axios.get(`${CONFIG.API_BASE}/v1/page`).then((response) => {
      setPageCustomization(response.data);
      setLoaded(true);

    });
  }, []);

  if (!loaded) {
    return (<p>Loading...</p>);
  }
  return (
    <PageCustomizationContext.Provider value={pageCustomization}>
      {children}
    </PageCustomizationContext.Provider>
  );

};

export default PageStructure;
export { PageCustomizationContext };
