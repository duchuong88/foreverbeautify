import React from "react";
import { Link } from "framework7-react";
import { getUser } from "../constants/user";
import ShopDataService from "../service/shop.service";
import { GrCart } from "react-icons/gr";

export default class CartToolBar extends React.Component {
  constructor() {
    super();
    this.state = {
      countOrder: 0,
    };
  }
  componentDidMount() {
    this.getOrder();
  }
  getOrder = () => {
    const infoUser = getUser();
    if (!infoUser || infoUser.acc_type !== "M") {
      return false;
    }

    const data = {
      order: {
        ID: 0,
        SenderID: infoUser.ID,
        VCode: null,
      },
      addProps: "ProdTitle",
    };
    ShopDataService.getUpdateOrder(data)
      .then((response) => {
        const { items } = response.data.data;
        if (items && items.length > 0) {
          this.setState({
            countOrder: items.length,
          });
        }
      })
      .catch((er) => console.log(er));
  };

  handleCart = () => {
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
      _this.$f7.views.main.router.navigate("/pay/");
    }
  };

  render() {
    const { countOrder } = this.state;
    if (countOrder < 1) return "";
    return (
      <Link
        noLinkClass
        className="icon-cart-toolbar"
        onClick={() => this.handleCart()}
      >
        <GrCart />
        {countOrder > 0 ? <span className="count">{countOrder}</span> : ""}
      </Link>
    );
  }
}
