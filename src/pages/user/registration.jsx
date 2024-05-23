import React from "react";
import { SERVER_APP } from "./../../constants/config";
import { Page, Link, Toolbar } from "framework7-react";
import UserService from "../../service/user.service";
import { toast } from "react-toastify";
import {
  getStockIDStorage,
  setStockIDStorage,
  setStockNameStorage,
  setUserLoginStorage,
  setUserStorage,
} from "../../constants/user";
import SelectStock from "../../components/SelectStock";
import { SEND_TOKEN_FIREBASE } from "../../constants/prom21";
import { setSubscribe } from "../../constants/subscribe";
import DeviceHelpers from "../../constants/DeviceHelpers";
import { FormRegistration } from "./components";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      fullname: "",
      password: "",
      phone: "",
      arrNews: [],
      arrBanner: [],
      isOpenStock: false,
      isReload: 0,
    };
  }
  componentDidMount() {}
  registrationSubmit = () => {
    const fullname = this.state.fullname;
    const password = this.state.password;
    const phone = this.state.phone;
    const stockId = getStockIDStorage();

    if (!stockId) {
      this.setState({
        isOpenStock: !this.state.isOpenStock,
      });
      return;
    }

    const phone_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    if (fullname === "" || password === "" || phone === "") {
      toast.error("Please enter complete information!", {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 3000,
      });
      this.setState({
        phone: "",
      });
      return;
    }
    if (phone_regex.test(phone) === false) {
      toast.error("Invalid phone number !", {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 3000,
      });
      this.setState({
        phone: "",
      });
      return;
    }
    const self = this;
    self.$f7.preloader.show();

    UserService.register(fullname, password, phone, stockId)
      .then((repsonse) => {
        if (repsonse.data.error) {
          toast.error(repsonse.data.error, {
            position: toast.POSITION.TOP_LEFT,
            autoClose: 3000,
          });
          self.$f7.preloader.hide();
        } else {
          toast.success("Sign Up Success.", {
            position: toast.POSITION.TOP_LEFT,
            autoClose: 500,
            onClose: () => {
              this.onLogin(phone, password);
            },
          });
        }
      })
      .catch((e) => console.log(e));
  };

  onLogin = (username, password) => {
    const self = this;
    DeviceHelpers.get({
      success: ({ deviceId }) => {
        UserService.login(username, password, deviceId)
          .then(({ data }) => {
            if (data.error) {
              self.$f7.preloader.hide();
              toast.error("Account & password are incorrect !", {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 3000,
              });
              this.setState({
                password: "",
              });
            } else {
              const userData = data;
              const token = userData.token;
              setUserStorage(token, userData);
              SEND_TOKEN_FIREBASE().then(async (response) => {
                if (!response.error && response.Token) {
                  await UserService.authSendTokenFirebase({
                    Token: response.Token,
                    ID: userData.ID,
                    Type: userData.acc_type,
                  });
                  setTimeout(() => {
                    self.$f7.preloader.hide();
                    this.$f7router.navigate("/", {
                      animate: true,
                      transition: "f7-flip",
                    });
                  }, 300);
                } else {
                  setSubscribe(userData, () => {
                    setTimeout(() => {
                      self.$f7.preloader.hide();
                      this.$f7router.navigate("/", {
                        animate: true,
                        transition: "f7-flip",
                      });
                    }, 300);
                  });
                }
                userData?.ByStockID && setStockIDStorage(userData.ByStockID);
                userData?.StockName && setStockNameStorage(userData.StockName);
                setUserLoginStorage(username, password);
              });
            }
          })
          .catch((e) => console.log(e));
      },
    });
  };

  handleChangeInput = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  phoneChange = (e) => {
    const val = e.target.value;
    if (e.target.validity.valid) this.setState({ phone: e.target.value });
    else if (val === "" || val === "-") this.setState({ phone: val });
  };

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
    const { isLoading, isOpenStock, password, isReload } = this.state;
    return (
      <Page noNavbar noToolbar name="login">
        <div className="page-wrapper page-login page-login-iphone">
          <div className="page-login__back">
            <Link onClick={() => this.$f7router.back()}>
              <i className="las la-arrow-left"></i>
            </Link>
          </div>
          <div className={`page-login__content ${this.getClassStyle()}`}>
            <div className="page-login__logo">
              <div className="logo">
                <img
                  className="logo-reg"
                  src={SERVER_APP + "/app/images/logo-app.png"}
                />
              </div>
              <div className="title">Hello, Let's start creating an account</div>
            </div>
            <div className="page-login__form">
              <FormRegistration
                f7={this.$f7}
                f7router={this.$f7router}
                openSelectStock={() =>
                  this.setState({
                    isOpenStock: !this.state.isOpenStock,
                  })
                }
              />
            </div>
          </div>
          <div className="page-login__alert">
            Do you already have an account ? <Link href="/login/">Log in</Link>
          </div>
        </div>
        <SelectStock
          isOpenStock={isOpenStock}
          //nameStock={(name) => this.nameStock(name)}
          isReload={isReload}
          noReload={true}
        />
      </Page>
    );
  }
}
