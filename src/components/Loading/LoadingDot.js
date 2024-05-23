import React from 'react';

function LoadingDot(props) {
    return (
      <div className="loading-dot">
        <div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
        <div className="list-shadow">
          <div className="shadow"></div>
          <div className="shadow"></div>
          <div className="shadow"></div>
        </div>
      </div>
    );
}

export default LoadingDot;