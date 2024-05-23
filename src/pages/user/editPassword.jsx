import React from "react";
import { Page, Link, Navbar } from "framework7-react";
import bgImage from "../../assets/images/headerbottombgapp.png";
import IconChangePassword from "../../assets/images/edit-password.svg";
import { getUser } from "../../constants/user";
import UserService from "../../service/user.service";
import { toast } from "react-toastify";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {}
  handleChangeInput = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };
  savePassword = () => {
    const self = this;
    const pwd = this.state.pwd;
    const repwd = this.state.repwd;
    const crpwd = this.state.crpwd;
    const infoMember = getUser();
    if (!infoMember) return false;
    var bodyData = new FormData();
    bodyData.append("pwd", pwd); // New Password
    bodyData.append("repwd", repwd); // Nhập lại mật khẩu mới
    bodyData.append("crpwd", crpwd); // Mật khẩu hiện tai

    var isSubmit = true;
    self.$f7.preloader.show();
    if (
      crpwd === undefined ||
      crpwd === "" ||
      pwd === undefined ||
      pwd === ""
    ) {
      toast.error("Please enter complete information.", {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 2500,
      });
      self.$f7.preloader.hide();
      this.resetValue();
      isSubmit = false;
      return false;
    }
    if (pwd !== repwd) {
      self.$f7.preloader.hide();
      toast.error("Re-enter the new password that does not match.", {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 2500,
      });
      this.setState({
        repwd: "",
      });
      isSubmit = false;
      return false;
    }

    if (isSubmit === true) {
      UserService.updatePassword(bodyData)
        .then((response) => {
          setTimeout(() => {
            self.$f7.preloader.hide();
            if (response.data.error) {
              toast.error(response.data.error, {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 2000,
              });
              self.resetValue();
            } else {
              toast.success("Update new password !", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
              });
              setUserLoginStorage(null, pwd);
              self.resetValue();
              self.$f7router.back();
            }
          }, 1000);
        })
        .catch((err) => console.log(err));
    }
  };

  resetValue = () => {
    this.setState({
      pwd: "",
      repwd: "",
      crpwd: "",
    });
  };

  render() {
    const memberInfo = this.state.memberInfo;
    return (
      <Page name="edit-password" noToolbar noNavbar>
        <div className="page-edit-password">
          <div className="profile-bg">
            <div className="page-login__back">
              <Link onClick={() => this.$f7router.back()}>
                <i className="las la-arrow-left"></i>
              </Link>
            </div>
            <div className="name">Change the password</div>
            <img src={bgImage} />
          </div>
          <div className="profile-info">
            <div className="profile-info__avatar">
              <img src={IconChangePassword} />
            </div>
          </div>
          <form>
            <div className="edit-email__box">
              <div className="note">
                <span>(*)</span>You want to change your current password. Please
                Fully updated information below.
              </div>
              <div className="box-form">
                <div className="page-login__form-item">
                  <label>Current password</label>
                  <input
                    type="password"
                    name="crpwd"
                    value={this.state.crpwd || ""}
                    autoComplete="off"
                    onChange={this.handleChangeInput}
                    placeholder="Enter your password"
                    className="input-customs"
                  />
                </div>
                <div className="page-login__form-item">
                  <label>New password</label>
                  <input
                    type="password"
                    name="pwd"
                    value={this.state.pwd || ""}
                    autoComplete="off"
                    onChange={this.handleChangeInput}
                    placeholder="Enter your new password"
                    className="input-customs"
                  />
                </div>
                <div className="page-login__form-item">
                  <label>Re-enter new password</label>
                  <input
                    type="password"
                    value={this.state.repwd || ""}
                    name="repwd"
                    autoComplete="off"
                    onChange={this.handleChangeInput}
                    placeholder="Re-enter new password"
                    className="input-customs"
                  />
                </div>
                <div className="page-login__form-item">
                  <button
                    type="button"
                    className="btn-login btn-me btn-no-image"
                    onClick={() => this.savePassword()}
                  >
                    <span>Save changes</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Page>
    );
  }
}
