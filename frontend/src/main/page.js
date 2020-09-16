import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CONFIG from '../shared/config';
import Loading from '../shared/components/loading';
import Sidebar from './components/sidebar';
import Msa from './pages/msa';

const PageCustomizationContext = React.createContext({ sidebarMarkup: null });

const PageStructure = () => {
  const [pageCustomization, setPageCustomization] = useState([]);
  const [loaded, setLoaded] = useState(false);

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
        <img src="/images/gov3_bc_logo.png" width={155} height={52} alt={'BC Government Logo'} />
      </div>
      <Sidebar />
      <Msa />
    </PageCustomizationContext.Provider>
  );

};

export default PageStructure;
export { PageCustomizationContext };
