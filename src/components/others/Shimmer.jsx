import React from 'react';

const Shimmer = () => {
  const shimmerStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: '#f6f7f8',
    backgroundImage: 'linear-gradient(90deg, #f6f7f8 0px, #edeef1 40px, #f6f7f8 80px)',
    backgroundSize: '200px 100%',
    backgroundRepeat: 'no-repeat',
    animation: 'shimmer 1.5s infinite linear',
    borderRadius: '4px',
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={shimmerStyle}></div>
      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: -200px 0;
            }
            100% {
              background-position: 200px 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Shimmer;
