import React from 'react';

const Page = (props) => {

  const { title, children } = props;

  return (
    <div>
      {children}
    </div>
  );
};

export default Page;
