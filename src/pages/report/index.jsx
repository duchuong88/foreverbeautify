import React from "react";
import { Link, Navbar, Page, Toolbar } from "framework7-react";
import ToolBarBottom from "../../components/ToolBarBottom";
import NotificationIcon from "../../components/NotificationIcon";
import SelectStock from "../../components/SelectStock";
import { getStockIDStorage, getUser } from "../../constants/user";
import IframeReport from "./IframeReport";

window.Info = {
  User: getUser(),
  Stocks: [],
  CrStockID: getStockIDStorage(),
};

window.token = localStorage.getItem("token");

export default class Report extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpenStock: false,
      isShow: false,
    };
  }

  componentDidMount() {}

  openStock = () => {
    this.setState({
      isOpenStock: !this.state.isOpenStock,
    });
  };

  render() {
    return (
      <Page name="employee-service">
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link onClick={() => this.openStock()}>
                <i className="las la-map-marked-alt"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">
                Báo cáo
              </span>
            </div>
            <div className="page-navbar__noti">
              <NotificationIcon />
            </div>
          </div>
        </Navbar>
        <div className="h-100">
          <IframeReport f7={this.$f7} />
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
        <SelectStock
          isOpenStock={this.state.isOpenStock}
          nameStock={(name) => {
            this.$f7.views.main.router.navigate(
              this.$f7.views.main.router.url,
              {
                reloadCurrent: true,
              }
            );
          }}
        />
      </Page>
    );
  }
}
