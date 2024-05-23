import { SERVER_APP } from "./config";
import { getToken } from "./user";

export const PHOTO_TO_SERVER = (_opt) => {
  var t = window.app21 || {};
  var opt = {
    maxwidth: 1500,
    maxheight: 1500,
    ext: "jpg",
    pref: "IMG",
    server: `${SERVER_APP}/api/v3/file?cmd=upload&autn=AAAA&token=${getToken()}`,
  };
  opt = Object.assign(opt, _opt);

  var cameraOpt = {
    maxwidth: 1500,
    maxheight: 1500,
    ext: "jpg",
    pref: "IMG",
  };

  for (var k in cameraOpt) {
    if (opt[k]) cameraOpt[k] = opt[k];
  }
  return new Promise((resolve, reject) => {
    t.prom("CAMERA", cameraOpt)
      .then((s) => {
        // console.log("CAMERA");
        // console.log(s);
        t.prom(
          "POST_TO_SERVER",
          JSON.stringify({
            server: opt.server,
            path: s.data,
            // token: 'neu_co',
          })
        )
          .then((s1) => {
            var rs = JSON.parse(s1.data);
            // console.log("POST_TO_SERVER");
            // console.log(rs);
            //console.log('app_camera->CAMERA->POST_TO_SERVER->OK', rs.data);
            // vm.$emit('success', rs.data);
            resolve(rs);
          })
          .catch((f1) => {
            // console.log("ERROR POST_TO_SERVER");
            // console.log(f1);
            reject({ title: "POST_TO_SERVER FAIL", error: f1 });
          });
      })
      .catch((e) => {
        // console.log("ERROR CAMERA");
        // console.log(e);
        reject({ title: "CAMERA FAIL", error: e });
      });
  });
};

export const CALL_PHONE = (phone) => {
  var t = window.app21 || {};
  if (typeof t.prom !== "undefined") {
    t.prom("TEL", phone);
  }
};

export const OPEN_LINK = (link) => {
  var t = window.app21 || {};
  if (typeof t.prom !== "undefined") {
    t.prom("BROWSER", link);
  }
};

export const SET_BADGE = (count) => {
  var t = window.app21 || {};
  if (typeof t.prom !== "undefined") {
    t.prom("SET_BADGE", count);
  }
};

export const REMOVE_BADGE = (count) => {
  var t = window.app21 || {};
  if (typeof t.prom !== "undefined") {
    t.prom("REMOVE_BADGE", count);
  }
};

export const OPEN_QRCODE = () => {
  var t = window.app21 || {};
  if (typeof t.prom !== "undefined") {
    return t.prom("OPEN_QRCODE");
  }
};

export const SEND_TOKEN_FIREBASE = () => {
  var t = window.app21 || {};
  if (typeof t.prom !== "undefined" && window?.GlobalConfig?.APP?.Version > 1) {
    return new Promise((resolve, reject) => {
      t.prom("KEY", JSON.stringify({ key: "FirebaseNotiToken" }))
        .then(({ data }) => {
          resolve({ Token: data });
        })
        .catch(({ error }) => {
          resolve({ error: error });
        });
    });
  } else {
    return new Promise((resolve, reject) => {
      resolve({ error: "Yêu cầu nâng cấp lên phiên bản mới nhất." });
    });
  }
};

export const CLOSE_APP = () => {
  var t = window.app21 || {};
  if (typeof t.prom !== "undefined") {
    return t.prom("FINISH_ACTIVITY");
  }
};

export const RELOAD_APP = () => {
  var t = window.app21 || {};
  if (typeof t.prom !== "undefined") {
    return t.prom("REBOOT");
  }
};

export const HIDE_STATUSBAR = () => {
  var t = window.app21 || {};
  if (typeof t.prom !== "undefined") {
    return t.prom("HIDE_STATUSBAR");
  }
};

export const GET_DEVICE = () => {
  var t = window.app21 || {};
  if (typeof t.prom !== "undefined") {
    return t.prom("GET_INFO");
  }
};
