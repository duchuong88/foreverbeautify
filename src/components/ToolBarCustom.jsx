import React from "react";
import {
    Link,
    Toolbar,
} from "framework7-react";

export default class ToolBarCustom extends React.Component {
    constructor() {
        super();
    }
    componentDidMount() {
        // var tabBar = $('.tab-bar');
        // var tabItems = $('.tab-bar .tab-item');
        // var tabIndicator = $('.tab-indicator');
        // var _this = $(this);
        // var distance = Math.floor(tabBar.find('.active').position().left + 5);
        // tabIndicator.css('transform', 'translateX(' + distance + 'px)');
        // tabItems.each(function () {
        //     $(this).on('click', function (e) {
        //         e.preventDefault();
        //         distance = Math.floor($(this).position().left + 5);
        //         tabIndicator.css('transform', 'translateX(' + distance + 'px)');
        //         tabItems.removeClass('active');
        //         $(this).addClass('active');
        //     });
        // });
    }
    render() {
        return (
            <div className="page-toolbar">
                <div className="tab-bar">
                    <div className="tab-indicator">
                        <div className="tab-indicator-left"></div>
                        <div className="tab-indicator-right"></div>
                    </div>
                    <a href="#" className="tab-item">
                        <div className="tab-item-inner">
                            <svg id="layout" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 115.79 115.8">
                                <rect fill="none" stroke="#000" strokeWidth="10" x="5" y="5" width="42.1" height="42.1" rx="3.29" ry="3.29" />
                                <rect fill="none" stroke="#000" strokeWidth="10" x="68.71" y="5.01" width="42.09" height="42.09" rx="3.29" ry="3.29" />
                                <rect fill="none" stroke="#000" strokeWidth="10" x="5" y="68.7" width="42.1" height="42.1" rx="3.29" ry="3.29" />
                                <rect fill="none" stroke="#000" strokeWidth="10" x="68.71" y="68.71" width="42.09" height="42.09" rx="3.29" ry="3.29" />
                            </svg>
                        </div>
                    </a>
                    <a href="#" className="tab-item">
                        <div className="tab-item-inner">
                            <svg id="list" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60.02 44.9">
                                <path fill="none" stroke="#000" strokeWidth="6" strokeLinecap="round" d="M16.82 3.63h40.2" />
                                <circle fill="none" stroke="#000" strokeWidth="6" cx="3.93" cy="3.93" r=".93" />
                                <path fill="none" stroke="#000" strokeWidth="6" strokeLinecap="round" d="M16.82 22.17h40.2" />
                                <circle fill="none" stroke="#000" strokeWidth="6" cx="3.93" cy="22.47" r=".93" />
                                <path fill="none" stroke="#000" strokeWidth="6" strokeLinecap="round" d="M16.82 40.67h40.2" />
                                <circle fill="none" stroke="#000" strokeWidth="6" cx="3.93" cy="40.97" r=".93" />
                            </svg>
                        </div>
                    </a>
                    <a href="#" className="tab-item active">
                        <div className="tab-item-inner">
                            <svg id="settings" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 116.21 116.03">
                                <path fill="none" stroke="#000" strokeWidth="10" d="M8.75 47.05A3.71 3.71 0 0 0 5 50.8v14.62a3.71 3.71 0 0 0 3.75 3.75h6.86a41.05 41.05 0 0 0 4.66 11.15l-4.76 4.76a3.75 3.75 0 0 0 0 5.3l10.33 10.33a3.77 3.77 0 0 0 5.31 0l4.84-4.85a43.85 43.85 0 0 0 11.15 4.57v6.86a3.71 3.71 0 0 0 3.75 3.75h14.62a3.71 3.71 0 0 0 3.75-3.75v-7a43.25 43.25 0 0 0 11.06-4.57l4.94 4.94a3.75 3.75 0 0 0 5.3 0l10.33-10.33a3.75 3.75 0 0 0 0-5.3l-4.94-4.94a43.25 43.25 0 0 0 4.57-11.06h7a3.71 3.71 0 0 0 3.75-3.75V50.71a3.71 3.71 0 0 0-3.75-3.75h-7a43.25 43.25 0 0 0-4.57-11.06l4.94-4.94a3.75 3.75 0 0 0 0-5.3L90.47 15.42a3.75 3.75 0 0 0-5.3 0l-4.85 4.85a47.63 47.63 0 0 0-11.15-4.65V8.75A3.71 3.71 0 0 0 65.42 5H50.8a3.71 3.71 0 0 0-3.75 3.75v6.87a43.85 43.85 0 0 0-11.15 4.57l-4.85-4.85a3.75 3.75 0 0 0-5.3 0L15.42 25.75a3.77 3.77 0 0 0 0 5.31l4.76 4.75a40.48 40.48 0 0 0-4.67 11.24z" />
                                <circle fill="none" stroke="#000" strokeWidth="10" cx="58.01" cy="58.72" r="22.64" />
                            </svg>
                        </div>
                    </a>
                    <a href="#" className="tab-item">
                        <div className="tab-item-inner">
                            <svg id="message" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 115.4 99.43">
                                <path fill="none" stroke="#000000" strokeWidth="10" strokeLinecap="round" d="M27.89 51.02h59.62M27.89 31.02h59.62" />
                                <path fill="none" stroke="#000000" strokeWidth="8" d="M15.52 92.85h12v12.25a3.72 3.72 0 0 0 2.09 3.35 3.46 3.46 0 0 0 1.63.37 4 4 0 0 0 2.27-.73l20-15.15h60.05a3.68 3.68 0 0 0 3.72-3.72V23.1a3.68 3.68 0 0 0-3.72-3.72h-98a3.68 3.68 0 0 0-3.76 3.72v66a3.73 3.73 0 0 0 3.72 3.75z" transform="translate(-6.8 -14.38)" />
                            </svg>
                        </div>
                    </a>
                    <a href="#" className="tab-item">
                        <div className="tab-item-inner">
                            <svg id="user" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 558.26 519.92">
                                <circle fill="none" stroke="#000" strokeWidth="40" cx="278.21" cy="149.21" r="129.21" />
                                <path fill="none" stroke="#000" strokeWidth="40" d="M180.56 350.92h197.15c80.82 0 147.36 71.13 157.71 149H22.85c10.35-77.38 76.89-149 157.71-149z" />
                            </svg>
                        </div>
                    </a>
                </div>
            </div>
        )
    }
}