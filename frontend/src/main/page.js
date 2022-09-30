import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import Loading from '../shared/components/loading';
import Sidebar from './components/sidebar';
import Msa from './pages/msa';
import {ConfigContext} from "./context";

const PageCustomizationContext = React.createContext({ sidebarMarkup: null });

const PageStructure = () => {
  const [pageCustomization, setPageCustomization] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const CONFIG = useContext(ConfigContext);

  useEffect(() => {
    axios.get(`${CONFIG.API_BASE}/v1/page`).then((response) => {
      setPageCustomization(response.data);
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return (<Loading />);
  }

  return (
    <PageCustomizationContext.Provider value={pageCustomization}>
      <div id="header">
        <img src="/images/gov3_bc_logo.png" width={155} height={52} alt="BC Government Logo" />
      </div>
      <Sidebar />
      <Msa />
    </PageCustomizationContext.Provider>
  );
};

export default PageStructure;
export { PageCustomizationContext };
