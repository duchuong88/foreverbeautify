import React from "react";
import { SERVER_APP } from "./../../constants/config";
import {
  formatPriceVietnamese,
  checkSale,
  percentagesSale,
} from "../../constants/format";
import { getUser, setViewed, getStockIDStorage } from "../../constants/user";
import ShopDataService from "./../../service/shop.service";
import CartToolBar from "../../components/CartToolBar";
import {
  Page,
  Link,
  Toolbar,
  Navbar,
  PhotoBrowser,
  Sheet,
} from "framework7-react";
import ReactHtmlParser from "react-html-parser";
import { toast } from "react-toastify";
import SkeletonThumbnail from "./components/Detail/SkeletonThumbnail";
import SelectStock from "../../components/SelectStock";
import { Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import { CopyToClipboard } from "react-copy-to-clipboard";
import _ from "lodash";
import NoProduct from "../../assets/images/no-product.png";
import { checkSLDisabled } from "../../constants/helpers";
import { OPEN_LINK } from "../../constants/prom21";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      arrProductCurrent: [],
      arrProduct: [],
      arrRelProds: [],
      arrImages: [],
      arrOptions: [],
      arrCombos: [],
      aff: {},
      photos: [],
      OriginalCurrent: null,
      sheetOpened: false,
      activeID: null,
      quantity: 1,
      isLoading: false,
      isProbably: false,
      statusLoading: true,
      isOpenStock: false,
      copied: false,
      showPreloader: false,
    };
  }

  getDetialProduct = async () => {
    const infoUser = getUser();
    const userId = infoUser ? infoUser.ID : "";
    const cateID = this.$f7route.params.cateId;

    try {
      const { data: result } = await ShopDataService.getDetailFull(
        cateID,
        userId,
        getStockIDStorage() || 0
      );
      const resultRes = result.data;
      const { images, combos } = resultRes;

      let ptotosNew = [];
      for (let photo in images) {
        var itemPhoho = {};
        itemPhoho.url = SERVER_APP + "/Upload/image/" + images[photo].Value;
        itemPhoho.caption = images[photo].Title;
        ptotosNew.push(itemPhoho);
      }

      ptotosNew.filter(
        (item) =>
          item.Role === "other" ||
          item.Role === "thumb" ||
          item.Role === "opt_thumb"
      );

      this.setState({
        arrProductCurrent: resultRes.product,
        arrProduct: resultRes.product,
        arrRelProds: resultRes.product.RelProds,
        photos: ptotosNew,
        arrOptions: resultRes.options,
        arrCombos: resultRes.combos,
        statusLoading: false,
        aff: {
          aff: resultRes.aff,
          aff_link: resultRes.aff_link,
          aff_value: resultRes.aff_value,
        },
        OriginalCurrent: combos && combos.length > 0 ? combos[0].Product : null,
      });
      setViewed(resultRes.product);
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.getDetialProduct();
  }
  openSheet = () => {
    const { arrProduct, isOpenStock } = this.state;
    const getStock = getStockIDStorage();
    if (!getStock) {
      this.setState({
        isOpenStock: !isOpenStock,
      });
    } else {
      this.setState({
        sheetOpened: true,
        arrProductCopy: arrProduct,
      });
    }
  };
  closeSheet = () => {
    const { arrProductCopy } = this.state;
    this.setState({
      sheetOpened: false,
      arrProduct: arrProductCopy,
      quantity: 1,
    });
  };

  handleOption = (item) => {
    const { arrOptions } = this.state;
    arrOptions.map((opt) => {
      if (opt.ID === item.ID) {
        this.setState({
          arrProduct: opt,
          activeID: item.ID,
          quantity: 1,
        });
      }
    });
  };
  handleChangeQty = (event) => {
    this.setState({
      quantity: event.target.value,
    });
  };
  IncrementItem = () => {
    this.setState((prevState) => ({
      quantity: prevState.quantity + 1,
    }));
  };
  DecreaseItem = () => {
    this.setState((prevState) => {
      if (prevState.quantity > 1) {
        return {
          quantity: prevState.quantity - 1,
        };
      } else {
        return null;
      }
    });
  };

  onPageBeforeOut = () => {
    const self = this;
    // Close opened sheets on page out
    self.$f7.sheet.close();
  };
  onPageBeforeRemove = () => {
    const self = this;
    // Destroy sheet modal when page removed
    if (self.sheet) self.sheet.destroy();
  };

  setStateLoading = (isloading) => {
    this.setState({
      isLoading: isloading,
    });
  };
  closeProbablySheet = () => {
    this.setState({
      isProbably: false,
    });
  };
  openProbablySheet = () => {
    this.setState({
      isProbably: true,
    });
  };
  orderSubmit = () => {
    //code here
    const infoUser = getUser();
    const getStock = getStockIDStorage();

    if (!infoUser) {
      this.$f7router.navigate("/login/");
      return false;
    } else {
      const { arrProduct, quantity } = this.state;
      const self = this;
      self.$f7.preloader.show();
      this.setStateLoading(true);
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
            ProdID: arrProduct.ID,
            Qty: quantity,
            // PriceOrder:
            //   arrProduct.PriceSale < 0
            //     ? arrProduct.PriceProduct
            //     : arrProduct.PriceSale,
          },
        ],
        forceStockID: getStock,
      };

      ShopDataService.getUpdateOrder(data)
        .then((response) => {
          const { errors } = response.data.data;

          if (response.data.success) {
            self.$f7.preloader.hide();
            self.setStateLoading(false);
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
            }
            this.$f7router.navigate("/pay/");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  nameStock = (name) => {
    this.setState({
      stockName: name,
    });
  };

  handleProbably = (item) => {
    //code here
    const infoUser = getUser();
    if (!infoUser) {
      this.$f7router.navigate("/login/");
    } else {
      const self = this;
      self.$f7.preloader.show();
      this.setStateLoading(true);
      const data = {
        order: {
          ID: 0,
          SenderID: infoUser.ID,
          VCode: "",
          Tinh: 5,
          Huyen: 37,
          MethodPayID: 1,
        },
        adds: [
          {
            ProdID: item.ID,
            Qty: 1,
            PriceOrder: item.PriceSale < 0 ? item.PriceProduct : item.PriceSale,
          },
        ],
      };

      ShopDataService.getUpdateOrder(data)
        .then((response) => {
          if (response.data.success) {
            self.$f7.preloader.hide();
            self.setStateLoading(false);
            toast.success("Added item to cart successfully !", {
              position: toast.POSITION.TOP_LEFT,
              autoClose: 3000,
            });
            this.$f7router.navigate("/pay/");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  probablyHTML = () => {
    const { arrRelProds } = this.state;

    return (
      <li className="size" onClick={() => this.openProbablySheet()}>
        <div className="size-title">
          Product probably in set
          <span>( {arrRelProds && arrRelProds.length} sản phẩm )</span>
        </div>
        <div className="probably-list">
          {arrRelProds &&
            arrRelProds.map((item, index) => {
              if (index > 1) return;
              return (
                <div className="probably-list__item" key={index}>
                  <div className="title">{item.Title}</div>
                  <div className="option">
                    <div
                      className={
                        "option-price " + (item.PriceSale > 0 ? "sale" : "")
                      }
                    >
                      <span className="price">
                        {formatPriceVietnamese(item.PriceProduct)}
                        <b>₫</b>
                      </span>
                      <span className="price-sale">
                        {formatPriceVietnamese(item.PriceSale)}
                        <b>₫</b>
                      </span>
                    </div>
                    <div className="option-btn">Buy Now</div>
                  </div>
                </div>
              );
            })}
          {arrRelProds && arrRelProds.length > 2 ? (
            <div className="show-more">
              <span>See more</span>
            </div>
          ) : (
            ""
          )}
        </div>
      </li>
    );
  };

  classifiHTML = () => {
    const { arrOptions, activeID } = this.state;
    return (
      <div className="sheet-pay-body__size">
        <h4>Classify</h4>
        <ul>
          {arrOptions &&
            arrOptions.map((item, index) => {
              return (
                <li
                  key={index}
                  onClick={() => this.handleOption(item)}
                  className={activeID === item.ID ? "active" : ""}
                >
                  <span>{item.Opt1}</span>
                </li>
              );
            })}
        </ul>
      </div>
    );
  };

  htmlSize = (arrOptions) => {
    if (arrOptions.length > 0) {
      return (
        <li className="size" onClick={() => this.openSheet()}>
          <div className="size-title">
            Classify
            <span>( {arrOptions.length} Loại )</span>
          </div>
          <div
            className={
              "size-list " + (arrOptions.length > 2 ? "size-list--full" : "")
            }
          >
            <div className="size-list--box">
              {arrOptions &&
                arrOptions.map((item, index) => {
                  if (index > 1) return;
                  return (
                    <div key={index} className="size-list__item">
                      <span>{item.Opt1}</span>
                    </div>
                  );
                })}
              <div className="size-list__total">
                <span>+{arrOptions.length - 2}</span>
              </div>
            </div>
          </div>
        </li>
      );
    }
  };

  fixedContentDomain = (content) => {
    if (!content) return "";
    return content.replace(/src=\"\//g, 'src="' + SERVER_APP + "/");
  };

  loadRefresh(done) {
    setTimeout(() => {
      this.$f7.views.main.router.navigate(this.$f7.views.main.router.url, {
        reloadCurrent: true,
      });
      this.setState({
        showPreloader: true,
      });
      done();
    }, 600);
  }

  shorten(str) {
    if (!str) return str;
    let parts = str.split(" ");
    parts.shift();
    let last = parts.join(" ");
    return last;
  }

  render() {
    const {
      arrProductCurrent,
      arrProduct,
      arrOptions,
      arrRelProds,
      photos,
      sheetOpened,
      quantity,
      isLoading,
      isProbably,
      statusLoading,
      isOpenStock,
      arrCombos,
      aff,
      copied,
      OriginalCurrent,
    } = this.state;
    return (
      <Page
        onPageBeforeOut={this.onPageBeforeOut}
        onPageBeforeRemove={this.onPageBeforeRemove}
        name="shop-detail"
        ptr
        infiniteDistance={50}
        infinitePreloader={this.state.showPreloader}
        onPtrRefresh={this.loadRefresh.bind(this)}
      >
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link onClick={() => this.$f7router.back()}>
                <i className="las la-angle-left"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">
                {!statusLoading ? arrProductCurrent.Title : "Đang tải ..."}
              </span>
            </div>
            <div className="page-navbar__cart">
              <CartToolBar />
            </div>
          </div>
        </Navbar>
        <PhotoBrowser
          photos={photos}
          theme="dark"
          popupCloseLinkText="Close"
          navbarOfText="/"
          ref={(el) => {
            this.standaloneDark = el;
          }}
        />
        <div className="page-render no-bg p-0">
          <div className="page-shop no-bg">
            <div className="page-shop__detail">
              {statusLoading && <SkeletonThumbnail />}
              {!statusLoading && (
                <div className="page-shop__detail-img">
                  <img
                    onClick={() => this.standaloneDark.open(0)}
                    src={
                      SERVER_APP +
                      "/Upload/image/" +
                      arrProductCurrent.Thumbnail
                    }
                    alt={arrProductCurrent.title}
                    onError={(e) => {
                      e.target.src = NoProduct;
                    }}
                  />
                  <div className="count">1/{photos && photos.length}</div>
                </div>
              )}

              <div
                className={
                  "page-shop__detail-list " +
                  (arrProductCurrent.IsDisplayPrice !== 0 &&
                  checkSale(
                    arrProductCurrent.SaleBegin,
                    arrProductCurrent.SaleEnd,
                    arrProductCurrent.PriceSale
                  ) === true
                    ? "sale"
                    : "")
                }
              >
                <ul>
                  <li>
                    <div className="text">{arrProductCurrent.Title}</div>
                  </li>
                  <li>
                    <div className="title">Product code</div>
                    <div className="text">{arrProductCurrent.DynamicID}</div>
                  </li>
                  <li className="product">
                    <div className="title">
                      Price
                      {arrProductCurrent.IsDisplayPrice !== 0 &&
                      checkSale(
                        arrProductCurrent.SaleBegin,
                        arrProductCurrent.SaleEnd,
                        arrProductCurrent.PriceSale
                      ) === true
                        ? " gốc"
                        : ""}
                    </div>
                    <div className="text">
                      {arrProductCurrent.IsDisplayPrice === 1 && (
                        <React.Fragment>
                          {!statusLoading
                            ? formatPriceVietnamese(
                                arrProductCurrent.PriceProduct
                              )
                            : "..."}
                          <b>₫</b>
                        </React.Fragment>
                      )}
                      {arrProductCurrent.IsDisplayPrice !== 1 && (
                        <React.Fragment>Contact</React.Fragment>
                      )}
                    </div>
                  </li>
                  {arrProductCurrent.IsDisplayPrice !== 0 && (
                    <li className="product-sale">
                      <div className="title">
                        <span>Reduce</span>
                        {/* <div className="badges badges-danger">
                          {percentagesSale(
                            arrProductCurrent.PriceProduct,
                            arrProductCurrent.PriceSale
                          )}
                          %
                        </div> */}
                      </div>
                      <div className="text">
                        {formatPriceVietnamese(arrProduct.PriceSale)}
                        <b>SGD</b>
                      </div>
                    </li>
                  )}

                  {arrProductCurrent.SaleDecs && (
                    <li>
                      <div className="title">
                        <span>Donate</span>
                        {/* <div className="badges badges-danger">
                          {percentagesSale(
                            arrProductCurrent.PriceProduct,
                            arrProductCurrent.PriceSale
                          )}
                          %
                        </div> */}
                      </div>
                      <div className="text">
                        {arrProductCurrent.SaleDecs &&
                          this.shorten(arrProductCurrent.SaleDecs)}
                      </div>
                    </li>
                  )}

                  {arrCombos && arrCombos.length > 1 && (
                    <li className="content">
                      <div className="content-title">Combo</div>
                      <div className="content-post content-post-combo">
                        <div className="content-combo">
                          {arrCombos.map((item, index) => (
                            <Link key={index}>
                              {/* href={`/shop/detail/${item.Id}/`} */}
                              <div className="img">
                                <img
                                  src={
                                    SERVER_APP +
                                    "/Upload/image/" +
                                    item.Product.Thumbnail
                                  }
                                  alt={item.Product.Title}
                                />
                                <span className="badgess">{item.qty}</span>
                              </div>
                              <div className="t-title">
                                {item.Product.Title}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </li>
                  )}
                  {this.htmlSize(arrOptions)}
                  {arrRelProds && arrRelProds.length > 0
                    ? this.probablyHTML()
                    : ""}
                  {window.GlobalConfig?.APP?.AFF &&
                    aff &&
                    aff.aff_link &&
                    aff.aff_value && (
                      <li className="content">
                        <div className="content-title">Referral commission</div>
                        <div className="content-post">
                          <div className="content-bonus">
                            <span>
                              Original price :{" "}
                              <b>
                                {aff.aff_value.NG > 100
                                  ? `${formatPriceVietnamese(aff.aff_value.NG)}`
                                  : `${aff.aff_value.NG}%`}
                              </b>
                            </span>
                            <span>
                              Promotion :{" "}
                              <b>
                                {" "}
                                {aff.aff_value.KM > 100
                                  ? `${formatPriceVietnamese(aff.aff_value.KM)}`
                                  : `${aff.aff_value.KM}%`}
                              </b>
                            </span>
                          </div>
                          <CopyToClipboard
                            text={aff.aff_link}
                            onCopy={() => {
                              this.setState({ copied: true });
                              setTimeout(() => {
                                toast.success("Copy link successfully !", {
                                  position: toast.POSITION.TOP_LEFT,
                                  autoClose: 1000,
                                });
                                this.setState({ copied: false });
                              }, 1000);
                            }}
                          >
                            <button
                              className={`btn-share ${
                                copied && "btn-no-click"
                              }`}
                              disabled={copied}
                            >
                              <i className="las la-share-alt"></i>{" "}
                              {copied ? "Copying ..." : "Copy the path"}
                            </button>
                          </CopyToClipboard>
                        </div>
                      </li>
                    )}

                  {arrProduct.Desc ||
                  arrProduct.Detail ||
                  OriginalCurrent?.Desc ||
                  OriginalCurrent?.Detail ? (
                    <li className="content">
                      <div className="content-title">Product details</div>
                      {statusLoading ? (
                        <>
                          <div className="content-post">
                            <Skeleton count={5} />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="content-post">
                            {ReactHtmlParser(
                              arrProduct.Desc || OriginalCurrent?.Desc,
                              {
                                transform: (node) => {
                                  if (
                                    node.type === "tag" &&
                                    node.attribs.class === "external"
                                  ) {
                                    return (
                                      <Link
                                        class="external"
                                        onClick={() =>
                                          OPEN_LINK(node.attribs.href)
                                        }
                                      >
                                        {node.children[0].data}
                                      </Link>
                                    );
                                  }
                                },
                              }
                            )}
                            {ReactHtmlParser(
                              this.fixedContentDomain(
                                arrProduct.Detail || OriginalCurrent?.Detail
                              ),
                              {
                                transform: (node) => {
                                  if (
                                    node.type === "tag" &&
                                    node.attribs.class === "external"
                                  ) {
                                    return (
                                      <Link
                                        class="external"
                                        onClick={() =>
                                          OPEN_LINK(node.attribs.href)
                                        }
                                      >
                                        {node.children[0].data}
                                      </Link>
                                    );
                                  }
                                },
                              }
                            )}
                          </div>
                        </>
                      )}
                    </li>
                  ) : (
                    ""
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Sheet
          className="sheet-swipe-product"
          style={{ height: "auto", "--f7-sheet-bg-color": "#fff" }}
          opened={sheetOpened}
          onSheetClosed={() => this.closeSheet()}
          swipeToClose
          swipeToStep
          backdrop
        >
          <div className="sheet-modal-swipe-step">
            <div className="sheet-modal-swipe__close"></div>
            <div className="sheet-swipe-product__content">
              <div className="sheet-pay-head">
                <div className="image">
                  <img
                    src={SERVER_APP + "/Upload/image/" + arrProduct.Thumbnail}
                    alt={arrProduct.Title}
                  />
                </div>
                <div className="text">
                  <h3>{arrProduct.Title}</h3>
                  <div
                    className={
                      "price " +
                      (arrProduct.IsDisplayPrice === 1 &&
                      checkSale(
                        arrProduct.SaleBegin,
                        arrProduct.SaleEnd,
                        arrProduct.PriceSale
                      ) === true
                        ? "hasSale"
                        : "")
                    }
                  >
                    {arrProduct.IsDisplayPrice === 1 ? (
                      <React.Fragment>
                        <p className="price-p">
                          {formatPriceVietnamese(arrProduct.PriceProduct)}
                          <b>₫</b>
                        </p>
                        <p className="price-s">
                          {formatPriceVietnamese(arrProduct.PriceSale)}
                          <b>₫</b>
                        </p>
                      </React.Fragment>
                    ) : (
                      <p className="price-p">Contact</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="sheet-pay-body">
                {arrOptions.length > 0 ? this.classifiHTML() : ""}
                <div className="sheet-pay-body__qty">
                  <div>
                    <h4>Quantity</h4>
                  </div>
                  <div className="qty-form">
                    <button
                      className="reduction"
                      onClick={this.DecreaseItem}
                      disabled={checkSLDisabled(arrProductCurrent?.ID).Disabled}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={this.handleChangeQty}
                      readOnly={checkSLDisabled(arrProductCurrent?.ID).Disabled}
                    />
                    <button
                      className="increase"
                      onClick={this.IncrementItem}
                      disabled={checkSLDisabled(arrProductCurrent?.ID).Disabled}
                    >
                      +
                    </button>
                  </div>
                </div>
                {checkSLDisabled(arrProductCurrent?.ID).Text && (
                  <div className="text-danger font-size-xs px-12px">
                    {checkSLDisabled(arrProductCurrent?.ID).Text}
                  </div>
                )}
                <div className="sheet-pay-body__btn">
                  <button
                    className={
                      "page-btn-order btn-submit-order " +
                      (isLoading ? "loading" : "")
                    }
                    onClick={() => this.orderSubmit()}
                  >
                    <span>Buy Now</span>
                    <div className="loading-icon">
                      <div className="loading-icon__item item-1"></div>
                      <div className="loading-icon__item item-2"></div>
                      <div className="loading-icon__item item-3"></div>
                      <div className="loading-icon__item item-4"></div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Sheet>

        <Sheet
          className="sheet-swipe-product sheet-swipe-probably"
          style={{ height: "auto", "--f7-sheet-bg-color": "#fff" }}
          opened={isProbably}
          onSheetClosed={() => this.closeProbablySheet()}
          swipeToClose
          swipeToStep
          backdrop
        >
          <div className="sheet-modal-swipe-step">
            <div className="sheet-modal-swipe__close"></div>
            <div className="sheet-swipe-product__content">
              <div className="sheet-pay-head">
                <h3>Retail products</h3>
              </div>
              <div>
                <div className="probably-list">
                  {arrRelProds &&
                    arrRelProds.map((item, index) => (
                      <div
                        className="probably-list__item"
                        key={index}
                        onClick={() => this.handleProbably(item)}
                      >
                        <div className="title">{item.Title}</div>
                        <div className="option">
                          <div
                            className={
                              "option-price " +
                              (item.PriceSale > 0 ? "sale" : "")
                            }
                          >
                            <span className="price">
                              {formatPriceVietnamese(item.PriceProduct)}
                              <b>₫</b>
                            </span>
                            <span className="price-sale">
                              {formatPriceVietnamese(item.PriceSale)}
                              <b>₫</b>
                            </span>
                          </div>
                          <div className="option-btn">Buy Now</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </Sheet>

        <Toolbar tabbar position="bottom">
          <div className="page-toolbar">
            {arrProduct?.IsService === 1 &&
            arrCombos &&
            arrCombos.length === 1 ? (
              <div className="page-toolbar__order d-flex">
                <button
                  className={`page-btn-order btn-submit-order bg-success ${
                    statusLoading ? "loading" : ""
                  } ${
                    arrProductCurrent.IsDisplayPrice === 0 && "btn-no-click"
                  }`}
                  onClick={() =>
                    this.$f7.views.main.router.navigate(
                      getUser()
                        ? `/schedule/?SelectedTitle=${arrCombos[0].Product.Title}&SelectedId=${arrCombos[0].Product.ID}`
                        : `/login/`
                    )
                  }
                >
                  <span>Schedule now</span>
                </button>
                {!window?.GlobalConfig?.APP?.Services?.HideButtonOrder && (
                  <button
                    className={`page-btn-order btn-submit-order ${
                      statusLoading ? "loading" : ""
                    } ${
                      arrProductCurrent.IsDisplayPrice === 0 && "btn-no-click"
                    }`}
                    onClick={() => this.openSheet()}
                  >
                    <span>Order</span>
                    <div className="loading-icon">
                      <div className="loading-icon__item item-1"></div>
                      <div className="loading-icon__item item-2"></div>
                      <div className="loading-icon__item item-3"></div>
                      <div className="loading-icon__item item-4"></div>
                    </div>
                  </button>
                )}
              </div>
            ) : (
              <div className="page-toolbar__order">
                <button
                  className={`page-btn-order btn-submit-order ${
                    statusLoading ? "loading" : ""
                  } ${
                    arrProductCurrent.IsDisplayPrice === 0 && "btn-no-click"
                  }`}
                  onClick={() => this.openSheet()}
                >
                  <span>Order</span>
                  <div className="loading-icon">
                    <div className="loading-icon__item item-1"></div>
                    <div className="loading-icon__item item-2"></div>
                    <div className="loading-icon__item item-3"></div>
                    <div className="loading-icon__item item-4"></div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </Toolbar>

        <Suspense fallback={<div>Loading...</div>}>
          <SelectStock
            isOpenStock={isOpenStock}
            nameStock={(name) => this.nameStock(name)}
          />
        </Suspense>
      </Page>
    );
  }
}
