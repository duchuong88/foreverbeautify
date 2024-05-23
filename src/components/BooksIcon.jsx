import React from "react";
import { Link } from "framework7-react";
import { IoCalendarOutline } from "react-icons/io5";
import { getUser } from "../constants/user";

export default class BooksIcon extends React.Component {
  constructor() {
    super();
    this.state = {
      countCart: 0,
    };
  }
  componentDidMount() {
  }
  handleNoti = () => {
    const _this = this;
    const infoUser = getUser();
    if (!infoUser) {
      _this.$f7.dialog.confirm(
        "Please log in to your account to use the date function.",
        () => {
          _this.$f7.views.main.router.navigate("/login/");
        }
      );
    } else {
      _this.$f7.views.main.router.navigate("/manage-schedules/");
    }
  };
  render() {
    const { countCart } = this.state;
    return (
      <Link noLinkClass onClick={() => this.handleNoti()}>
        <IoCalendarOutline />
        {countCart > 0 ? <span className="count">{countCart}</span> : ""}
      </Link>
    );
  }
}
