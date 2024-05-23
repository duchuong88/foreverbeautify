import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Link } from "framework7-react";
import {
  getUserLoginStorage,
  setStockIDStorage,
  setStockNameStorage,
  setUserLoginStorage,
  setUserStorage,
} from "../../../constants/user";
import clsx from "clsx";
import { useMutation } from "react-query";
import UserService from "../../../service/user.service";
import { OPEN_QRCODE, SEND_TOKEN_FIREBASE } from "../../../constants/prom21";
import { setSubscribe } from "../../../constants/subscribe";
import { toast } from "react-toastify";
import { ref, set } from "firebase/database";
import { database } from "../../../firebase/firebase";
import PickerVerify from "./PickerVerify";
import NumberFormat from "react-number-format";
import DeviceHelpers from "../../../constants/DeviceHelpers";
import { iOS } from "../../../constants/helpers";

const phoneRegExp = /((09|03|07|08|05)+([0-9]{8})\b)/g;

const loginSchema = Yup.object().shape({
  phone: Yup.string()
    .required("Please enter the phone number.")
    .matches(phoneRegExp, "invalid phone number."),
});

function FormLoginSMS({ f7, f7router }) {
  const [initialValues] = useState({
    phone: "",
  });

  const loginMutation = useMutation({
    mutationFn: (body) => UserService.login(body.username, body.password),
  });

  const loginTokenMutation = useMutation({
    mutationFn: (body) => UserService.getInfo(body.Token, body.deviceid),
  });

  const loginQRMutation = useMutation({
    mutationFn: (body) => UserService.QRCodeLogin(body.QRToken, body.deviceid),
  });

  const firebaseMutation = useMutation({
    mutationFn: (body) => UserService.authSendTokenFirebase(body),
  });

  const sendOTPMutation = useMutation({
    mutationFn: (body) => UserService.sendStringee(body),
  });

  const existPhoneMutation = useMutation({
    mutationFn: async (body) => {
      let { data } = await UserService.existPhone(body.phone);
      return data?.data;
    },
  });

  const onSubmit = (values, { setFieldError, open }) => {
    if (window?.GlobalConfig?.SMSOTP) {
      f7.dialog.preloader("Sending OTP ...");
      existPhoneMutation.mutate(
        { phone: values.phone },
        {
          onSettled: (data) => {
            if (data && data.length === 1) {
              sendOTPMutation.mutate(
                { phone: values.phone },
                {
                  onSettled: ({ data }) => {
                    if (data.ID) {
                      f7.dialog.close();
                      new Promise((resolve, reject) => {
                        open({ Phone: values.phone, resolve });
                      }).then(({ login }) => {
                        if (login) {
                          f7.preloader.show();
                          DeviceHelpers.get({
                            success: ({ deviceId }) => {
                              loginTokenMutation.mutate(
                                { Token: login.token, deviceid: deviceId },
                                {
                                  onSettled: ({ data }) => {
                                    if (data.error || data?.Status === -1) {
                                      if (
                                        data.error ===
                                        "Unlicensed device"
                                      ) {
                                        f7.preloader.hide();
                                        f7.dialog.alert(
                                          "Your account is logged in on another device."
                                        );
                                      } else {
                                        toast.error(
                                          data?.Status === -1
                                            ? "Your account has been disabled."
                                            : data.error,
                                          {
                                            position: toast.POSITION.TOP_LEFT,
                                            autoClose: 3000,
                                          }
                                        );
                                        f7.preloader.hide();
                                      }
                                    } else {
                                      setUserStorage(login?.token, login);
                                      login?.ByStockID &&
                                        setStockIDStorage(login?.ByStockID);
                                      login?.StockName &&
                                        setStockNameStorage(login?.StockName);
                                      SEND_TOKEN_FIREBASE().then(
                                        async ({ error, Token }) => {
                                          if (!error && Token) {
                                            firebaseMutation.mutate(
                                              {
                                                Token: Token,
                                                ID: login?.ID,
                                                Type: login?.acc_type,
                                              },
                                              {
                                                onSettled: () => {
                                                  f7.preloader.hide();
                                                  f7router.navigate("/", {
                                                    animate: true,
                                                    transition: "f7-flip",
                                                  });
                                                },
                                              }
                                            );
                                          } else {
                                            setSubscribe(login, () => {
                                              f7.preloader.hide();
                                              f7router.navigate("/", {
                                                animate: true,
                                                transition: "f7-flip",
                                              });
                                            });
                                          }
                                        }
                                      );
                                    }
                                  },
                                }
                              );
                            },
                          });
                        }
                      });
                    }
                  },
                }
              );
            } else {
              f7.dialog.close();
              setFieldError("phone", "Phone number is not registered.");
            }
          },
        }
      );
    } else {
      f7.preloader.show();
      DeviceHelpers.get({
        success: ({ deviceId }) => {
          loginMutation.mutate(
            { ...values, deviceid: deviceId },
            {
              onSettled: ({ data }) => {
                if (data.error || data?.Status === -1) {
                  if (data.error === "Unlicensed device") {
                    f7.preloader.hide();
                    f7.dialog.alert(
                      "Your account is logged in on another device."
                    );
                  } else {
                    setErrors({
                      username:
                        data?.Status === -1
                          ? "Your account has been disabled."
                          : "Account & password are incorrect.",
                    });
                    setFieldValue("password", "", false);
                    f7.preloader.hide();
                  }
                } else {
                  setUserStorage(data.token, data);
                  setUserLoginStorage(values.username, values.password);
                  data?.ByStockID && setStockIDStorage(data.ByStockID);
                  data?.StockName && setStockNameStorage(data.StockName);
                  SEND_TOKEN_FIREBASE().then(async ({ error, Token }) => {
                    if (!error && Token) {
                      firebaseMutation.mutate(
                        {
                          Token: Token,
                          ID: data.ID,
                          Type: data.acc_type,
                        },
                        {
                          onSettled: () => {
                            f7.preloader.hide();
                            f7router.navigate("/", {
                              animate: true,
                              transition: "f7-flip",
                            });
                          },
                        }
                      );
                    } else {
                      setSubscribe(data, () => {
                        f7.preloader.hide();
                        f7router.navigate("/", {
                          animate: true,
                          transition: "f7-flip",
                        });
                      });
                    }
                  });
                }
              },
            }
          );
        },
      });
    }
  };

  const onLoginQR = () => {
    OPEN_QRCODE().then((value) => {
      let QRValue = value?.data || "";
      let QRSplit = QRValue.split('"');
      if (iOS()) {
        QRValue = QRSplit[1];
      }

      const QRToken = QRValue.split("&")[0];
      const QRStocks = QRValue.split("&")[1];

      f7.dialog.preloader(`Processing ...`);
      DeviceHelpers.get({
        success: ({ deviceId }) => {
          loginQRMutation.mutate(
            { QRToken, deviceid: deviceId },
            {
              onSettled: ({ data }) => {
                if (data.error || data?.Status === -1) {
                  if (data.error === "Unlicensed device") {
                    f7.dialog.close();
                    f7.dialog.alert(
                      "Your account is logged in on another device."
                    );
                  } else {
                    toast.error(
                      data?.Status === -1
                        ? "Your account has been disabled."
                        : "The QR Code is invalid or has expired.",
                      {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 3000,
                      }
                    );
                    f7.dialog.close();
                  }
                } else {
                  setUserStorage(data.token, data);
                  data?.ByStockID && setStockIDStorage(data.ByStockID);
                  data?.StockName && setStockNameStorage(data.StockName);
                  SEND_TOKEN_FIREBASE().then(async ({ error, Token }) => {
                    if (!error && Token) {
                      firebaseMutation.mutate(
                        {
                          Token: Token,
                          ID: data.ID,
                          Type: data.acc_type,
                        },
                        {
                          onSettled: () => {
                            set(
                              ref(database, `/qrcode/${QRStocks}/${QRToken}`),
                              null
                            ).then(() => {
                              if (data?.acc_type === "M") {
                                setUserLoginStorage(data?.MobilePhone, null);
                              }
                              f7.dialog.close();
                              f7router.navigate("/", {
                                animate: true,
                                transition: "f7-flip",
                              });
                            });
                          },
                        }
                      );
                    } else {
                      setSubscribe(data, () => {
                        set(
                          ref(
                            database,
                            `/qrcode/${qrcodeStock}/${qrcodeLogin}`
                          ),
                          null
                        ).then(() => {
                          f7.dialog.close();
                          f7router.navigate("/", {
                            animate: true,
                            transition: "f7-flip",
                          });
                        });
                      });
                    }
                  });
                }
              },
            }
          );
        },
      });
    });
  };

  return (
    <PickerVerify f7={f7}>
      {({ open }) => (
        <Formik
          initialValues={initialValues}
          onSubmit={(values, formikProps) =>
            onSubmit(values, { ...formikProps, open })
          }
          enableReinitialize={true}
          validationSchema={loginSchema}
        >
          {(formikProps) => {
            const {
              values,
              touched,
              errors,
              handleChange,
              handleBlur,
              setFieldValue,
            } = formikProps;

            return (
              <Form>
                <div className="title">Log in to your account</div>
                <div className="page-login__form-item">
                  <div className="position-relative">
                    <NumberFormat
                      autoComplete="off"
                      name="phone"
                      className={clsx(
                        "input-customs",
                        errors.phone &&
                          touched.phone &&
                          "is-invalid solid-invalid"
                      )}
                      value={values.phone}
                      thousandSeparator={false}
                      placeholder="Phone number"
                      onValueChange={(val) => {
                        setFieldValue("phone", val.value);
                      }}
                      allowLeadingZeros
                    />
                    {values.phone && (
                      <div
                        className="clear-value"
                        onClick={() => {
                          setFieldValue("phone", "", false);
                        }}
                      >
                        <i className="las la-times"></i>
                      </div>
                    )}
                  </div>
                  {errors.phone && touched.phone && (
                    <div className="text-danger font-size-min mt-3px">
                      {errors.phone}
                    </div>
                  )}
                </div>
                <div className="page-login__form-item">
                  <button
                    type="submit"
                    className={clsx(
                      "btn-login btn-me",
                      loginMutation.isLoading && "loading"
                    )}
                  >
                    <span>Log in</span>
                  </button>
                  {!window?.GlobalConfig?.APP?.OnlyStaff && (
                    <>
                      <div className="or">
                        <button
                          className="btn-qr"
                          type="button"
                          onClick={onLoginQR}
                        >
                          <i className="las la-qrcode"></i>
                        </button>
                      </div>
                    </>
                  )}
                  <div
                    className={clsx(
                      "d--f mt-25px",
                      !window?.GlobalConfig?.APP?.OnlyStaff ? "jc--sb" : "jc--c"
                    )}
                  >
                    {!window?.GlobalConfig?.APP?.OnlyStaff && (
                      <div>
                        <Link href="/forgot/">Forgot password?</Link>
                      </div>
                    )}
                    <div>
                      <Link href="/login/">Log in with your account</Link>
                    </div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
    </PickerVerify>
  );
}

export default FormLoginSMS;
