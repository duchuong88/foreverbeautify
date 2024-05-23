import React from "react";
import { SERVER_APP } from "../constants/config";
import {
  maxBookDate,
  formatPriceVietnamese,
  formatDateSv,
  formatDateNotYYYY,
  checkAvt2,
} from "../constants/format";
import { Popover, Link } from "framework7-react";
import NoProduct from "../assets/images/no-product.png";

export default class ItemCardService extends React.Component {
  checkStatus = (status) => {
    return status;
  };
  render() {
    const { item } = this.props;
    return (
      <div className="cardservice-item__service">
        <div className="cardservice-item__service-img">
          {window?.GlobalConfig?.APP?.UIBase ? (
            <div className="h-200px" style={{ background: "#7d7d7d" }}></div>
          ) : (
            <img
              className="w-100"
              src={SERVER_APP + "/Upload/image/" + item.Product.Thumbnail}
              onError={(e) => {
                e.target.src = NoProduct;
              }}
            />
          )}

          <div className="cardservice-item__service-text">
            <h4 className="title">
              {item.OrderItem.ProdTitle} <span>({item.Title})</span>
            </h4>
            <ul>
              {!window?.GlobalConfig?.APP?.Services?.PriceCardHide && (
                <li>
                  <span>Price : </span>
                  <span>{formatPriceVietnamese(item.OrderItem.ToPay)}</span>
                </li>
              )}

              <li>
                <span>Use the end time : </span>
                <span>{maxBookDate(item.Services)}</span>
              </li>
              <li>
                <span>Expiry : </span>
                <span>{formatDateSv(item.EndDate)}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="cardservice-item__service-list">
          {item.Services.map((sub, i) => (
            <div className="item" key={i}>
              <div className={"item-box " + this.checkStatus(sub.Status)}>
                <span className="count">{i + 1}</span>
                <span className="hours">
                  <i className="las la-clock"></i>
                  {sub.Minutes}p
                </span>
                {sub.Meta && sub.Meta.search("gift") > -1 && (
                  <span className="gift">
                    <i className="las la-gift"></i>
                  </span>
                )}
                {sub.IsWarrant && (
                  <span className="insu">
                    <i className="las la-user-shield"></i>
                  </span>
                )}
                <span className="date">{formatDateNotYYYY(sub.BookDate)}</span>
                {sub.Staffs &&
                  sub.Staffs.map((user, x) => (
                    <Link
                      noLinkClass
                      className="link-avatar"
                      popoverOpen={".popover-menu-" + user.ID}
                      key={x}
                    >
                      <span key={x} className="avatar">
                        <img src={checkAvt2(user.Avatar)} alt={user.FullName} />
                        <Popover className={"popover-menu-" + user.ID}>
                          <div className="popover-name-nav">
                            Thực hiện : <span>{user.FullName}</span>
                          </div>
                        </Popover>
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
