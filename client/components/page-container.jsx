import React from 'react';

export default function PageContainer({ children }) {
  return (
    <div className="color-main-blue">
      <div className="container min-height">
        {children}
      </div>
    </div>
  );
}
