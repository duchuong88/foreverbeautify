import React from "react";
import { Link, Page } from "framework7-react";
import IconForgot from "../../assets/images/forgot-change.png";
import userService from "../../service/user.service";
import { toast } from "react-toastify";
import { SERVER_APP } from "../../constants/config";
import { FormForgotChange } from "./components";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      secure: "",
      new_password: "",
      re_newpassword: "",
    };
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
    event.preventDefault();
    if (
      this.state.input === "" ||
      this.state.new_password === "" ||
      this.state.re_newpassword === ""
    ) {
      toast.error("Please enter complete information !", {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 3000,
      });
      return;
    }

    this.setState({
      loading: true,
    });

    if (this.$f7route.query.phone && window.confirmationResult) {
      window.confirmationResult
        .confirm(this.state.secure)
        .then((result) => {
          this.submitDataReset(true);
        })
        .catch((error) => {
          toast.error("OTP code is incorrect. Please check again.", {
            position: toast.POSITION.TOP_LEFT,
            autoClose: 3000,
          });
          this.setState({
            loading: false,
          });
        });
    } else {
      this.submitDataReset();
    }
  };

  submitDataReset = (isPhone) => {
    var bodyFormData = new FormData();
    if (isPhone) {
      bodyFormData.append("securePhone", this.$f7route.query.phone);
    } else {
      bodyFormData.append("secure", this.state.secure);
    }
    bodyFormData.append("new_password", this.state.new_password);
    bodyFormData.append("re_newpassword", this.state.re_newpassword);
    bodyFormData.append("mess", "");
    bodyFormData.append("error", "");
    bodyFormData.append("autoLogin", "3");

    userService
      .authForgetReset(bodyFormData)
      .then(async ({ data }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (data.error) {
          let TextErr = data.error;
          if (data.error === "SECURE_WRONG") {
            TextErr = "The authentication code has expired or is invalid.";
          }
          if (data.error === "RE_NEWPASSWORD_WRONG") {
            TextErr = "Passwords do not match.";
          }
          toast.error(TextErr, {
            position: toast.POSITION.TOP_LEFT,
            autoClose: 3000,
          });
          this.setState({
            loading: false,
          });
          return;
        }
        this.setState({
          loading: false,
        });
        toast.success("Password changed successfully !", {
          position: toast.POSITION.TOP_LEFT,
          autoClose: 3000,
        });
        this.$f7router.navigate("/login/");
      })
      .catch((error) => console.log(error));
  };

  render() {
    const { loading } = this.state;
    return (
      <Page noNavbar noToolbar name="forgot">
        <div className="page-forgot page-forgot-change h-100">
          <div className="to-back">
            <Link onClick={() => this.$f7router.back()}>
              <i className="las la-arrow-left"></i>
            </Link>
          </div>
          <div className="page-forgot__content text-center">
            <h4>Change the password</h4>
            <div className="desc">
              Please access your email or OTP via phone number to get the code
              accuracy.
            </div>
            <img
              className="logo-reg"
              src={`${SERVER_APP}/app2021/images/forgot-password.png`}
            />
            <FormForgotChange f7={this.$f7} f7route={this.$f7route} f7router={this.$f7router}/>
          </div>
        </div>
      </Page>
    );
  }
}
