import React from "react";
import { Link } from "framework7-react";
import { FaRegBell } from "react-icons/fa";
import { getUser } from "../constants/user";
import UserService from "../service/user.service";

export default class NotificationIcon extends React.Component {
  constructor() {
    super();
      this.state = {
        countCart: 0
    };
  }
  componentDidMount() {
    this.getNotification();
  }
  getNotification = () => {
    const _this = this;
    const infoUser = getUser();
    if (!infoUser) {
      return false;
    }
    UserService.getNotification(infoUser.acc_type, infoUser.acc_id, 0, 200)
      .then((response) => {
        const data = response.data.data;
          const dataNew = data.filter((item) => item.IsReaded === false);
          this.setState({
            countCart: dataNew.length,
          });
      })
      .catch((er) => console.log(er));
  };
  handleNoti = () => {
    const _this = this;
    const infoUser = getUser();
    if (!infoUser) {
      _this.$f7.dialog.confirm(
        "Please log in to your account to use daily functions.",
        () => {
          _this.$f7.views.main.router.navigate("/login/");
        }
      );
    } else {
      _this.$f7.views.main.router.navigate("/notification/");
    }
  };
    render() {
      const { countCart } = this.state;
    return (
      <Link
        className={countCart > 0 ? "notification--animation" : ""}
        noLinkClass
        onClick={() => this.handleNoti()}
      >
        <FaRegBell />
        {countCart > 0 ? <span className="count">{countCart}</span> : ""}
      </Link>
    );
  }
}