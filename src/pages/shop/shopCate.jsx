import React from "react";
import { SERVER_APP } from "./../../constants/config";
import ShopDataService from "./../../service/shop.service";
import { Page, Link, Toolbar, Navbar } from "framework7-react";
import ReactHtmlParser from "react-html-parser";
import ToolBarBottom from "../../components/ToolBarBottom";
import NotificationIcon from "../../components/NotificationIcon";
import { getStockIDStorage } from "../../constants/user";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      arrCate: [],
    };
  }
  componentDidMount() {
    this.$f7ready((f7) => {
      const cateID = this.$f7route.params.cateId;
      const stockid = getStockIDStorage();
      stockid ? stockid : 0;
      ShopDataService.getCate(cateID, stockid)
        .then((response) => {
          const arrCate = response.data;
          const arrCateNew = arrCate.filter((item) => item.IsPublic !== 0);
          this.setState({
            arrCate: arrCateNew,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }
  getTitle = () => {
    if (this.$f7route.params.cateId === "795") {
      return "Danh Mục Dịch Vụ";
    } else {
      return "Danh Mục Sản Phẩm";
    }
  };
  render() {
    const { arrCate } = this.state;
    return (
      <Page name="shop-cate">
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link onClick={() => this.$f7router.back()}>
                <i className="las la-angle-left"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">{this.getTitle()}</span>
            </div>
            <div className="page-navbar__noti">
              <NotificationIcon />
            </div>
          </div>
        </Navbar>
        <div className="page-render no-bg">
          <div className="page-shop no-bg">
            <div className="page-shop__cate">
              {arrCate &&
                arrCate.map((item) => (
                  <a
                    href={"/shop/list/" + item.ParentID + "/" + item.ID}
                    className="page-shop__cate-item"
                    key={item.ID}
                  >
                    <div className="page-shop__cate-img">
                      <img
                        src={SERVER_APP + "/Upload/image/" + item.Thumbnail2}
                        alt={item.Title}
                      />
                    </div>
                    <div className="page-shop__cate-text">
                      <h3>{item.Title}</h3>
                      <div className="page-shop__cate-desc">
                        {ReactHtmlParser(item.Desc)}
                      </div>
                      <i className="las la-arrow-right"></i>
                    </div>
                  </a>
                ))}
            </div>
          </div>
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
