export const iOS = () => {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].indexOf(navigator.platform) !== -1
  );
};

export const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const validURL = (str) => {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
};

export const checkSLDisabled = (prodid) => {
  const result = {
    Disabled: false,
    Text: "",
  };
  const SL = window?.GlobalConfig?.APP?.Prod?.SL;
  if (!SL || !prodid) return result;
  let index = SL.split(",").findIndex((x) => Number(x) === Number(prodid));
  if (index > -1) {
    result.Disabled = true;
    result.Text = "(*) Chỉ áp dụng mua 1 SP/DV.";
  }
  return result;
};

export const checkDevices = ({ Auth, deviceId }) =>
  new Promise((resolve, reject) => {
    //Auth.DeviceIDs
    if (window?.GlobalConfig?.APP?.DeviceCheck) {
      if (Auth.DeviceIDs && Auth.DeviceIDs === deviceId) {
        resolve("");
      } else {
        reject("Tài khoản của bạn đang đăng nhập tại thiết bị khác.");
      }
    } else {
      resolve("");
    }
  });
