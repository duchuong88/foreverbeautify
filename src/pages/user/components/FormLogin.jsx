import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Link } from "framework7-react";
import {
  delete_cookie,
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
import DeviceHelpers from "../../../constants/DeviceHelpers";
import { checkDevices, iOS } from "../../../constants/helpers";
import NumberFormat from "react-number-format";

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, "The account must have at least 4 characters.")
    .required("Please enter account or phone number."),
  password: Yup.string().required("Please enter a password."),
});

function FormLogin({ f7, f7router }) {
  const [initialValues] = useState({
    username: getUserLoginStorage().username,
    password: getUserLoginStorage().password,
  });

  const loginMutation = useMutation({
    mutationFn: (body) =>
      UserService.login(body.username, body.password, body.deviceid),
  });

  const loginQRMutation = useMutation({
    mutationFn: (body) => UserService.QRCodeLogin(body.QRToken, body.deviceid),
  });

  const firebaseMutation = useMutation({
    mutationFn: (body) => UserService.authSendTokenFirebase(body),
  });

  const onSubmit = (values, { setErrors, setFieldValue }) => {
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
                  delete_cookie("PWD");
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
                  allowLeadingZeros={true}
                  className={clsx(
                    "input-customs",
                    errors.username &&
                      touched.username &&
                      "is-invalid solid-invalid"
                  )}
                  // thousandSeparator={true}
                  // thousandsGroupStyle="lakh"
                  //prefix={"+65"}
                  value={values.username}
                  placeholder="Phone number"
                  onValueChange={({ value }) => {
                    setFieldValue("username", value);
                  }}
                  onBlur={handleBlur}
                  name="username"
                  autoComplete="off"
                />
                {values.username && (
                  <div
                    className="clear-value"
                    onClick={() => {
                      delete_cookie("USN");
                      delete_cookie("PWD");
                      setFieldValue("username", "", false);
                    }}
                  >
                    <i className="las la-times"></i>
                  </div>
                )}
              </div>
              {errors.username && touched.username && (
                <div className="text-danger font-size-min mt-3px">
                  {errors.username}
                </div>
              )}
            </div>
            <div className="page-login__form-item">
              <div className="position-relative">
                <input
                  className={clsx(
                    "input-customs",
                    errors.password &&
                      touched.password &&
                      "is-invalid solid-invalid"
                  )}
                  type="password"
                  value={values.password}
                  name="password"
                  autoComplete="off"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Password"
                />
                {values.password && (
                  <div
                    className="clear-value"
                    onClick={() => {
                      delete_cookie("PWD");
                      setFieldValue("password", "", false);
                    }}
                  >
                    <i className="las la-times"></i>
                  </div>
                )}
              </div>
              {errors.password && touched.password && (
                <div className="text-danger font-size-min mt-3px">
                  {errors.password}
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
              {(window?.GlobalConfig?.SMSOTP ||
                !window?.GlobalConfig?.APP?.OnlyStaff) && (
                <div
                  className={clsx(
                    "d--f jc--sb mt-25px",
                    window?.GlobalConfig?.SMSOTP &&
                      !window?.GlobalConfig?.APP?.OnlyStaff
                      ? "jc--sb"
                      : "jc--c"
                  )}
                >
                   {/* {!window?.GlobalConfig?.APP?.OnlyStaff && (
                    <div>
                      <Link href="/forgot/">Forgot password?</Link>
                    </div>
                  )}*/}
                  {window?.GlobalConfig?.SMSOTP && (
                    <div>
                      <Link href="/login-otp/">Sign in with SMS</Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default FormLogin;
