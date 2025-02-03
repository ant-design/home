import React from 'react';

type WrapperProps = {
  name: string;
};

const wrapperStyle = {
  border: '1px solid #ddd',
  margin: '20px',
  padding: '20px',
  borderRadius: '10px'
}

const Wrapper: React.FC<React.PropsWithChildren<WrapperProps>> = ({
  name,
  children
}) => {
  return (
    <div style={wrapperStyle}>
      <h1 style={{color: 'orange'}}>{name}</h1>
      {children}
    </div>
  );
};

export const Item: React.FC<React.PropsWithChildren<{title?: string, block?: boolean}>> = ({ children, title }) => {
  return <div style={{margin: '20px', textAlign: 'center', border: '1px dashed #ddd', padding: '0 40px 40px'}}>
    <h3 style={{color: '#f76256', padding: '10px 0'}}>{title} Components</h3>
    {children}
  </div>;
};

export default Wrapper;