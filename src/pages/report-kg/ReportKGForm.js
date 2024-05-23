import { Form, Formik } from "formik";
import moment from "moment";
import React, { useState, useEffect } from "react";
import NumberFormat from "react-number-format";
import { getUser } from "../../constants/user";
import { useMutation, useQueryClient } from "react-query";
import MemberAPI from "../../service/member.service";
import { toast } from "react-toastify";
import clsx from "clsx";
import * as Yup from "yup";

const AddSchema = Yup.object().shape({
  Value: Yup.string().required("Please enter KG number"),
});

function ReportKGForm({ onClose, initial }) {
  const Member = getUser();

  const queryClient = useQueryClient();

  const [initialValues, setInitialValues] = useState({
    Value: "",
    ID: 0,
    MemberID: Member.ID,
  });

  useEffect(() => {
    if (initial) {
      setInitialValues((prevState) => ({
        ...prevState,
        Value: initial.Value,
        ID: initial.ID,
      }));
    } else {
      setInitialValues({ Value: "", ID: 0, MemberID: Member.ID });
    }
  }, [initial]);

  const saveNoteMutation = useMutation({
    mutationFn: (body) => MemberAPI.saveNoteKg(body),
  });

  const onSubmit = (values, { resetForm }) => {
    saveNoteMutation.mutate(
      { edit: [values] },
      {
        onSuccess: ({ data }) => {
          if (!data?.error) {
            queryClient
              .invalidateQueries({ queryKey: ["MembersNoteKG"] })
              .then(() => {
                toast.success("Updated successfully.");
                resetForm();
                onClose();
              });
          } else {
            toast.error(data?.error);
          }
        },
        onError: (error) => console.log(error),
      }
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize={true}
      validationSchema={AddSchema}
    >
      {(formikProps) => {
        const { values, setFieldValue, errors, touched } = formikProps;

        return (
          <Form>
            <div className="p-15px">
              <div className="fw-700 text-center font-size-md mb-15px">
                Số KG ngày{" "}
                {initial?.CreateDate
                  ? moment(initial?.CreateDate).format("DD/MM/YYYY")
                  : moment().format("DD/MM/YYYY")}
              </div>
              <div>
                <div>Number KG</div>
                <div className="position-relative">
                  <NumberFormat
                    className={clsx(
                      "dialog-confirm-input",
                      errors.Value &&
                        touched.Value &&
                        "is-invalid solid-invalid"
                    )}
                    value={values.Value}
                    thousandSeparator={false}
                    placeholder="Enter the Kilogram number"
                    onValueChange={(val) => {
                      setFieldValue(
                        "Value",
                        val.floatValue ? val.floatValue : val.value
                      );
                    }}
                    allowLeadingZeros={true}
                  />
                  <div
                    className="position-absolute text-muted"
                    style={{
                      right: "15px",
                      top: "10px",
                      pointerEvents: "none",
                    }}
                  >
                    KG
                  </div>
                </div>
                {errors.Value && touched.Value && (
                  <div className="text-danger font-size-min mt-3px">
                    {errors.Value}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className={clsx(
                  "page-btn-order btn-submit-order rounded mt-10px",
                  saveNoteMutation.isLoading && "loading"
                )}
              >
                <span>Update KG</span>
                <div className="loading-icon">
                  <div className="loading-icon__item item-1"></div>
                  <div className="loading-icon__item item-2"></div>
                  <div className="loading-icon__item item-3"></div>
                  <div className="loading-icon__item item-4"></div>
                </div>
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default ReportKGForm;
