import { GET_DEVICE } from "./prom21";

/**
 * ##Get
 * @operatingSystem {string} Hệ điều hành ANDROID hay IOS
 * @deviceId {string} ID của thiết bị
 * @systemName {string}
 * @systemVersion {string} Phiên bản hệ điều hành
 */

const get = ({ success, fail }) => {
  if (!window?.GlobalConfig?.APP?.DeviceCheck) {
    success && success({ deviceId: "" });
  } else {
    GET_DEVICE()
      .then((response) => {
        if (response.success) {
          let DevicesOption = {};
          let Devices = response.data.split(",");
          for (let key of Devices) {
            let values = key.split(":");
            if (values.length === 1) {
              DevicesOption.operatingSystem = values[0];
            } else {
              DevicesOption[values[0]] = values[1];
            }
          }
          if (DevicesOption.MODEL) {
            DevicesOption.deviceId = DevicesOption.MODEL;
          }
          success && success(DevicesOption);
        } else {
          fail && fail(response.error || "Lỗi không xác định");
        }
      })
      .catch((err) => {
        success && success({ deviceId: "" });
      });
  }
};

const DeviceHelpers = { get };
export default DeviceHelpers;
