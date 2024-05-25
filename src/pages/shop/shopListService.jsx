import React, { Fragment } from "react";
import { SERVER_APP } from "./../../constants/config";
import { formatPriceVietnamese, checkSale } from "../../constants/format";
import { getStockIDStorage, getUser } from "../../constants/user";
import {
  Page,
  Link,
  Toolbar,
  Navbar,
  Sheet,
  PageContent,
  Button,
  Searchbar,
  Subnavbar,
} from "framework7-react";
import ShopDataService from "./../../service/shop.service";
import ReactHtmlParser from "react-html-parser";
import ToolBarBottom from "../../components/ToolBarBottom";
import _ from "lodash";
import SkeletonListService from "./components/Skeleton/SkeletonListService";
import CategoriesList from "./components/CategoriesList/CategoriesList/CategoriesList";
import ShopListServiceItem from "./shopListServiceItem";
import NoProduct from "../../assets/images/no-product.png";
import clsx from "clsx";
import axios from "axios";
import PickerDetail from "./components/PickerDetail";

const CancelToken = axios.CancelToken;
let cancel;

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Pi: 1,
      Count: 0,
      sheetOpened: false,
      titlePage: "",
      arrService: [],
      arrSearch: [],
      isSearch: false,
      isLoading: false,
      CateID: "",
      currentId: 0,
      keySearch: "",
      idOpen: null,
      showPreloader: false,
    };

    this.delayedCallback = _.debounce(this.inputCallback, 400);
  }
  getService = (id) => {
    if (cancel !== undefined) cancel();
    var $$ = this.Dom7;
    var container = $$(".page-content");
    container.scrollTop(0, 300);
    const { Pi } = this.state;
    const CateID = id || this.$f7route.params.cateId;
    let stockid = getStockIDStorage();
    stockid ? stockid : 0;
    this.setState({
      isLoading: true,
    });
    ShopDataService.getServiceParentCancel(
      CateID,
      stockid,
      Pi,
      window?.GlobalConfig?.APP?.UIBase ? 6 : 4,
      1,
      "",
      {
        cancelToken: new CancelToken((c) => (cancel = c)),
      }
    )
      .then(({ data }) => {
        const { lst, pcount, pi } = data;
        this.setState({
          arrService: lst,
          isLoading: false,
          Count: pcount,
          Pi: pi,
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
        const titlePage = response.data.data[0].Title;
        this.setState({
          titlePage: titlePage,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  componentDidMount() {
    this.setState({
      CateID:
        (this.$f7route.query && this.$f7route.query.cateid) ||
        this.$f7route.params.cateId,
      currentId: this.$f7route.params.cateId,
    });

    this.timer = setTimeout(() => {
      if (this.$f7route.query && this.$f7route.query.ids) {
        this.setState((prevState) => ({ idOpen: this.$f7route.query.ids }));
      }
    }, 300);

    this.$f7ready((f7) => {
      this.getTitleCate();
      this.getService();
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  inputCallback = (value) => {
    const { CateID, currentId } = this.state;
    const key = value;
    let stockid = getStockIDStorage();
    if (!stockid) {
      stockid = 0;
    }
    ShopDataService.getSearchService(key, currentId || CateID, stockid)
      .then((response) => {
        const arrSearch = response.data.data.lst;
        this.setState({
          arrSearch: arrSearch,
          isSearch: true,
          keySearch: key,
        });
      })
      .catch((e) => console.log(e));
  };

  handleInputSearch = (event) => {
    const key = event.target.value;
    event.persist();
    this.delayedCallback(key);
  };

  hideSearch = () => {
    this.setState({
      arrSearch: [],
      isSearch: false,
      keySearch: "",
    });
  };

  loadRefresh(done) {
    const self = this;
    const { CateID, currentId, keySearch, isSearch } = this.state;
    setTimeout(() => {
      this.setState({ idOpen: "", Pi: 1 });
      if (isSearch) {
        self.delayedCallback(keySearch);
      } else {
        self.getService(currentId || CateID);
      }
      done();
    }, 1000);
  }

  changeCate = (cate) => {
    this.setState({
      loading: true,
      currentId: cate.ID,
      idOpen: "",
      Pi: 1,
      Count: 0,
    });
    this.getService(cate.ID);
    this.getTitleCate(cate.ID);
    // this.$f7router.navigate(this.$f7router.currentRoute.url, {
    //   ignoreCache  : true,
    //   reloadCurrent : true
    // });
  };

  fixedContentDomain = (content) => {
    if (!content) return "";
    return content.replace(/src=\"\//g, 'src="' + SERVER_APP + "/");
  };

  loadMoreAsync = () => {
    const { arrService, Count, Pi, currentId, showPreloader, isSearch } =
      this.state;
    if (isSearch) return;
    if (Pi >= Count) {
      return false;
    }
    if (showPreloader) return false;
    this.setState({ showPreloader: true });
    const CateID = currentId || this.$f7route.params.cateId;
    let stockid = getStockIDStorage();
    stockid ? stockid : 0;

    ShopDataService.getServiceParent(CateID, stockid, Pi + 1, window?.GlobalConfig?.APP?.UIBase ? 6 : 4, 1)
      .then(({ data }) => {
        const { lst, pcount, pi } = data;
        const arrServiceNew = [...arrService, ...lst];
        this.setState({
          arrService: arrServiceNew,
          isLoading: false,
          Count: pcount,
          showPreloader: false,
          Pi: pi,
        });
      })
      .catch((e) => console.log(e));
  };

  render() {
    const {
      arrService,
      arrSearch,
      isSearch,
      isLoading,
      CateID,
      currentId,
      idOpen,
      showPreloader,
    } = this.state;

    const userInfo = getUser();

    return (
      <Page
        name="shop-List"
        onPageBeforeOut={this.onPageBeforeOut.bind(this)}
        onPageBeforeRemove={this.onPageBeforeRemove.bind(this)}
        ptr
        infinite
        infiniteDistance={50}
        infinitePreloader={showPreloader}
        onPtrRefresh={this.loadRefresh.bind(this)}
        onInfinite={() => this.loadMoreAsync()}
      >
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link onClick={() => this.$f7router.back()}>
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
            placeholder="Services to look for ?"
            disableButtonText="Close"
            clearButton={true}
            onChange={this.handleInputSearch}
            onClickClear={() => this.hideSearch()}
            onClickDisable={() => this.hideSearch()}
          ></Searchbar>
          <Subnavbar className="subnavbar-prod">
            <CategoriesList
              id={CateID}
              currentId={currentId}
              changeCate={(cate) => this.changeCate(cate)}
            />
          </Subnavbar>
        </Navbar>
        <div className="page-render p-0">
          {!isSearch && (
            <div className="page-shop page-shop-scroll p-15px">
              <div className="page-shop__service">
                {isLoading && <SkeletonListService />}
                {!isLoading && (
                  <div className="page-shop__service-list">
                    {arrService &&
                      arrService.map((item, index) => (
                        <Fragment key={index}>
                          <div className="page-shop__service-item">
                            <div className="page-shop__service-item service-about">
                              <div
                                className={clsx(
                                  "service-about__img",
                                  window?.GlobalConfig?.APP?.UIBase && "d-none"
                                )}
                              >
                                <img
                                  onClick={() =>
                                    this.setState({ idOpen: item.root.ID })
                                  }
                                  src={
                                    SERVER_APP +
                                    "/Upload/image/" +
                                    item.root.Thumbnail
                                  }
                                  alt={item.root.Title}
                                  onError={(e) => {
                                    e.target.src = NoProduct;
                                  }}
                                />
                                <Link
                                  href={
                                    userInfo
                                      ? `/schedule/?SelectedTitle=${item.root.Title}&SelectedId=${item.root.ID}`
                                      : "/login/"
                                  }
                                  className="_btn"
                                >
                                  Book Now
                                </Link>
                              </div>
                              <div
                                className={clsx(
                                  "service-about__title",
                                  window?.GlobalConfig?.APP?.UIBase &&
                                    "pb-20px pr-80px"
                                )}
                                onClick={() =>
                                  this.setState({ idOpen: item.root.ID })
                                }
                              >
                                {item.root.Title}
                                {window?.GlobalConfig?.APP?.UIBase ? (
                                  <Link
                                    href={
                                      userInfo
                                        ? `/schedule/?SelectedTitle=${item.root.Title}&SelectedId=${item.root.ID}`
                                        : "/login/"
                                    }
                                    className="_btn"
                                  >
                                    Book
                                  </Link>
                                ) : (
                                  ""
                                )}
                              </div>
                              {window.GlobalConfig.APP.Prod.IsDetailOriginal &&
                              (item.root.Desc !== "" || item.root.Detail) ? (
                                <div className="service-about__content">
                                  {item.root.Desc && (
                                    <div className="service-about__content-text">
                                      {ReactHtmlParser(item.root.Desc)}
                                    </div>
                                  )}
                                  <PickerDetail item={item}>
                                    {({ open }) => (
                                      <Button fill className="show-more" onClick={open}>
                                        Chi tiết{" "}
                                        <i className="las la-angle-right"></i>
                                      </Button>
                                    )}
                                  </PickerDetail>
                                  {/* <Sheet
                                    opened={Number(idOpen) === item.root.ID}
                                    className={`demo-sheet-${item.root.ID} sheet-detail`}
                                    style={{
                                      height: "auto",
                                      "--f7-sheet-bg-color": "#fff",
                                    }}
                                    //swipeToClose
                                    onSheetClosed={() => {
                                      this.setState({ idOpen: "" });
                                    }}
                                    backdrop
                                  >
                                    <Button
                                      sheetClose={`.demo-sheet-${item.root.ID}`}
                                      className="show-more"
                                    >
                                      <i className="las la-times"></i>
                                    </Button>
                                    <PageContent>
                                      <div className="page-shop__service-detail">
                                        <div className="title">
                                          <h4>{item.root.Title}</h4>
                                        </div>
                                        <div className="content">
                                          {ReactHtmlParser(item.root.Desc)}
                                          {ReactHtmlParser(
                                            this.fixedContentDomain(
                                              item.root.Detail
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </PageContent>
                                  </Sheet> */}
                                </div>
                              ) : (
                                ""
                              )}
                              <ShopListServiceItem
                                item={item}
                                f7router={this.$f7router}
                              />
                            </div>
                          </div>
                        </Fragment>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {isSearch && (
            <div className="page-shop p-15px">
              <div className="page-shop__service">
                <div className="page-shop__service-list">
                  <div className="page-shop__service-item">
                    <div className="page-shop__service-item service-about">
                      <div className="service-about__list">
                        <ul>
                          {arrSearch &&
                            arrSearch.map((item) => (
                              <li key={item.id}>
                                <Link
                                  href={
                                    "/shop/detail/" + item.id + "?Type=Service"
                                  }
                                >
                                  <div className="title">{item.title}</div>
                                  <div
                                    className={
                                      "price " +
                                      (item.source.IsDisplayPrice !== 0 &&
                                      checkSale(
                                        item.source.SaleBegin,
                                        item.source.SaleEnd,
                                        item.source.PriceSale
                                      ) === true
                                        ? "sale"
                                        : "")
                                    }
                                  >
                                    {item.source.IsDisplayPrice === 0 ? (
                                      <span className="price-to">Contact</span>
                                    ) : (
                                      <React.Fragment>
                                        <span className="price-to">
                                          {formatPriceVietnamese(
                                            item.source.PriceProduct
                                          )}
                                          <b>sgd</b>
                                        </span>
                                        <span className="price-sale">
                                          {formatPriceVietnamese(
                                            item.source.PriceSale
                                          )}
                                          <b>sgd</b>
                                        </span>
                                      </React.Fragment>
                                    )}
                                  </div>
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }

  onPageBeforeOut() {
    const self = this;
    // Close opened sheets on page out
    self.$f7.sheet.close();
  }
  onPageBeforeRemove() {
    const self = this;
    // Destroy sheet modal when page removed
    if (self.sheet) self.sheet.destroy();
  }
}
