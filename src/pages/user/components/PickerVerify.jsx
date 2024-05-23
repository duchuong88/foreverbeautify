import { Form, Formik } from "formik";
import { LoginScreen, Page } from "framework7-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactInputVerificationCode from "react-input-verification-code";
import { useMutation } from "react-query";
import UserService from "../../../service/user.service";
import { toast } from "react-toastify";
import clsx from "clsx";

const useTimer = (startTime) => {
  const [time, setTime] = useState(startTime);
  const [intervalID, setIntervalID] = useState(null);
  const hasTimerEnded = time <= 0;
  const isTimerRunning = intervalID != null;

  const update = () => {
    setTime((time) => time - 1);
  };
  const startTimer = () => {
    if (!hasTimerEnded && !isTimerRunning) {
      setIntervalID(setInterval(update, 1000));
    }
  };
  const stopTimer = () => {
    clearInterval(intervalID);
    setIntervalID(null);
  };

  const resetTimer = () => {
    setTime(startTime);
  };

  // clear interval when the timer ends
  useEffect(() => {
    if (hasTimerEnded) {
      clearInterval(intervalID);
      setIntervalID(null);
    }
  }, [hasTimerEnded]);
  // clear interval when component unmounts
  useEffect(
    () => () => {
      clearInterval(intervalID);
    },
    []
  );
  return {
    time,
    startTimer,
    stopTimer,
    resetTimer,
  };
};

function PickerVerify({ children, f7 }) {
  const [visible, setVisible] = useState(false);
  const [initialValues, setInitialValues] = useState({
    Code: "",
  });

  const { time, startTimer, resetTimer, stopTimer } = useTimer(3 * 100);

  useEffect(() => {
    if (visible) {
      startTimer();
    }
  }, [visible]);

  const verifyOTPMutation = useMutation({
    mutationFn: async (body) => {
      let { data } = await UserService.verifyStringee(body);
      return data;
    },
  });

  const sendOTPMutation = useMutation({
    mutationFn: (body) => UserService.sendStringee(body),
  });

  const onSubmit = (values) => {
    verifyOTPMutation.mutate(
      {
        phone: values.Phone,
        code: values.Code,
      },
      {
        onSettled: (data) => {
          if (!data.stringee) {
            toast.error("OTP code is not valid.", {
              position: toast.POSITION.TOP_LEFT,
              autoClose: 3000,
            });
          } else {
            onClose();
            values.resolve({
              login: data?.login || null,
              code: values.Code
            });
          }
        },
      }
    );
  };

  const onResetOTP = (values) => {
    f7.dialog.preloader("Sending OTP ...");
    sendOTPMutation.mutate(
      { phone: values.Phone },
      {
        onSuccess: ({ data }) => {
          if (data.ID) {
            f7.dialog.close();
            toast.success("Sending OTP code successfully.", {
              position: toast.POSITION.TOP_LEFT,
              autoClose: 3000,
            });
            resetTimer();
          }
        },
      }
    );
  };

  const onClose = () => {
    setVisible(false);
    resetTimer();
    stopTimer();
  };

  return (
    <>
      {children({
        open: (values, formikProps) => {
          setInitialValues({
            Phone: values.Phone,
            resolve: values.resolve,
            Code: "",
          });
          setVisible(true);
        },
      })}
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize={true}
        //validationSchema={regSchema}
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
            <LoginScreen opened={visible} onLoginScreenClosed={onClose}>
              <Page loginScreen className="h-100">
                <Form className="h-100">
                  <div className="h-100 bg-white p-20px bz-bb d--f fd--c">
                    <div
                      className="position-absolute top-0 left-0 w-50px h-50px font-size-xl cursor-pointer d--f jc--c ai--c"
                      onClick={onClose}
                    >
                      <i className="las la-arrow-left"></i>
                    </div>
                    <div className="fg--1 d--f fd--c ai--c">
                      <div
                        style={{
                          width: "55%",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 1715.74 1820.38"
                        >
                          <defs>
                            <style
                              dangerouslySetInnerHTML={{
                                __html:
                                  ".cls-1{fill:#f8f8f8;}.cls-2{fill:#f2d933;}.cls-3{opacity:0.1;}.cls-4{fill:#456e91;}.cls-5{fill:#737362;}",
                              }}
                            />
                          </defs>
                          <g id="OBJECTS">
                            <circle
                              className="cls-1"
                              cx="1485.83"
                              cy="1734.63"
                              r="30.19"
                            />
                            <circle
                              className="cls-1"
                              cx="1641.18"
                              cy="1660.8"
                              r="30.19"
                            />
                            <path
                              className="cls-2"
                              d="M90,123a56.2,56.2,0,1,1,56.2-56.2A56.26,56.26,0,0,1,90,123ZM90,13.84a52.93,52.93,0,1,0,52.93,52.93A53,53,0,0,0,90,13.84Z"
                            />
                            <g className="cls-3">
                              <circle
                                className="cls-4"
                                cx="36.15"
                                cy="109.84"
                                r="36.4"
                              />
                            </g>
                            <path
                              className="cls-5"
                              d="M866.33,347.64a58.16,58.16,0,1,1,58.16-58.16A58.23,58.23,0,0,1,866.33,347.64Zm0-113.06a54.9,54.9,0,1,0,54.89,54.9A55,55,0,0,0,866.33,234.58Z"
                            />
                            <path
                              className="cls-5"
                              d="M1403.92,291.11A58.16,58.16,0,1,1,1462.08,233,58.23,58.23,0,0,1,1403.92,291.11Zm0-113A54.89,54.89,0,1,0,1458.81,233,54.95,54.95,0,0,0,1403.92,178.06Z"
                            />
                            <rect
                              className="cls-1"
                              x="1664.64"
                              y="569.47"
                              width="81.91"
                              height="81.91"
                            />
                            <path
                              className="cls-1"
                              d="M580.62,774H375.09a64.32,64.32,0,0,0-64.33,64.32h0a64.33,64.33,0,0,0,64.33,64.33H580.62A64.33,64.33,0,0,0,645,838.32h0A64.32,64.32,0,0,0,580.62,774Z"
                            />
                            <path
                              className="cls-1"
                              d="M1651.41,766.94H1445.88a64.33,64.33,0,0,0,0,128.65h205.53a64.33,64.33,0,1,0,0-128.65Z"
                            />
                            <path
                              className="cls-1"
                              d="M1443.7,684.12h25a24,24,0,1,0,0-48.09h-25a24,24,0,1,0,0,48.09Z"
                            />
                            <path
                              className="cls-1"
                              d="M1561.44,1448H1439.07a24.57,24.57,0,0,0,0,49.13h122.37a24.57,24.57,0,1,0,0-49.13Z"
                            />
                            <path
                              className="cls-1"
                              d="M173.38,1019.92h0A22.35,22.35,0,0,0,151,997.57H66.6a22.36,22.36,0,0,0-22.36,22.35h0a22.36,22.36,0,0,0,22.36,22.36H151A22.36,22.36,0,0,0,173.38,1019.92Z"
                            />
                            <rect
                              className="cls-1"
                              x="87.19"
                              y="1400.78"
                              width="270.25"
                              height="98.84"
                              rx="49.42"
                            />
                            <rect
                              style={{ fill: "var(--ezs-color)" }}
                              x="753.04"
                              y="606.9"
                              width="209.45"
                              height="51.19"
                            />
                            <path
                              style={{ fill: "var(--ezs-color)" }}
                              d="M1342.91,1046l0,9.22h-53.24v-6q0-12.26,0-24.48c0-17.85-6.56-24.48-24.18-24.48q-198.92,0-397.82,0c-19.22,0-25.37,6.18-25.4,25.46v10.43q0,57.41-.07,114.76c0,6.86,1.9,12.22,5.66,15.95s9.35,5.65,16.54,5.69c11.44-.07,22.88,0,34.32,0,10,.06,20.1.1,30.13.06q14.47-.09,28.93-.29c10.2-.13,20.4-.26,30.63-.3,7.84,0,15.69.1,23.5.2,7.06.1,14.12.2,21.18.2,10.2,0,20.36-.07,30.56-.13q11.67-.1,23.34-.17c13.76,0,27.52,0,41.41,0H1142v44c-1,0-1.86.06-2.81.06q-144.09,0-288.19,0c-37.56,0-61.84-24.35-61.88-62q0-68.29,0-136.63c.07-36.57,24.71-61.12,61.32-61.12h432c35.53,0,60.44,24.94,60.5,60.6C1342.91,1026.64,1342.91,1036.25,1342.91,1046Z"
                            />
                            <path
                              style={{ fill: "var(--ezs-color)" }}
                              d="M1169.34,1086.27c0,19.85-15,35.49-35.43,35.94-20,.45-36-15.88-36.07-35.67a35.75,35.75,0,1,1,71.5-.27Z"
                            />
                            <rect
                              style={{ fill: "var(--ezs-color)" }}
                              x="833.25"
                              y="1668.19"
                              width="49.03"
                              height="49.03"
                            />
                            <rect
                              style={{ fill: "var(--ezs-color)" }}
                              x="-0.05"
                              y="1771.25"
                              width="1715.62"
                              height="49.03"
                            />
                            <path
                              style={{ fill: "var(--ezs-color)" }}
                              d="M1228.22,750.46V580.92a59.38,59.38,0,0,0-59.32-59.33H546.62a59.38,59.38,0,0,0-59.32,59.33V1761a59.37,59.37,0,0,0,59.32,59.32H1168.9a59.37,59.37,0,0,0,59.32-59.32V1376.46h-49V1761a10.3,10.3,0,0,1-10.3,10.3H546.62a10.3,10.3,0,0,1-10.29-10.3v-1180a10.3,10.3,0,0,1,10.29-10.3H1168.9a10.3,10.3,0,0,1,10.3,10.3V750.46Z"
                            />
                            <path
                              style={{ fill: "var(--ezs-color)" }}
                              d="M1376.93,1240.08c-.07-9.13-7.38-11-11.7-11.33-2.06-.13-4.08-.2-6.31-.3l-10-.48v-6.52c0-5.11,0-10.12,0-15.06.06-10.78.1-20.93-.07-31.19-.66-39.66-32.87-71.66-71.94-71.66h-.66c-40.2.37-71.59,32.45-71.42,73.07,0,10,0,19.9,0,30.05l0,20.86-8.44.86c-1.41.17-2.51.27-3.6.34-13.28.55-16.16,3.47-16.16,16.5v97.64a9.6,9.6,0,0,0,9.57,9.57h179.87c2.3,0,4.49,0,6.62-.07,3.84-.24,4.25-1.47,4.25-4l0-14.71C1377.14,1302.93,1377.2,1271.23,1376.93,1240.08Zm-61.27-29.23v17.53h-76.92l-.51-9.16c-.14-2-.24-3.91-.27-5.83,0-4.74,0-9.47-.07-14.24,0-7.62,0-15.23-.17-22.85-.35-19.42,13.92-37,32.48-40,19.63-3.19,39.32,9.3,44,27.9,1.54,6.07,1.48,12.21,1.44,18.11v4.87C1315.73,1195,1315.69,1202.75,1315.66,1210.85Z"
                            />
                            <path
                              style={{ fill: "var(--ezs-color)" }}
                              d="M1059.65,1086.27c0,19.85-15,35.49-35.44,35.94-20,.45-36-15.88-36.06-35.67a35.75,35.75,0,1,1,71.5-.27Z"
                            />
                            <path
                              style={{ fill: "var(--ezs-color)" }}
                              d="M917.84,1122c-17.69,1-34.56-14.66-35.51-33.07-1-20.13,13.53-37,33-38.29,19.91-1.28,37,13.58,38.44,32.89C955.28,1103.55,939.58,1122.65,917.84,1122Z"
                            />
                            <rect
                              style={{ fill: "var(--ezs-color)" }}
                              x="1179.2"
                              y="718.82"
                              width="49.03"
                              height="205.3"
                            />
                          </g>
                        </svg>
                      </div>
                      <div className="text-center my-40px">
                        <div
                          className="text-uppercase fw-500 mb-20px"
                          style={{ fontSize: "24px" }}
                        >
                          Verify account
                        </div>
                        {/* <div className="font-size-md mb-5px">
                          Xin chào,
                        </div> */}
                        <div
                          className="fw-300"
                          style={{ color: "#3f4254", lineHeight: "22px" }}
                        >
                          Please enter the OTP code sent to 
                          your phone
                          <span className="pl-5px fw-500">{values?.Phone}</span>
                          .
                          <div>
                            The OTP code will expire later
                            <span className="pl-5px fw-500 text-danger">
                              {moment.utc(time * 1000).format("mm:ss")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <ReactInputVerificationCode
                          autoFocus
                          length={4}
                          onChange={(val) => setFieldValue("Code", val)}
                          placeholder=""
                          value={values.Code}
                        />
                      </div>
                      <div
                        className="mt-40px fw-300"
                        style={{ color: "#3f4254" }}
                      >
                        Haven't received OTP code?
                        <span
                          className="text-primary pl-5px fw-500 text-underline"
                          onClick={() => onResetOTP(values)}
                        >
                          Resend code
                        </span>
                      </div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className={clsx(
                          "btn-login btn-me",
                          verifyOTPMutation.isLoading && "loading"
                        )}
                      >
                        <span>Confirm</span>
                      </button>
                    </div>
                  </div>
                </Form>
              </Page>
            </LoginScreen>
          );
        }}
      </Formik>
    </>
  );
}

export default PickerVerify;
