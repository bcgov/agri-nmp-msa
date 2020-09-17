import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Loading from '../../shared/components/loading';
import CONFIG from '../../shared/config';
import { KeycloakContext } from '../auth';
import MarkupEditor from '../components/markup_editor';

const PageCustomization = () => {
  const [statusText, setStatusText] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [state, setState] = useState({});
  const keycloak = useContext(KeycloakContext);

  useEffect(() => {


    keycloak.updateToken(30).then(() => {
      const authHeader = `Bearer ${keycloak.idToken}`;
      const promises = [
        axios.get(`${CONFIG.API_BASE}/v1/page`, { headers: { authorization: authHeader } }).then((response) => {
          setState(response.data);
        }),
      ];
      Promise.all(promises).then(() => {
        setLoaded(true);
        setStatusText('Loaded');
      });
    });
  }, []);

  const handleChange = (name) => (value) => {
    setDirty(true);
    setStatusText('Modified since last save');
    setState({
      ...state,
      [name]: value,
    });
  };

  const save = () => {
    setSaving(true);

    keycloak.updateToken(30).then(() => {
      const authHeader = `Bearer ${keycloak.idToken}`;

      axios.post(`${CONFIG.API_BASE}/v1/page`, state, { headers: { authorization: authHeader } }).then(() => {
        setSaving(false);
        setDirty(false);
        setStatusText('Saved');
      });
    });
  };

  if (loaded) {
    return (
      <div>
        <h2>Page Customization</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        >
          <h3>Sidebar Page Content</h3>
          <MarkupEditor markup={state.sidebarMarkup} onChange={handleChange('sidebarMarkup')} />
          <fieldset>
            <label htmlFor="armLink">
              <h3>ARM Worksheet Link</h3>
              <span className={'help'}>
                Clicking on the <strong>Field Assessment Worksheet</strong> link directs to this URL. The tokens <em>{'{24}'}</em> and <em>{'{72}'}</em> in the URL will be replaced with the corresponding 24 and 72-hour precipitation values for the given station and date.
              </span>
            </label>
            <input
              name="armLink"
              id="armLink"
              type="text"
              maxLength={255}
              onChange={(event) => {
                handleChange('armLink')(event.target.value);
              }}
              placeholder="http://host/?24={24}&72={72}"
              value={state.armLink}
            />

            <label htmlFor="enableWeatherLink">
              <h3>Show Weather Station Links</h3>
              <span className={'help'}>If checked, any station which has a weather station URL set will have the link displayed in the popup.</span>
            </label>
            <input
              name="enableWeatherLink"
              id="enableWeatherLink"
              type="checkbox"
              checked={state.enableWeatherLink}
              onChange={(event) => {
                handleChange('enableWeatherLink')(event.target.checked);
              }}
            />
          </fieldset>
          <button disabled={saving || !dirty} type="submit" className="btn">Save</button>
          <div className={'statusText'}>{statusText}</div>
        </form>
      </div>
    );
  }
  return (
    <Loading />
  );
};

export default PageCustomization;
