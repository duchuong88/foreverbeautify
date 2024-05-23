import React from "react";
import { Link, Page } from "framework7-react";
import userService from "../../service/user.service";
import { toast } from "react-toastify";
import IframeResizer from "iframe-resizer-react";
import { auth, database } from "../../firebase/firebase";
import { ref, onValue, set } from "firebase/database";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { iOS } from "../../constants/helpers";
import { SERVER_APP } from "../../constants/config";
import { uuid } from "../../constants/helpers";
import { FormForgotSMS } from "./components";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      input: "",
      iFrameHeight: "0px",
      Uuid: "",
    };
  }

  componentDidMount() {
    const starCountRef = ref(database, "token");
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      const { Uuid } = this.state;
      const dataArr = data
        ? Object.keys(data).map((key) => {
            return { ...data[key], Key: key };
          })
        : [];
      if (dataArr.findIndex((item) => item.Key === Uuid) > -1) {
        toast.success("The new password has been changed successfully !", {
          position: toast.POSITION.TOP_LEFT,
          autoClose: 3000,
        });
        set(ref(database, `/token/${this.state.Uuid}`), null).then(() => {
          this.$f7router.navigate("/login/");
        });
      }
    });

    if (!iOS() && !window?.GlobalConfig?.SMSOTP) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "sign-in-button",
        {
          size: "invisible",
          callback: (response) => {
            this.handleSubmit();
          },
        },
        auth
      );
      window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
      });
    } else if (!window?.GlobalConfig?.SMSOTP) {
      this.setState({ Uuid: uuid() });
      this.$f7.dialog.preloader("Loading ...");
    }
  }

  handleChangeInput = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (event) => {
    //event.preventDefault();
    if (this.state.input === "") {
      toast.error("Please enter phone number or Email !", {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 3000,
      });
      return;
    }
    this.setState({
      loading: true,
    });
    var PhoneRegex = /(840|84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    var isPhone = PhoneRegex.test(this.state.input);

    var bodyFormData = new FormData();
    bodyFormData.append("input", this.state.input);
    bodyFormData.append("loading", true);
    bodyFormData.append("mess", "");
    bodyFormData.append("error", "");
    bodyFormData.append("currentPhoneNumber", "");

    userService
      .authForget(bodyFormData)
      .then(async ({ data }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (data.error) {
          let TextErr = data.error;
          if (data.error === "EMAIL_WRONG") {
            TextErr = "Invalid email or phone number.";
          }
          if (data.error === "EMAIL_NOT_REG") {
            TextErr = "Email or phone number is not registered.";
          }
          if (data.error === "FORGET_METHOD_OVER_SECTION") {
            TextErr = "Exceeded the number of password changes per day.";
          }
          if (data.error === "PHONE_NOT_REG") {
            TextErr = "Phone number is not registered.";
          }
          toast.error(TextErr, {
            position: toast.POSITION.TOP_LEFT,
            autoClose: 3000,
          });
          window.recaptchaVerifier.render().then(function (widgetId) {
            grecaptcha.reset(widgetId);
          });
          this.setState({
            loading: false,
          });
          return;
        }

        if (isPhone) {
          const phoneNumber = `+84${this.state.input}`;
          const appVerifier = window.recaptchaVerifier;
          signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then((confirmationResult) => {
              // SMS sent. Prompt user to type the code from the message, then sign the
              // user in with confirmationResult.confirm(code).
              this.setState({
                loading: false,
              });
              window.confirmationResult = confirmationResult;
              this.$f7router.navigate(
                `/forgot-change/?phone=${this.state.input}`
              );
            })
            .catch((error) => {
              window.recaptchaVerifier.render().then(function (widgetId) {
                grecaptcha.reset(widgetId);
              });
              console.log(error);
              // Error; SMS not sent
              // ...
            });
        } else {
          this.setState({
            loading: false,
          });
          this.$f7router.navigate("/forgot-change/");
        }
      })
      .catch((error) => console.log(error));
  };

  render() {
    const { loading, Uuid } = this.state;
    return (
      <Page noNavbar noToolbar name="forgot">
        <div className={`page-forgot h-100 ${iOS() && "page-forgot-ios"}`}>
          <div className="to-back">
            <Link onClick={() => this.$f7router.back()}>
              <i className="las la-arrow-left"></i>
            </Link>
          </div>
          <div className="page-forgot__content text-center">
            <div className="page-forgot-about">
              <h4>Forgot password</h4>
              <div className="desc">
                Enter your phone number or email and we will send it to you
                an OTP code or password reset link.
              </div>
              <img
                className="logo-reg"
                src={`${SERVER_APP}/app2021/images/forgot-password.png`}
              />
            </div>
            {window?.GlobalConfig?.SMSOTP ? (
              <FormForgotSMS f7={this.$f7} f7router={this.$f7router} />
            ) : (
              <>
                {iOS() && Uuid && (
                  <IframeResizer
                    heightCalculationMethod="bodyScroll"
                    src={`${SERVER_APP}/App2021/forgotUI?uuid=${Uuid}&color=${window?.GlobalConfig?.APP?.Css[
                      "--ezs-color"
                    ].replaceAll("#", "")}`}
                    style={{ border: 0 }}
                    onLoad={() => this.$f7.dialog.close()}
                  />
                )}
                <div className={`${iOS() && "d-none"}`}>
                  <div className="page-login__form-item">
                    <input
                      type="text"
                      name="input"
                      autoComplete="off"
                      placeholder="Phone number or Email"
                      onChange={this.handleChangeInput}
                    />
                  </div>
                  <div className="page-login__form-item">
                    <button
                      type="submit"
                      className={`btn-login btn-me ${loading ? "loading" : ""}`}
                      id="sign-in-button"
                    >
                      <span>Get code</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Page>
    );
  }
}
