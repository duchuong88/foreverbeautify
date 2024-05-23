import { Link, Navbar, Page, Toolbar } from "framework7-react";
import React from "react";
import NotificationIcon from "../../components/NotificationIcon";
import ShopDataService from "./../../service/shop.service";
import { getStockIDStorage, getUser } from "../../constants/user";
import { SERVER_APP } from "../../constants/config";
import NoProduct from "../../assets/images/no-product.png";
import ReactHtmlParser from "react-html-parser";
import ShopListServiceItem from "./shopListServiceItem";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      data: null,
    };
  }

  componentDidMount() {
    this.getDetialService();
  }

  getDetialService = async () => {
    this.setState({ loading: true });
    const id = this.$f7route.params.id;
    let stockid = getStockIDStorage();
    stockid ? stockid : 0;
    ShopDataService.getServiceParent(795, stockid, 1, 1, 1, id)
      .then(({ data }) => {
        const { lst } = data;
        if (lst && lst.length > 0) {
          this.setState({
            loading: false,
            data: lst[0],
          });
        } else {
          this.$f7router.navigate("/");
        }
      })
      .catch((e) => console.log(e));
  };

  fixedContentDomain = (content) => {
    if (!content) return "";
    return content.replace(/src=\"\//g, 'src="' + SERVER_APP + "/");
  };

  render() {
    let { data, loading } = this.state;

    const userInfo = getUser();

    return (
      <Page name="service-original" className="bg-white_">
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link onClick={() => this.$f7router.back()}>
                <i className="las la-angle-left"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">
                {loading ? "Đang tải ..." : data?.root.Title}
              </span>
            </div>
            <div className="page-navbar__noti">
              <NotificationIcon />
            </div>
          </div>
        </Navbar>
        <div>
          <div>
            <img
              src={SERVER_APP + "/Upload/image/" + data?.root.Thumbnail}
              alt={data?.root.Title}
              onError={(e) => {
                e.target.src = NoProduct;
              }}
            />
          </div>
          <div className="p-15px page-shop__service-item">
            <div
              className="mb-8 fw-600"
              style={{
                fontSize: "17px",
                color: "var(--ezs-color)",
              }}
            >
              {data?.root.Title}
            </div>
            <div className="content_">
              {ReactHtmlParser(data?.root.Desc)}
              {ReactHtmlParser(this.fixedContentDomain(data?.root.Detail))}
            </div>
            <ShopListServiceItem item={data} f7router={this.$f7router} />
          </div>
        </div>
        <Toolbar tabbar position="bottom">
          <Link
            href={
              userInfo
                ? `/schedule/?SelectedTitle=${data?.root.Title}&SelectedId=${data?.root.ID}`
                : "/login/"
            }
            className="page-btn-order btn-submit-order text-white font-size-md fw-500"
            style={{
              fontSize: "16px",
            }}
          >
            Booking Now
          </Link>
        </Toolbar>
      </Page>
    );
  }
}
