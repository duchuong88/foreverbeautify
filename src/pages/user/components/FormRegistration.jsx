import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import NumberFormat from "react-number-format";
import {
  getStockIDStorage,
  setStockIDStorage,
  setStockNameStorage,
  setUserLoginStorage,
  setUserStorage,
} from "../../../constants/user";
import clsx from "clsx";
import { useMutation } from "react-query";
import UserService from "../../../service/user.service";
import { SEND_TOKEN_FIREBASE } from "../../../constants/prom21";
import { setSubscribe } from "../../../constants/subscribe";
import { toast } from "react-toastify";
import PickerVerify from "./PickerVerify";
import DeviceHelpers from "../../../constants/DeviceHelpers";

const phoneRegExp = /\+65(6|8|9)\d{7}/g;

const regSchema = Yup.object().shape({
  fullname: Yup.string().min(4, "Full name must have at least 4 characters.").required("Please enter your full name."),
  password: Yup.string()
    .min(4, "Password must have at least 4 characters.")
    .required("Please enter a password."),
  phone: Yup.string()
    .required("Please enter the phone number.")
    .matches(phoneRegExp, "Invalid phone number."),
});

function FormRegistration({ f7, f7router, openSelectStock }) {
  
  const [initialValues] = useState({
    fullname: "",
    password: "",
    phone: "",
  });

  const loginMutation = useMutation({
    mutationFn: (body) =>
      UserService.login(body.username, body.password, body.deviceid),
  });

  const sendOTPMutation = useMutation({
    mutationFn: (body) => UserService.sendStringee(body),
  });

  const firebaseMutation = useMutation({
    mutationFn: (body) => UserService.authSendTokenFirebase(body),
  });

  const existPhoneMutation = useMutation({
    mutationFn: async (body) => {
      let { data } = await UserService.existPhone(body.phone);
      return data?.data;
    },
  });

  const regMutation = useMutation({
    mutationFn: (body) =>
      UserService.register(
        body.fullname,
        body.password,
        body.phone,
        body.stockid
      ),
  });

  const onSubmit = (values, { open, ...formikProps }) => {
    const CrStocks = getStockIDStorage();
    if (!CrStocks) {
      openSelectStock();
    } else {
      if (window?.GlobalConfig?.SMSOTP) {
        f7.dialog.preloader("Sending OTP ...");
        existPhoneMutation.mutate(
          { phone: values.phone },
          {
            onSettled: (data) => {
              if (!data || data.length === 0) {
                sendOTPMutation.mutate(
                  { phone: values.phone },
                  {
                    onSettled: ({ data }) => {
                      if (data.ID) {
                        f7.dialog.close();
                        new Promise((resolve, reject) => {
                          open({ Phone: values.phone, resolve });
                        }).then((result) => {
                          f7.preloader.show();
                          regMutation.mutate(
                            { ...values, stockid: CrStocks },
                            {
                              onSettled: ({ data }) => {
                                if (data.errors) {
                                  toast.error(data.error, {
                                    position: toast.POSITION.TOP_LEFT,
                                    autoClose: 3000,
                                  });
                                  f7.preloader.hide();
                                } else {
                                  toast.success("Sign Up Success.", {
                                    position: toast.POSITION.TOP_LEFT,
                                    autoClose: 500,
                                    onClose: () => {
                                      onLogin({
                                        username: values.phone,
                                        password: values.password,
                                      });
                                    },
                                  });
                                }
                              },
                            }
                          );
                        });
                      }
                    },
                  }
                );
              } else {
                f7.dialog.close();
                formikProps.setFieldError(
                  "phone",
                  "The phone number is already in use."
                );
              }
            },
          }
        );
      } else {
        f7.preloader.show();
        regMutation.mutate(
          { ...values, stockid: CrStocks },
          {
            onSettled: ({ data }) => {
              if (data.error) {
                toast.error(data.error, {
                  position: toast.POSITION.TOP_LEFT,
                  autoClose: 3000,
                });
                f7.preloader.hide();
              } else {
                toast.success("Sign Up Success.", {
                  position: toast.POSITION.TOP_LEFT,
                  autoClose: 500,
                  onClose: () => {
                    onLogin({
                      username: values.phone,
                      password: values.password,
                    });
                  },
                });
              }
            },
          }
        );
      }
    }
  };

  const onLogin = (values) => {
    f7.preloader.show();
    DeviceHelpers.get({
      success: ({ deviceId }) => {
        loginMutation.mutate(
          { ...values, deviceid: deviceId },
          {
            onSettled: ({ data }) => {
              if (data.error || data?.Status === -1) {
                toast.error(
                  data?.Status === -1
                    ? "Your account has been disabled."
                    : "Account & password are incorrect.",
                  {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 3000,
                  }
                );
                f7.dialog.close();
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
  return (
    <PickerVerify f7={f7}>
      {({ open }) => (
        <Formik
          initialValues={initialValues}
          onSubmit={(values, formikProps) =>
            onSubmit(values, { ...formikProps, open })
          }
          enableReinitialize={true}
          validationSchema={regSchema}
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
                <div className="title">Create a new account</div>
                <div className="page-login__form-item">
                  <div>
                    <input
                      type="text"
                      name="fullname"
                      autoComplete="off"
                      value={values.fullname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="First and last name"
                      className={clsx(
                        "input-customs",
                        errors.fullname &&
                          touched.fullname &&
                          "is-invalid solid-invalid"
                      )}
                    />
                  </div>
                  {errors.fullname && touched.fullname && (
                    <div className="text-danger font-size-min mt-3px">
                      {errors.fullname}
                    </div>
                  )}
                </div>
                <div className="page-login__form-item">
                  <div>
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
                        setFieldValue("phone", val.formattedValue);
                      }}
                      allowLeadingZeros
                      prefix={"+65"}
                    />
                  </div>
                  {errors.phone && touched.phone && (
                    <div className="text-danger font-size-min mt-3px">
                      {errors.phone}
                    </div>
                  )}
                </div>
                <div className="page-login__form-item">
                  <div>
                    <input
                      type="password"
                      name="password"
                      autoComplete="off"
                      placeholder="Password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={clsx(
                        "input-customs",
                        errors.password &&
                          touched.password &&
                          "is-invalid solid-invalid"
                      )}
                    />
                  </div>
                  {errors.password && touched.password && (
                    <div className="text-danger font-size-min mt-3px">
                      {errors.password}
                    </div>
                  )}
                </div>
                <div className="page-login__form-item">
                  <button type="submit" className="btn-login btn-me">
                    <span>Register</span>
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
    </PickerVerify>
  );
}

export default FormRegistration;
