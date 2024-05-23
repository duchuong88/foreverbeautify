import React, { useState } from "react";
import PickerVerify from "./PickerVerify";
import { Form, Formik } from "formik";
import clsx from "clsx";
import * as Yup from "yup";
import UserService from "../../../service/user.service";
import { useMutation } from "react-query";

const forgotSchema = Yup.object().shape({
  phone: Yup.string().required("Please enter Phone Number or Email."),
});

const convertError = (error) => {
  if (error === "EMAIL_WRONG") {
    return "Invalid email or phone number.";
  }
  if (error === "EMAIL_NOT_REG") {
    return "Email or phone number is not registered.";
  }
  if (error === "FORGET_METHOD_OVER_SECTION") {
    return "Exceeded the number of password changes per day.";
  }
  if (error === "PHONE_NOT_REG") {
    return "Phone number is not registered.";
  }
  return error;
};

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function FormForgotSMS({ f7, f7router }) {
  const [initialValues] = useState({ phone: "" });

  const forgetMutation = useMutation({
    mutationFn: async (body) => {
      let { data } = await UserService.authForget(body);
      return data;
    },
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

  const onSubmit = (values, { open, setFieldError }) => {
    if (validateEmail(values.phone)) {
      var bodyFormData = new FormData();
      bodyFormData.append("input", values.phone);
      bodyFormData.append("loading", true);
      bodyFormData.append("mess", "");
      bodyFormData.append("error", "");
      bodyFormData.append("currentPhoneNumber", "");
      forgetMutation.mutate(bodyFormData, {
        onSettled: (data) => {
          if (data.error) {
            setFieldError("phone", convertError(data.error));
          } else {
            f7router.navigate("/forgot-change/");
          }
        },
      });
    } else {
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
                      }).then(({ login, code }) => {
                        if ((login && code)) {
                          f7router.navigate(
                            `/forgot-change/?phone=${values.phone}&code=${code}`
                          );
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
    }
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
              <Form style={{
                padding: "0 20px"
              }}>
                <div className="page-login__form-item">
                  <div className="position-relative">
                    <input
                      autoComplete="off"
                      name="phone"
                      className={clsx(
                        "input-customs",
                        errors.phone &&
                          touched.phone &&
                          "is-invalid solid-invalid"
                      )}
                      value={values.phone}
                      placeholder="Phone number or Email"
                      onChange={handleChange}
                      onBlur={handleChange}
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
                    <div className="text-danger font-size-min mt-3px text-left">
                      {errors.phone}
                    </div>
                  )}
                </div>
                <div className="page-login__form-item">
                  <button
                    type="submit"
                    className={clsx(
                      "btn-login btn-me",
                      forgetMutation.isLoading && "loading"
                    )}
                  >
                    <span>Get code</span>
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

export default FormForgotSMS;
