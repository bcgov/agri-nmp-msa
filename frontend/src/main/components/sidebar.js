import React, { useContext } from 'react';
import { PageCustomizationContext } from '../page';

const Sidebar = () => {

  const pageCustomization = useContext(PageCustomizationContext);

  return (
    <div id="sidebar">
      <div id="sidebar-internal">
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: pageCustomization.sidebarMarkup }} />
      </div>
    </div>
  );
};

export default Sidebar;
