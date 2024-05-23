import React from "react";
import { Button, Sheet } from "framework7-react";
import { Form, Formik } from "formik";
import * as Yup from "yup";

const pwdSchema = Yup.object().shape({
  password: Yup.string()
    .min(4, "Password must have at least 4 characters.")
    .required("Please enter a new password."),
  re_password: Yup.string()
    .required("Please re-enter new password.")
    .oneOf([Yup.ref("password"), null], "Passwords do not match."),
});

export default class ModalChangePWD extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {}

  render() {
    const { onChangePWD } = this.props;
    return (
      <Formik
        initialValues={{
          password: "",
          re_password: "",
        }}
        onSubmit={onChangePWD}
        enableReinitialize={true}
        validationSchema={pwdSchema}
      >
        {(formikProps) => {
          const { values, touched, errors, handleChange, handleBlur } =
            formikProps;

          return (
            <Form>
              <div className="p-15px">
                <div className="text-danger font-size-xs line-height-sm">
                You need to change the default password to ensure personal information
                kernel is confidential.
                </div>
                <div className="mt-12px">
                  <label className="font-size-xs mb-2px d-block">
                    New password
                  </label>
                  <input
                    name="password"
                    className={`input-customs w-100 h-40px px-10px rounded-sm ${
                      errors.password && touched.password
                        ? "is-invalid solid-invalid"
                        : ""
                    }`}
                    value={values.password}
                    type="password"
                    placeholder="Enter your new password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="text-danger font-size-min mt-3px">
                    {errors.password && touched.password && errors.password}
                  </div>
                </div>
                <div className="mt-12px">
                  <label className="font-size-xs mb-2px d-block">
                    Re-enter new password
                  </label>
                  <input
                    name="re_password"
                    className={`input-customs w-100 h-40px px-10px rounded-sm ${
                      errors.re_password && touched.re_password
                        ? "is-invalid solid-invalid"
                        : ""
                    }`}
                    type="password"
                    placeholder="Enter a new password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.re_password}
                  />
                  <div className="text-danger font-size-min mt-3px">
                    {errors.re_password &&
                      touched.re_password &&
                      errors.re_password}
                  </div>
                </div>
                <div className="mt-12px">
                  <Button
                    fill
                    className="h-40px d--f ai--c jc--c rounded-sm bg-ezs"
                    type="submit"
                  >
                    Change the password
                  </Button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    );
  }
}
