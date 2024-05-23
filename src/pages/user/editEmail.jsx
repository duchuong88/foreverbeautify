import React from "react";
import { Page, Link, Navbar, Toolbar } from "framework7-react";
import bgImage from "../../assets/images/headerbottombgapp.png";
import IconChangeEmail from "../../assets/images/icon-change-email.svg";
import { getUser, getPassword } from "../../constants/user";
import { validateEmail } from "../../constants/format";
import UserService from "../../service/user.service";
import { toast } from "react-toastify";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      memberInfo: [],
    };
  }

  componentDidMount() {
    this.getInfoMember();
  }

  getInfoMember = () => {
    const infoUser = getUser();
    if (!infoUser) return false;
    const username = infoUser?.MobilePhone;
    const password = getPassword();

    UserService.getInfo(username, password)
      .then((response) => {
        const memberInfo = response.data;
        this.setState({
          memberInfo: memberInfo,
        });
      })
      .catch((err) => console.log(err));
  };

  handleChangeInput = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  saveEmail = () => {
    const self = this;
    const infoUser = getUser();
    const username = infoUser?.MobilePhone;
    const email = this.state.email;
    const password = this.state.password;
    const PWD = getPassword();
    self.$f7.preloader.show();

    if (!validateEmail(email)) {
      toast.error("The email you entered is not valid.", {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 2000,
      });
      self.$f7.preloader.hide();
    } else {
      UserService.updateEmail(email, password, username, PWD)
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
              toast.success("Updated new Email successfully !", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
              });
              self.resetValue();
              self.getInfoMember();
              self.$f7router.back();
            }
          }, 1000);
        })
        .catch((err) => console.log(err));
    }
  };

  resetValue = () => {
    this.setState({
      email: "",
      password: "",
    });
  };

  render() {
    const memberInfo = this.state.memberInfo;
    return (
      <Page name="edit-email" noToolbar noNavbar>
        <div className="page-edit-password">
          <div className="profile-bg">
            <div className="page-login__back">
              <Link onClick={() => this.$f7router.back()}>
                <i className="las la-arrow-left"></i>
              </Link>
            </div>
            <div className="name">Change your e-mail</div>
            <img src={bgImage} />
          </div>
          <div className="profile-info">
            <div className="profile-info__avatar">
              <img src={IconChangeEmail} />
            </div>
          </div>
          <div className="edit-email__box">
            <form>
              <div className="note">
                You want to change your current Email. Please update complete information
                news below.
              </div>
              <div className="box-form">
                <div className="page-login__form-item">
                  <label>Current email</label>
                  <input
                    value={(memberInfo && memberInfo.Email) || "No Email yet"}
                    type="text"
                    autoComplete="off"
                    className="input-customs"
                    disabled
                  />
                </div>
                <div className="page-login__form-item">
                  <label>New email</label>
                  <input
                    type="text"
                    name="email"
                    value={this.state.email || ""}
                    autoComplete="off"
                    onChange={this.handleChangeInput}
                    placeholder="Enter new Email"
                    className="input-customs"
                  />
                </div>
                <div className="page-login__form-item">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    autoComplete="off"
                    value={this.state.password || ""}
                    onChange={this.handleChangeInput}
                    placeholder="Password"
                    className="input-customs"
                  />
                </div>
                <div className="page-login__form-item">
                  <button
                    type="button"
                    className="btn-login btn-me btn-no-image"
                    onClick={() => this.saveEmail()}
                  >
                    <span>Save changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* <Toolbar tabbar position="bottom">
              <ToolBarBottom />
            </Toolbar> */}
      </Page>
    );
  }
}
