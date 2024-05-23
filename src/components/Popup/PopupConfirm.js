import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import clsx from "clsx";
import NumberFormat from "react-number-format";
import { getUser } from "../../constants/user";

const PopupConfirm = ({ show, onSubmit, onHide, initialValue, btnLoading }) => {
  const [initialValues, setInitialValues] = useState({
    Fullname: "",
    Phone: "",
  });
  const userInfo = getUser();

  useEffect(() => {
    setInitialValues((prevState) => ({
      ...prevState,
      Fullname: userInfo?.FullName || "",
      Phone: userInfo?.MobilePhone || "",
      Content: "Cần tư vấn " + initialValue?.Title,
    }));
  }, [initialValue]);

  const sendSchema = Yup.object().shape({
    Fullname: Yup.string().required("Please enter."),
    Phone: Yup.string().required("Please enter."),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize={true}
      validationSchema={sendSchema}
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
          <Form className={clsx("dialog-confirm", show && "open")}>
            <div className="bg" onClick={onHide}></div>
            <div className="content">
              <div className="text">
                <h4>{initialValue?.Title}</h4>
                <div
                  className="text-desc"
                  dangerouslySetInnerHTML={{ __html: initialValue?.Desc }}
                ></div>
                {!userInfo && (
                  <div className="dialog-confirm-form">
                    <input
                      className={`dialog-confirm-input ${
                        errors.Fullname && touched.Fullname
                          ? "is-invalid solid-invalid"
                          : ""
                      }`}
                      type="text"
                      placeholder="First and last name"
                      name="Fullname"
                      value={values.Fullname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <NumberFormat
                      className={`dialog-confirm-input ${
                        errors.Phone && touched.Phone
                          ? "is-invalid solid-invalid"
                          : ""
                      }`}
                      value={values.Phone}
                      thousandSeparator={false}
                      placeholder="Phone number"
                      onValueChange={(val) => {
                        setFieldValue(
                          "Phone",
                          val.floatValue ? val.floatValue : val.value
                        );
                      }}
                      allowLeadingZeros={true}
                    />
                  </div>
                )}
              </div>
              <div className="dialog-buttons">
                <div className="dialog-button" onClick={onHide}>
                  Close
                </div>
                <div className="dialog-button dialog-button-bold">
                  <button type="submit" disabled={btnLoading}>
                    {btnLoading ? "Sending ..." : "Care about"}
                  </button>
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export { PopupConfirm };
