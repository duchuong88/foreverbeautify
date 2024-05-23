import React, { useEffect, useRef, useState } from "react";
import Dom7 from "dom7";
import IframeComm from "react-iframe-comm";
import { getStockIDStorage, getUser } from "../../../constants/user";
import { SERVER_APP } from "../../../constants/config";

window.Info = {
  User: getUser(),
  Stocks: [],
  CrStockID: getStockIDStorage(),
};

function IframeWheel({ f7 }) {
  useEffect(() => {
    var $ = Dom7;
    if ($(".dialog-preloader").length === 0) {
      f7.dialog.preloader("Loading rotation ... ");
    }
  }, []);

  return (
    <IframeComm
      attributes={{
        src: `${SERVER_APP}/vong-quay-may-man?v=${new Date().valueOf()}`,
        width: "100%",
        height: "100%",
        frameBorder: 0,
        display: "block",
      }}
      postMessageData={JSON.stringify({
        Info: getUser(),
      })}
      handleReady={() => {
        f7.dialog.close();
      }}
    />
  );
}

export default IframeWheel;
