// Import React and ReactDOM
import React from 'react';
import ReactDOM from 'react-dom';

// Import Framework7
import Framework7 from 'framework7/framework7-lite.esm.bundle.js';

// Import Framework7-React Plugin
import Framework7React from 'framework7-react';

// Import Framework7 Styles
import 'framework7/css/framework7.bundle.css';

import 'react-perfect-scrollbar/dist/css/styles.css';

import "react-toastify/dist/ReactToastify.css";

// Import Icons and App Custom Styles
import '../css/icons.css';

import './../assets/libs/line-awesome-1.3.0/css/line-awesome.min.css';

// import './../assets/libs/font-awesome-pro/css/all.min.css';

import './../assets/libs/linearicons/svgembedder.min.js';

import './../css/plugins/animate.min.css';

import '../css/app.scss';

// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


// Import App Component
import App from '../components/app.jsx';

// Init F7 React Plugin
Framework7.use(Framework7React);

// Mount React App
ReactDOM.render(
    React.createElement(App),
    document.getElementById('app'),
);