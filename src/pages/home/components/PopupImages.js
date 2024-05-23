import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import NewsDataService from "../../../service/news.service";
import { SERVER_APP } from "../../../constants/config";
import { getUser } from "../../../constants/user";
import userService from "../../../service/user.service";

window.PopUpVQMM = localStorage.getItem("_vqmm") || true;

function PopupImages({ f7 }) {
  const [data, setData] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    NewsDataService.getBannerName("APP.POPUP").then(({ data }) => {
      if (window?.GlobalConfig?.vong_quay_may_man) {
        if (data && data.data && data.data.length > 0) {
          if (getUser() && window.PopUpVQMM) {
            let { ID } = getUser();
            let res = data.data[0];
            userService
              .checkAuthenVQMM({
                Title: "",
                MemberID: ID || "",
              })
              .then(({ data }) => {
                setData(res);
                if (!data?.contact) {
                  setData(res);
                  setVisible(true);
                } else {
                  localStorage.setItem("_vqmm", false);
                }
              });
          }
        }
      } else {
        if (data && data.data && data.data.length > 0) {
          setData(data.data[0]);
          setVisible(true);
          localStorage.removeItem("_vqmm")
        }
      }
    });
  }, []);

  const onClose = () => {
    setVisible(false);
    // window.hasPopup = true;
  };

  const handleUrl = (item) => {
    if (!item) {
      onClose();
    } else {
      f7.views.main.router.navigate(item.Link);
      onClose();
    }
  };

  if (!visible || window.hasPopup) return <></>;

  return createPortal(
    <div
      className="d--f ai--c jc--c"
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        zIndex: "10000",
        top: 0,
        left: 0,
      }}
    >
      <div className="actions-backdrop backdrop-in" onClick={onClose}></div>
      <div
        style={{
          position: "relative",
          zIndex: "120000",
          maxWidth: "75%",
        }}
        onClick={() => handleUrl(data)}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{
            cursor: "pointer",
            userSelect: "none",
            lineHeight: 40,
            height: 30,
            width: 30,
            display: "flex",
            WebkitBoxAlign: "center",
            alignItems: "center",
            WebkitBoxPack: "center",
            justifyContent: "center",
            position: "absolute",
            boxSizing: "border-box",
            background: "rgb(239, 239, 239)",
            top: "-10px",
            right: "-10px",
            borderRadius: 20,
            border: "3px solid rgb(239, 239, 239)",
          }}
        >
          <svg
            viewBox="0 0 16 16"
            stroke="#EE4D2D"
            style={{
              width: "16px",
              height: "16px",
              stroke: "rgba(0, 0, 0, 0.5)",
              strokeWidth: "2px",
            }}
          >
            <path strokeLinecap="round" d="M1.1,1.1L15.2,15.2" />
            <path strokeLinecap="round" d="M15,1L0.9,15.1" />
          </svg>
        </div>
        <img
          className="w-100"
          src={SERVER_APP + "/Upload/image/" + data.FileName}
          alt={data.Title}
        />
      </div>
    </div>,
    document.getElementById("framework7-root")
  );
}

export default PopupImages;
