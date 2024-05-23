import React from "react";
import { Link } from "framework7-react";
import { getUser } from "../constants/user";
import ShopDataService from "../service/shop.service";
import Skeleton from "react-loading-skeleton";
export default class CartComponent extends React.Component {
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
    if (!infoUser) {
      return false;
    }

    const data = {
      order: {
        ID: 0,
        SenderID: infoUser.ID,
        VCode: "",
      },
      addProps: "ProdTitle",
    };
    ShopDataService.getUpdateOrder(data)
      .then((response) => {
        const data = response.data.data;
        if (response.data.success) {
            this.setState({
              countOrder: data.items.length,
            });
        }
      })
      .catch((er) => console.log(er));
  };

    render() {
        const { countOrder } = this.state;
        if (countOrder > 0) {
            return (
              <Link className="icon-cart-component" noLinkClass href="/pay/">
                <i className="las la-shopping-cart"></i>
                <span className="count">
                  {countOrder ? countOrder : <Skeleton circle={true} height={15} width={15} />}
                </span>
              </Link>
            );
        }
        else {
            return("")
        } 
  }
}