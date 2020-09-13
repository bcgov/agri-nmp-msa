import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';

const Navbar = (props) => {
  const { history } = props;

  const nav = (path, name) => ({
    path,
    name,
  });

  const navs = [
    nav('/admin/logs', 'Run Logs'),
    nav('/admin/stations', 'Weather Stations'),
    nav('/admin/page', 'Page Customization'),
  ];

  let [activeLink, setActiveLink] = useState(null);
  useEffect(() => {
    setActiveLink(history.location.pathname);
  }, [history.location.pathname]);

  return (
    <div className={'topNav nav'}>
      <ul>
        {navs.map((n) => (
          <li key={n.name}>
            <button
              className={activeLink === n.path ? 'active' : ''}
              onClick={() => history.push(n.path)}
              disabled={activeLink === n.path}
            >
              {n.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default withRouter(Navbar);
