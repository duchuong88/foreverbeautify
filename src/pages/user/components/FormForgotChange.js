import clsx from "clsx";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import * as Yup from "yup";
import UserService from "../../../service/user.service";
import { toast } from "react-toastify";

const forgotSchema = Yup.object().shape({
  secure: Yup.string().required("Please enter the confirmation code."),
  new_password: Yup.string().required("Please enter a new password."),
  re_newpassword: Yup.string()
    .oneOf(
      [Yup.ref("new_password"), null],
      "Re-enter the new password and it doesn't match"
    )
    .required("Please re-enter new password."),
});

function FormForgotChange({ f7route, f7router }) {
  const [initialValues, setInitialValues] = useState({
    secure: "",
    new_password: "",
    re_newpassword: "",
  });

  useEffect(() => {
    if (f7route?.query?.code) {
      setInitialValues((prevState) => ({
        ...prevState,
        secure: f7route?.query?.code,
      }));
    }
  }, [f7route]);

  const resetMutation = useMutation({
    mutationFn: async (body) => {
      let { data } = await UserService.authForgetReset(body);
      return data;
    },
  });

  const onSubmit = (values, { setFieldError }) => {
    if (
      !f7route?.query?.code &&
      f7route?.query?.phone &&
      window.confirmationResult
    ) {
      window.confirmationResult
        .confirm(values.secure)
        .then((result) => {
          var bodyFormData = new FormData();
          bodyFormData.append("securePhone", f7route?.query.phone);
          bodyFormData.append("new_password", values.new_password);
          bodyFormData.append("re_newpassword", values.re_newpassword);
          bodyFormData.append("mess", "");
          bodyFormData.append("error", "");
          bodyFormData.append("autoLogin", "3");
          resetMutation.mutate(bodyFormData, {
            onSettled: (data) => {
              if (data.error) {
                toast.error(data.error, {
                  position: toast.POSITION.TOP_LEFT,
                  autoClose: 3000,
                });
              } else {
                toast.success("Password changed successfully !", {
                  position: toast.POSITION.TOP_LEFT,
                  autoClose: 3000,
                });
                f7router.navigate(`/login/`);
              }
            },
          });
        })
        .catch((error) => {
          toast.error("OTP code is incorrect. Please check again.", {
            position: toast.POSITION.TOP_LEFT,
            autoClose: 3000,
          });
        });
    } else if (f7route?.query?.code && f7route?.query?.phone) {
      var bodyFormData = new FormData();
      bodyFormData.append("securePhone", f7route?.query.phone);
      bodyFormData.append("new_password", values.new_password);
      bodyFormData.append("re_newpassword", values.re_newpassword);
      bodyFormData.append("mess", "");
      bodyFormData.append("error", "");
      bodyFormData.append("autoLogin", "3");
      resetMutation.mutate(bodyFormData, {
        onSettled: (data) => {
          if (data.error) {
            toast.error(data.error, {
              position: toast.POSITION.TOP_LEFT,
              autoClose: 3000,
            });
          } else {
            toast.success("Password changed successfully !", {
              position: toast.POSITION.TOP_LEFT,
              autoClose: 3000,
            });
            f7router.navigate(`/login/`);
          }
        },
      });
    } else {
      var bodyFormData = new FormData();
      bodyFormData.append("secure", values.secure);
      bodyFormData.append("new_password", values.new_password);
      bodyFormData.append("re_newpassword", values.re_newpassword);
      bodyFormData.append("mess", "");
      bodyFormData.append("error", "");
      bodyFormData.append("autoLogin", "3");
      resetMutation.mutate(bodyFormData, {
        onSettled: (data) => {
          if (data?.error) {
            if (data?.error === "SECURE_WRONG") {
              setFieldError(
                "secure",
                "The authentication code has expired or is invalid."
              );
            } else {
              setFieldError("secure", data?.error);
            }
          } else {
            toast.success("Password changed successfully !", {
              position: toast.POSITION.TOP_LEFT,
              autoClose: 3000,
            });
            f7router.navigate(`/login/`);
          }
        },
      });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize={true}
      validationSchema={forgotSchema}
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
            {!f7route?.query?.code && (
              <div className="page-login__form-item">
                <div className="position-relative">
                  <input
                    className={clsx(
                      "input-customs",
                      errors.secure &&
                        touched.secure &&
                        "is-invalid solid-invalid"
                    )}
                    type="text"
                    value={values.secure}
                    name="secure"
                    autoComplete="off"
                    placeholder="Verification Code"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {values.secure && (
                    <div
                      className="clear-value"
                      onClick={() => {
                        setFieldValue("secure", "", false);
                      }}
                    >
                      <i className="las la-times"></i>
                    </div>
                  )}
                </div>
                {errors.secure && touched.secure && (
                  <div className="text-danger font-size-min mt-3px text-left">
                    {errors.secure}
                  </div>
                )}
              </div>
            )}

            <div className="page-login__form-item">
              <div className="position-relative">
                <input
                  className={clsx(
                    "input-customs",
                    errors.new_password &&
                      touched.new_password &&
                      "is-invalid solid-invalid"
                  )}
                  type="password"
                  value={values.new_password}
                  name="new_password"
                  autoComplete="off"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="New password"
                />
                {values.new_password && (
                  <div
                    className="clear-value"
                    onClick={() => {
                      setFieldValue("new_password", "", false);
                    }}
                  >
                    <i className="las la-times"></i>
                  </div>
                )}
              </div>
              {errors.new_password && touched.new_password && (
                <div className="text-danger font-size-min mt-3px text-left">
                  {errors.new_password}
                </div>
              )}
            </div>
            <div className="page-login__form-item">
              <div className="position-relative">
                <input
                  className={clsx(
                    "input-customs",
                    errors.re_newpassword &&
                      touched.re_newpassword &&
                      "is-invalid solid-invalid"
                  )}
                  type="password"
                  value={values.re_newpassword}
                  name="re_newpassword"
                  autoComplete="off"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter a new password"
                />
                {values.re_newpassword && (
                  <div
                    className="clear-value"
                    onClick={() => {
                      setFieldValue("re_newpassword", "", false);
                    }}
                  >
                    <i className="las la-times"></i>
                  </div>
                )}
              </div>
              {errors.re_newpassword && touched.re_newpassword && (
                <div className="text-danger font-size-min mt-3px text-left">
                  {errors.re_newpassword}
                </div>
              )}
            </div>
            <div className="page-login__form-item">
              <button
                type="submit"
                className={clsx(
                  "btn-login btn-me",
                  resetMutation.isLoading && "loading"
                )}
              >
                <span>Change Password</span>
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default FormForgotChange;
