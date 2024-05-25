import React, { Fragment, useState } from "react";
import { SERVER_APP } from "./../../constants/config";
import { formatPriceVietnamese, checkSale } from "../../constants/format";
import _ from "lodash";
import {
  Page,
  Link,
  Toolbar,
  Navbar,
  Row,
  Col,
  Searchbar,
  Subnavbar,
} from "framework7-react";
import { getStockIDStorage, getUser } from "../../constants/user";
import ShopDataService from "./../../service/shop.service";
import ToolBarBottom from "../../components/ToolBarBottom";
import CategoriesList from "./components/CategoriesList/CategoriesList/CategoriesList";
import Skeleton from "react-loading-skeleton";
import PageNoData from "../../components/PageNoData";
import RenderTagsProd from "./components/RenderTagsProd";
import { TruncateLines } from "react-truncate-lines";
import clsx from "clsx";
import { toast } from "react-toastify";

const ButtonCart = ({ item, f7, f7router }) => {
  const [loading, setLoading] = useState(false);

  const orderSubmit = () => {
    const infoUser = getUser();
    const getStock = getStockIDStorage();
    if (!infoUser) {
      f7router.navigate("/login/");
      return false;
    } else {
      setLoading(true);
      const data = {
        order: {
          ID: 0,
          SenderID: infoUser.ID,
          Tinh: 5,
          Huyen: 37,
          MethodPayID: 1,
        },
        adds: [
          {
            ProdID: item.id,
            Qty: 1,
          },
        ],
        forceStockID: getStock,
      };
      ShopDataService.getUpdateOrder(data)
        .then((response) => {
          const { errors } = response.data.data;
          setLoading(false);
          if (response.data.success) {
            if (errors && errors.length > 0) {
              toast.error(errors.join(", "), {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 1500,
              });
            } else {
              toast.success(`Added item to cart successfully !`, {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 3000,
              });
              f7router.navigate("/pay/");
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <div className="w-55px d--f jc--c ai--c">
      <div
        className={clsx(
          "cursor-pointer btn-shopping btn-shopping-sm",
          loading && "loading"
        )}
        onClick={orderSubmit}
      >
        <i className="las la-plus"></i>
      </div>
    </div>
  );
};

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      itemView: window?.GlobalConfig?.APP?.UIBase ? 16 : 8, // Số item hiển thị trên 1 Page
      arrCateList: [],
      Pi: 1,
      Count: 0,
      titlePage: "",
      showPreloader: false,
      allowInfinite: true,
      parentCateID: "",
      CateID: "",
      CateIDall: 662,
      currentId: 0,
      loading: false,
      keySearch: "",
    };

    this.delayedCallback = _.debounce(this.inputCallback, 400);
  }

  getDataList = (ID, pi, ps, tag, keys) => {
    var $$ = this.Dom7;
    var container = $$(".page-content");
    container.scrollTop(0, 300);
    //ID Cate
    //Trang hiện tại
    //Số sản phẩm trên trang
    // Tag
    //keys Từ khóa tìm kiếm
    let stockid = getStockIDStorage();
    if (!stockid) {
      stockid = 0;
    }
    ShopDataService.getList(
      ID,
      pi,
      ps,
      tag,
      keys,
      stockid,
      this.state.currentId !== "hot" || this.$f7route.params.cateId !== "hot"
        ? ""
        : "3"
    )
      .then((response) => {
        const { lst, pcount, pi } = response.data.data;
        this.setState({
          arrCateList: lst,
          Pi: pi,
          Count: pcount,
          loading: false,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };
  getTitleCate = (id) => {
    const CateID = id || this.$f7route.params.cateId;
    ShopDataService.getTitleCate(CateID)
      .then((response) => {
        let {Title, ID} = response.data.data[0]
        let newTitle = Title
        if(ID === 794) {
          newTitle = "Products"
        }

        this.setState({
          titlePage: newTitle,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };
  componentDidMount() {
    this.setState({
      loading: true,
    });
    this.$f7ready((f7) => {
      const parentCateID = this.$f7route.params.parentId;
      const CateID = this.$f7route.params.cateId;
      const itemView = this.state.itemView;
      this.setState({
        parentCateID: parentCateID,
        CateID: CateID,
        currentId: this.$f7route.params.cateId,
      });

      if (CateID === "hot") {
        this.setState({
          titlePage: "What's on sale today ?",
          isTag: "hot",
        });
        this.getDataList(CateID, "1", itemView, "hot", "");
      } else {
        this.getDataList(CateID, "1", itemView, "", "");
        this.getTitleCate();
      }
    });
  }
  loadMore = () => {
    const {
      arrCateList,
      Count,
      Pi,
      currentId,
      showPreloader,
      itemView,
      isTag,
      keySearch,
    } = this.state;
    if (Pi >= Count) {
      return false;
    }
    if (showPreloader) return false;
    this.setState({ showPreloader: true });
    const CateID = currentId || this.$f7route.params.cateId;
    let stockid = getStockIDStorage();
    stockid ? stockid : 0;

    const tag = isTag && !keySearch ? isTag : "";
    const keys = keySearch ? keySearch : "";

    ShopDataService.getList(
      CateID,
      Pi + 1,
      itemView,
      tag,
      keys,
      stockid,
      this.$f7route.params.cateId === "hot" ? "3" : ""
    )
      .then(({ data }) => {
        const { lst, pcount, pi } = data.data;
        const arrCateListNew = [...arrCateList, ...lst];
        this.setState({
          arrCateList: arrCateListNew,
          isLoading: false,
          Count: pcount,
          showPreloader: false,
          Pi: pi,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  loadRefresh(done) {
    setTimeout(() => {
      const CateID = this.state.currentId || this.$f7route.params.cateId;
      const itemView = this.state.itemView;

      if (CateID === "hot") {
        this.setState({
          titlePage: "What's on sale today ?",
          isTag: "hot",
        });
        this.getDataList(CateID, "1", itemView, "hot", "");
      } else {
        this.getDataList(CateID, "1", itemView, "", this.state.keySearch);
        this.getTitleCate();
      }
      this.setState({
        allowInfinite: true,
        showPreloader: true,
      });
      done();
    }, 1000);
  }
  inputCallback = (value) => {
    const newCateId = this.state.currentId || 794;
    const key = value;
    const itemView = this.state.itemView;
    this.getDataList(newCateId, "1", itemView, "", key);
    this.setState({
      keySearch: value,
    });
  };
  handleInputSearch = (event) => {
    const key = event.target.value;
    event.persist();
    this.delayedCallback(key);
  };

  hideSearch = () => {
    const CateID = this.state.currentId || this.$f7route.params.cateId;
    const itemView = this.state.itemView;

    if (CateID === "hot") {
      this.getDataList(CateID, "1", itemView, "hot", "");
    } else {
      this.getDataList(CateID, "1", itemView, "", "");
    }
    this.setState({
      showPreloader: false,
      keySearch: "",
    });
  };

  changeCate = (cate) => {
    const itemView = this.state.itemView;
    this.setState({
      currentId: cate.ID,
      loading: true,
      Pi: 1,
      Count: 0,
      showPreloader: false,
    });
    this.getDataList(cate.ID, "1", itemView, "", "");
    this.getTitleCate(cate.ID);
  };

  render() {
    const { arrCateList, CateID, currentId, loading } = this.state;
    return (
      <Page
        name="shop-List"
        infinite
        ptr
        infiniteDistance={50}
        infinitePreloader={this.state.showPreloader}
        onInfinite={() => this.loadMore()}
        onPtrRefresh={this.loadRefresh.bind(this)}
      >
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link
                onClick={
                  () => this.$f7router.back()
                  // {
                  //   url: '/shop/',
                  //   force: true,
                  //   ignoreCache: true,
                  // }
                }
              >
                <i className="las la-angle-left"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">{this.state.titlePage}</span>
            </div>
            <div className="page-navbar__noti search">
              <Link searchbarEnable=".searchbar-product">
                <i className="las la-search"></i>
              </Link>
            </div>
          </div>
          <Searchbar
            className="searchbar-product"
            expandable
            customSearch={true}
            disableButton={!this.$theme.aurora}
            placeholder="You need to find ?"
            disableButtonText="Close"
            clearButton={true}
            onChange={this.handleInputSearch}
            onClickClear={() => this.hideSearch()}
            onClickDisable={() => this.hideSearch()}
          ></Searchbar>
          {this.$f7route.query?.subnav === "1" ||
          this.$f7route.params.cateId === "hot" ? (
            ""
          ) : (
            <Subnavbar className="subnavbar-prod">
              <CategoriesList
                id={CateID}
                currentId={currentId}
                changeCate={(cate) => this.changeCate(cate)}
              />
            </Subnavbar>
          )}
        </Navbar>
        <div
          className={clsx(
            "page-render page-render-shop p-0",
            window?.GlobalConfig?.APP?.UIBase ? "bg-white" : "no-bg"
          )}
        >
          <div
            className={clsx(
              "page-shop",
              window?.GlobalConfig?.APP?.UIBase
                ? "bg-white px-15px"
                : "no-bg p-15px"
            )}
          >
            <div className="page-shop__list">
              <Row>
                {!loading && (
                  <React.Fragment>
                    {arrCateList && arrCateList.length > 0 ? (
                      arrCateList.map((item, index) => (
                        <Fragment key={index}>
                          {window?.GlobalConfig?.APP?.UIBase ? (
                            <Col width="100">
                              <div className="border-bottom d-flex">
                                <div className="page-shop__list-text h-auto ai--fs text-left py-15px f--1">
                                  <h3 className="p-0">{item.title}</h3>
                                  <div
                                    className={
                                      "page-shop__list-price jc--fs " +
                                      (item.source.IsDisplayPrice !== 0 &&
                                      checkSale(
                                        item.source.SaleBegin,
                                        item.source.SaleEnd,
                                        item.pricesale
                                      ) === true
                                        ? "sale"
                                        : "")
                                    }
                                  >
                                    {item.source.IsDisplayPrice === 0 ? (
                                      <span className="price">Contact</span>
                                    ) : (
                                      <React.Fragment>
                                        <span className="price">
                                          <b>sgd</b>
                                          {formatPriceVietnamese(item.price)}
                                        </span>
                                        <span className="price-sale">
                                          <b>sgd</b>
                                          {formatPriceVietnamese(
                                            item.pricesale
                                          )}
                                        </span>
                                      </React.Fragment>
                                    )}
                                  </div>
                                </div>
                                <ButtonCart
                                  item={item}
                                  f7={this.$f7}
                                  f7router={this.$f7router}
                                />
                              </div>
                            </Col>
                          ) : (
                            <Col width="50">
                              <a
                                href={"/shop/detail/" + item.id}
                                className="page-shop__list-item"
                              >
                                <div className="page-shop__list-img">
                                  <img
                                    src={
                                      SERVER_APP + "/Upload/image/" + item.photo
                                    }
                                    alt={item.title}
                                  />
                                  <RenderTagsProd
                                    status={item?.source?.Status}
                                  />
                                </div>
                                <div className="page-shop__list-text">
                                  <h3>
                                    <TruncateLines
                                      lines={2}
                                      ellipsis={<span>...</span>}
                                    >
                                      {item.title}
                                    </TruncateLines>
                                  </h3>
                                  <div
                                    className={
                                      "page-shop__list-price " +
                                      (item.source.IsDisplayPrice !== 0 &&
                                      checkSale(
                                        item.source.SaleBegin,
                                        item.source.SaleEnd,
                                        item.pricesale
                                      ) === true
                                        ? "sale"
                                        : "")
                                    }
                                  >
                                    {item.source.IsDisplayPrice === 0 ? (
                                      <span className="price">Contact</span>
                                    ) : (
                                      <React.Fragment>
                                        <span className="price">
                                          <b>sgd</b>
                                          {formatPriceVietnamese(item.price)}
                                        </span>
                                        <span className="price-sale">
                                          <b>sgd</b>
                                          {formatPriceVietnamese(
                                            item.pricesale
                                          )}
                                        </span>
                                      </React.Fragment>
                                    )}
                                  </div>
                                </div>
                              </a>
                            </Col>
                          )}
                        </Fragment>
                      ))
                    ) : (
                      <PageNoData text={"No Data"} />
                    )}
                  </React.Fragment>
                )}
                {loading &&
                  Array(6)
                    .fill()
                    .map((item, index) => (
                      <Col width="50" key={index}>
                        <a className="page-shop__list-item">
                          <div className="page-shop__list-img">
                            <Skeleton height={165} />
                          </div>
                          <div className="page-shop__list-text">
                            <h3>
                              <Skeleton width={125} />
                            </h3>
                            <div className={"page-shop__list-price sale"}>
                              <span className="price">
                                <Skeleton width={60} />
                              </span>
                              <span className="price-sale">
                                <Skeleton width={60} />
                              </span>
                            </div>
                          </div>
                        </a>
                      </Col>
                    ))}
              </Row>
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
