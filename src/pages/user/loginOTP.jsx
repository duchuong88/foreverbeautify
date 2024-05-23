import React from "react";
import { SERVER_APP } from "../../constants/config";
import { Page, Link } from "framework7-react";
import { iOS } from "../../constants/helpers";
import { FormLoginSMS } from "./components";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  isImage = (icon) => {
    const ext = [".jpg", ".jpeg", ".bmp", ".gif", ".png", ".svg"];
    return ext.some((el) => icon.endsWith(el));
  };

  getClassStyle = () => {
    if (window?.GlobalConfig?.APP?.Login?.Background) {
      if (this.isImage(window?.GlobalConfig?.APP?.Login?.Background)) {
        document.documentElement.style.setProperty(
          "--login-background",
          `url(${window?.GlobalConfig?.APP?.Login?.Background})`
        );
        return "bg-login-img";
      } else {
        document.documentElement.style.setProperty(
          "--login-background",
          window?.GlobalConfig?.APP?.Login?.Background
        );
        return "bg-login";
      }
    }
    return "";
  };

  render() {
    return (
      <Page noNavbar noToolbar name="login">
        <div
          className={`page-wrapper page-login d--f fd--c jc--sb ${iOS() && "page-login-iphone"}`}
        >
          {!window?.GlobalConfig?.APP?.OnlyStaff && (
            <div className="page-login__back">
              <Link
                onClick={() => {
                  if (
                    this.$f7router.history[
                      this.$f7router.history.length - 2
                    ]?.indexOf("/profile/") > -1
                  ) {
                    this.$f7router.navigate(`/`);
                  } else {
                    this.$f7router.back();
                  }
                }}
              >
                <i className="las la-arrow-left"></i>
              </Link>
            </div>
          )}

          <div className={`page-login__content ${this.getClassStyle()}`}>
            <div className="page-login__logo">
              <div className="logo">
                <img src={SERVER_APP + "/app/images/logo-app.png"} />
              </div>
              <div className="title">Hello, Let's start logging in</div>
            </div>
            <div className="page-login__form">
              <FormLoginSMS f7={this.$f7} f7router={this.$f7router} />
            </div>
          </div>
          {!window?.GlobalConfig?.APP?.OnlyStaff && (
            <div className="page-login__alert">
              <div className="ft">
                Do not have an account ?{" "}
                <Link href="/registration/">Register</Link>
              </div>
            </div>
          )}
        </div>
      </Page>
    );
  }
}
