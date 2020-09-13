import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CONFIG from '../../shared/config';
import MarkupEditor from '../components/markup_editor';

const PageCustomization = () => {

  const [pageCustomization, setPageCustomization] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const promises = [

      axios.get(`${CONFIG.API_BASE}/v1/page`).then((response) => {
        setPageCustomization(response.data);
      }),

    ];
    Promise.all(promises).then(() => {
      setLoaded(true);
    });
  }, []);

  const onSave = (value) => {
    axios.post(`${CONFIG.API_BASE}/v1/page`, {
      sidebarMarkup: value,
    });

  };

  if (loaded) {
    return (
      <div>
        <MarkupEditor markup={pageCustomization.sidebarMarkup} onSave={onSave} />
      </div>
    );
  }
  return <p>loading</p>;
};

export default PageCustomization;
