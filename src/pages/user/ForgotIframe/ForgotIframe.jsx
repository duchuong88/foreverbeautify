import React from 'react';
import IframeResizer from 'react-iframe-resizer-super';

export default function ForgotIframe({ src }) {
    const iframeResizerOptions = {
        log: true,
        // autoResize: true,
        checkOrigin: false,
        // resizeFrom: 'parent',
        heightCalculationMethod: 'max',
        initCallback: () => { 
            alert('Please')
         },
        resizedCallback: () => { console.log('resized!'); },
    };
    return (
        <IframeResizer src={src} iframeResizerOptions={iframeResizerOptions} />
    )
}
