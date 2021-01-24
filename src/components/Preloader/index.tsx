import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';
import './styles.scss'

function Preloader() {
  return (
    <div className="preloader">
      <CircularProgress />
    </div>
  );
}

export default Preloader;