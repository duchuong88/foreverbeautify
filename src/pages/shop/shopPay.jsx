import React from "react";
import {
  formatPriceVietnamese,
  checkImageProduct,
} from "../../constants/format";
import { AiOutlineClose } from "react-icons/ai";
import { checkSLDisabled, iOS } from "../../constants/helpers";
import imgCoupon from "../../assets/images/coupon_bg.svg";
import { getStockIDStorage, getUser } from "../../constants/user";
import ShopDataService from "./../../service/shop.service";
import { Page, Link, Navbar, Popup } from "framework7-react";
import { checkDateDiff } from "../../constants/format";
import NotificationIcon from "../../components/NotificationIcon";
import SkeletonPay from "./components/Pay/SkeletonPay";
import NumberFormat from "react-number-format";
import { toast } from "react-toastify";
import clsx from "clsx";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      dfItem: [],
      items: [],
      order: [],
      voucherSearch: "",
      deletedsOrder: [],
      editsOrder: [],
      voucherList: [],
      WalletMe: 0,
      WalletPay: 0,
      WalletPaySuccess: 0,
      popupOpened: false,
      popupWalletOpened: false,
      VCode: "",
      VDiscount: "",
      isLoading: true,
      isBtn: false,
      loadingBtn: false,
      isUpdate: false, // Trạng thái update đơn hàng
      showPreloader: false,
      Preloaders: false,
      TotalOrder: 0,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.popupOpened !== this.state.popupOpened &&
      this.state.popupOpened
    ) {
      this.getVoucherOrder();
    }
  }

  setPopupOpen = () => {
    this.setState({
      popupOpened: true,
    });
  };

  setPopupClose = () => {
    this.setState({
      popupOpened: false,
      voucherSearch: "",
    });
  };

  handleApply = () => {
    const { WalletMe, WalletPay } = this.state;
    if (WalletPay > WalletMe || WalletPay === 0) {
      toast.error("Invalid payment amount !", {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 3000,
      });
    } else {
      this.setState({
        WalletPaySuccess: WalletPay,
        popupWalletOpened: false,
      });
    }
  };

  setErr = (title) => {
    toast.error(title, {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 3000,
    });
  };

  setPopupWalletOpen = () => {
    this.setState({
      popupWalletOpened: true,
    });
  };

  setPopupWalletClose = () => {
    this.setState({
      popupWalletOpened: false,
    });
  };

  delayedClick = _.debounce(() => {
    this.saveChangeCount();
  }, 800);

  TotalProduct = (data) => {
    let initialValue = 0;
    let TotalItems = data.reduce((total, currentValue) => {
      return total + currentValue.ToPay;
    }, initialValue);
    this.setState({
      TotalPay: TotalItems,
    });
  };

  IncrementItem = (ID) => {
    //Tăng
    const { items, editsOrder } = this.state;

    const indexUpdate = items.findIndex((obj) => obj.ID === ID);
    if (indexUpdate < 0) return;
    const hisQty = items[indexUpdate].Qty;
    const Price = items[indexUpdate].Price;
    const PriceOrder = items[indexUpdate].PriceOrder;
    const Qty = (items[indexUpdate].Qty = hisQty + 1);
    items[indexUpdate].ToPay =
      items[indexUpdate].Qty * (PriceOrder > 0 ? PriceOrder : Price);

    const indexEdits = editsOrder.findIndex((item) => item.ID === ID);

    let newItemEdits = [];
    if (indexEdits < 0) {
      const itemEdits = {
        ID: ID,
        Qty: Qty,
      };
      newItemEdits = [...editsOrder, itemEdits];
      this.setState({
        editsOrder: newItemEdits,
        items: items,
      });
    } else {
      editsOrder[indexEdits].Qty = Qty;
      newItemEdits = editsOrder;
      this.setState({
        editsOrder: newItemEdits,
        items: items,
      });
    }

    this.TotalProduct(items);
    this.saveChangeCount({
      ItemsEdit: newItemEdits,
    });
    //this.delayedClick();
  };

  DecreaseItem = (ID) => {
    //Giảm

    const $$this = this;
    const { items, editsOrder, deletedsOrder } = this.state;
    const indexUpdate = items.findIndex((obj) => obj.ID === ID);
    if (indexUpdate < 0) return;
    const hisQty = items[indexUpdate].Qty;
    const Price = items[indexUpdate].Price;
    const PriceOrder = items[indexUpdate].PriceOrder;

    if (hisQty === 1) {
      this.onDelete(ID);
    } else {
      const indexUpdate2 = editsOrder.findIndex((obj) => obj.ID === ID);
      const Qty = (items[indexUpdate].Qty = hisQty - 1);
      items[indexUpdate].ToPay =
        items[indexUpdate].Qty * (PriceOrder > 0 ? PriceOrder : Price);

      let newItemEdits = [];
      if (indexUpdate2 < 0) {
        const itemEdits = {
          ID: ID,
          Qty: Qty,
        };
        newItemEdits = [...editsOrder, itemEdits];
        this.setState({
          editsOrder: newItemEdits,
          items: items,
        });
      } else {
        editsOrder[indexUpdate2].Qty = Qty;
        newItemEdits = editsOrder;
        this.setState({
          editsOrder: newItemEdits,
          items: items,
        });
      }
      this.TotalProduct(items);
      this.saveChangeCount({
        ItemsEdit: newItemEdits,
      });
      //this.delayedClick();
    }
  };

  onDelete = (ID) => {
    const $$this = this;
    const { items, deletedsOrder } = this.state;
    const indexUpdate = items.findIndex((obj) => obj.ID === ID);
    const Qty = items[indexUpdate].Qty;
    if (indexUpdate < 0) return;
    $$this.$f7.dialog.confirm("Delete this product ?", () => {
      const itemsNew = items.filter((item) => item.ID !== ID);
      const itemDelete = {
        ID: ID,
        Qty: Qty,
      };
      let newItemDelete = [...deletedsOrder, itemDelete];

      this.setState({
        items: itemsNew,
        deletedsOrder: newItemDelete,
      });
      this.TotalProduct(itemsNew);
      this.delayedClick();
    });
  };

  componentDidMount() {
    this.getOrder();
  }

  handleVcode = (item) => {
    const { editsOrder, deletedsOrder } = this.state;
    const { Code: vcode } = item;
    if (!vcode) {
      this.setState({
        VCode: "",
        VDiscount: "",
      });
    }
    const infoUser = getUser();
    const data = {
      order: {
        ID: 0,
        SenderID: infoUser.ID,
        VCode: vcode,
      },
      addProps: "ProdTitle",
      deleteds: deletedsOrder,
      edits: editsOrder,
    };
    //if(!data.order.VCode) delete data.order.VCode;
    const self = this;
    self.$f7.preloader.show();
    ShopDataService.getUpdateOrder(data)
      .then((response) => {
        const data = response.data.data;
        if (response.data.success) {
          if (data.errors && data.errors.length > 0) {
            this.setState({
              voucherList: this.state.voucherList.filter(
                (o) => o.Code !== vcode
              ),
            });
            vcode &&
              !data?.order?.VCode &&
              toast.error("Invalid discount code.", {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 1500,
              });
            self.$f7.preloader.hide();
          } else {
            setTimeout(() => {
              this.TotalProduct(data.items);
              this.setState({
                dfItem: data.dfItem,
                items: data.items.reverse(),
                order: data.order,
                popupOpened: false,
                VDiscount: data.order?.Voucher?.Discount,
                VCode: data.order?.VCode,
                deleteds: [],
                edits: [],
                TotalOrder: data.order?.ToPay,
              });
              self.$f7.preloader.hide();
              vcode &&
                !data?.order?.VCode &&
                toast.error("Invalid discount code.", {
                  position: toast.POSITION.TOP_LEFT,
                  autoClose: 1500,
                });
            }, 300);
          }
        }
      })
      .catch((er) => console.log(er));
  };

  handleWalet = (value) => {
    const wallet = parseInt(value);
    if (!isNaN(parseFloat(wallet))) {
      this.setState({
        WalletPay: wallet,
      });
    } else {
      this.setState({
        WalletPay: "",
      });
    }
  };

  getOrder = () => {
    const infoUser = getUser();
    if (!infoUser) {
      this.$f7router.navigate("/login/");
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
        const data = response.data.data;
        if (response.data.success) {
          //Total
          this.TotalProduct(data.items);
          this.setState({
            dfItem: data.dfItem,
            items: data.items.reverse(),
            order: data.order,
            isLoading: false,
            VCode: data.order && data.order?.VoucherCode,
            VDiscount: data.order?.Voucher?.Discount,
            WalletMe: data.mm,
            voucherList: data.vouchers,
            TotalOrder: data.order?.ToPay,
          });
          if (data.errors && data.errors.length > 0) {
            toast.error(data.errors.join(", "), {
              position: toast.POSITION.TOP_LEFT,
              autoClose: 1500,
            });
          }
        }
      })
      .catch((er) => console.log(er));
  };

  getVoucherOrder = () => {
    const infoUser = getUser();
    if (!infoUser) {
      this.$f7router.navigate("/login/");
      return false;
    }

    const data = {
      order: {
        ID: 0,
        SenderID: infoUser.ID,
        VCode: null,
      },
      addProps: "ProdTitle",
      voucherForOrder: true,
    };
    ShopDataService.getUpdateOrder(data)
      .then((response) => {
        const data = response.data.data;
        if (response.data.success) {
          this.setState({
            voucherList: data.vouchers,
          });
          if (data.errors && data.errors.length > 0) {
            toast.error(data.errors.join(", "), {
              position: toast.POSITION.TOP_LEFT,
              autoClose: 1500,
            });
          }
        }
      })
      .catch((er) => console.log(er));
  };

  handlePay = () => {
    const getStock = getStockIDStorage();
    const { editsOrder, deletedsOrder, WalletPaySuccess } = this.state;
    const infoUser = getUser();
    const data = {
      order: {
        ID: 0,
        SenderID: infoUser.ID,
      },
      addProps: "ProdTitle",
      deleteds: deletedsOrder,
      edits: editsOrder,
      payed: {
        membermoney: WalletPaySuccess,
      },
      forceStockID: getStock,
      cmd: "THANH_TOAN",
    };
    this.setState({
      isBtn: true,
    });
    const self = this;
    self.$f7.preloader.show();
    ShopDataService.getUpdateOrder(data)
      .then((response) => {
        const data = response?.data?.data;
        if (response.data.success) {
          if (data.errors && data.errors.length > 0) {
            toast.error(data.errors.join(", "), {
              position: toast.POSITION.TOP_LEFT,
              autoClose: 1500,
            });
            this.setState({
              dfItem: data.dfItem,
              items: data.items.reverse(),
              order: data.order,
              deletedsOrder: [],
              editsOrder: [],
              isUpdate: false,
              voucherList: data.vouchers,
              TotalOrder: data.order?.ToPay,
              VCode: "",
            });
          } else {
            this.$f7router.navigate("/pay-info/");
          }
          self.$f7.preloader.hide();
          this.setState({
            isBtn: false,
          });
        }
      })
      .catch((er) => console.log(er));
  };

  saveChangeCount = (
    obj = {
      ItemsEdit: null,
    },
    callback
  ) => {
    const { ItemsEdit } = obj;
    const { deletedsOrder, editsOrder, items, VCode } = this.state;
    const infoUser = getUser();

    this.setState({
      isUpdate: true,
    });
    const data = {
      order: {
        ID: 0,
        SenderID: infoUser.ID,
      },
      deleteds: deletedsOrder,
      edits: ItemsEdit || editsOrder,
      addProps: "ProdTitle",
    };

    ShopDataService.getUpdateOrder(data)
      .then((response) => {
        const data = response.data.data;
        if (response.data.success) {
          this.TotalProduct(data.items);
          this.setState({
            dfItem: data.dfItem,
            items: data.items.reverse(),
            order: data.order,
            deletedsOrder: [],
            editsOrder: [],
            isUpdate: false,
            voucherList: data.vouchers,
            TotalOrder: data.order?.ToPay,
            VCode: data?.order?.VoucherCode || "",
          });
          if (data.errors && data.errors.length > 0) {
            toast.error(data.errors.join(", "), {
              position: toast.POSITION.TOP_LEFT,
              autoClose: 1500,
            });
            this.setState({
              VCode: "",
            });
          } else {
            if (VCode && !data?.order?.VoucherCode) {
              toast.warning("Discount code removed.", {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 1500,
              });
            }
          }
          callback && callback();
        }
      })
      .catch((er) => {
        console.log(er);
        this.setState({
          isUpdate: false,
        });
      });
  };

  onSearchVoucher = (e) => {
    const { order, voucherSearch } = this.state;
    e.preventDefault();
    this.setState({
      loadingBtn: true,
    });
    const dataSubmit = {
      orderId: order.ID,
      vcode: voucherSearch,
    };
    ShopDataService.searchVoucher(dataSubmit)
      .then(({ data }) => {
        if (data.error) {
          toast.error(data.error, {
            position: toast.POSITION.TOP_LEFT,
            autoClose: 2000,
          });
          this.setState({
            loadingBtn: false,
          });
          return false;
        }
        this.handleVcode({ Code: voucherSearch });
        this.setState({
          loadingBtn: false,
        });
      })
      .catch((error) => console.log(error));
  };

  loadRefresh(done) {
    this.setState({
      Preloaders: true,
    });
    setTimeout(() => {
      this.$f7.views.main.router.navigate(this.$f7.views.main.router.url, {
        reloadCurrent: true,
      });
      this.setState({
        showPreloader: true,
        Preloaders: false,
      });
      done();
    }, 600);
  }

  render() {
    const {
      items,
      TotalPay,
      popupOpened,
      VCode,
      WalletMe,
      WalletPay,
      loadingBtn,
      popupWalletOpened,
      voucherList,
      isLoading,
      isBtn,
      VDiscount,
      Preloaders,
      TotalOrder,
    } = this.state;

    return (
      <Page
        noToolbar
        onPageBeforeOut={() => {
          this.setPopupClose();
          this.setPopupWalletClose();
        }}
        name="shop-pay"
        ptr
        infiniteDistance={50}
        infinitePreloader={this.state.showPreloader}
        onPtrRefresh={this.loadRefresh.bind(this)}
      >
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link
                onClick={() =>
                  this.$f7router.back({
                    force: true,
                    ignoreCache: true,
                  })
                }
              >
                <i className="las la-angle-left"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">Cart</span>
            </div>
            {/* {deletedsOrder.length > 0 || editsOrder.length > 0 ? (
              <div
                className="page-navbar__save"
                onClick={() => this.saveChangeCount()}
              >
                <Link noLinkClass>
                  <i className="lar la-check-circle"></i>
                </Link>
              </div>
            ) : (
              
            )} */}
            <div className="page-navbar__noti">
              <NotificationIcon />
            </div>
          </div>
        </Navbar>
        <div
          className={`${
            iOS() && Preloaders && "loader-show"
          } page-render page-render-pay no-bg p-0`}
        >
          <div className="page-pay no-bg">
            {isLoading && <SkeletonPay className="page-pay-1" />}
            {!isLoading && (
              <div className="page-pay__list page-pay-1">
                {items.length > 0
                  ? items &&
                    items.map((item, index) => (
                      <div
                        className={clsx(
                          "page-pay__list-item",
                          window?.GlobalConfig?.APP?.UIBase &&
                            items.length - 1 !== index &&
                            "pb-15px mb-15px border-bottom"
                        )}
                        key={index}
                      >
                        <div
                          className={clsx(
                            "image",
                            window?.GlobalConfig?.APP?.UIBase && "d-none"
                          )}
                        >
                          <img
                            src={checkImageProduct(item.ProdThumb)}
                            alt={item.ProdTitle}
                          />
                        </div>
                        <div
                          className={clsx(
                            "info",
                            window?.GlobalConfig?.APP?.UIBase && "pl-0 f--1"
                          )}
                        >
                          <h3>{item.ProdTitle}</h3>
                          <div
                            className={
                              "info-price " +
                              (item.PriceOrder !== item.Price ? "hasSale" : "")
                            }
                          >
                            <p className="price-p">
                              {formatPriceVietnamese(item.Price)}
                              <b>sgd</b>
                            </p>
                            <p className="price-s">
                              {formatPriceVietnamese(item.PriceOrder)}
                              <b>sgd</b>
                            </p>
                          </div>
                          <div className="qty-form">
                            <button
                              className="reduction"
                              onClick={() => this.DecreaseItem(item.ID)}
                              disabled={checkSLDisabled(item?.ProdID).Disabled}
                            >
                              -
                            </button>
                            <div className="qty-form__count">{item.Qty}</div>
                            <button
                              className="increase"
                              onClick={() => this.IncrementItem(item.ID)}
                              disabled={checkSLDisabled(item?.ProdID).Disabled}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div
                          className="delete"
                          onClick={() => this.onDelete(item.ID)}
                        >
                          <AiOutlineClose />
                        </div>
                      </div>
                    ))
                  : "No orders yet"}
              </div>
            )}
            <div className="page-pay__total">
              <ul>
                <li className="voucher">
                  <div className="title">
                    <svg
                      width={18}
                      height={18}
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 -2 23 22"
                    >
                      <g filter="url(#voucher-filter0_d)">
                        <mask id="voucher-mask0_d" fill="#fff">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1 2h18v2.32a1.5 1.5 0 000 2.75v.65a1.5 1.5 0 000 2.75v.65a1.5 1.5 0 000 2.75V16H1v-2.12a1.5 1.5 0 000-2.75v-.65a1.5 1.5 0 000-2.75v-.65a1.5 1.5 0 000-2.75V2z"
                          />
                        </mask>
                        <path
                          d="M19 2h1V1h-1v1zM1 2V1H0v1h1zm18 2.32l.4.92.6-.26v-.66h-1zm0 2.75h1v-.65l-.6-.26-.4.91zm0 .65l.4.92.6-.26v-.66h-1zm0 2.75h1v-.65l-.6-.26-.4.91zm0 .65l.4.92.6-.26v-.66h-1zm0 2.75h1v-.65l-.6-.26-.4.91zM19 16v1h1v-1h-1zM1 16H0v1h1v-1zm0-2.12l-.4-.92-.6.26v.66h1zm0-2.75H0v.65l.6.26.4-.91zm0-.65l-.4-.92-.6.26v.66h1zm0-2.75H0v.65l.6.26.4-.91zm0-.65l-.4-.92-.6.26v.66h1zm0-2.75H0v.65l.6.26.4-.91zM19 1H1v2h18V1zm1 3.32V2h-2v2.32h2zm-.9 1.38c0-.2.12-.38.3-.46l-.8-1.83a2.5 2.5 0 00-1.5 2.29h2zm.3.46a.5.5 0 01-.3-.46h-2c0 1.03.62 1.9 1.5 2.3l.8-1.84zm.6 1.56v-.65h-2v.65h2zm-.9 1.38c0-.2.12-.38.3-.46l-.8-1.83a2.5 2.5 0 00-1.5 2.29h2zm.3.46a.5.5 0 01-.3-.46h-2c0 1.03.62 1.9 1.5 2.3l.8-1.84zm.6 1.56v-.65h-2v.65h2zm-.9 1.38c0-.2.12-.38.3-.46l-.8-1.83a2.5 2.5 0 00-1.5 2.29h2zm.3.46a.5.5 0 01-.3-.46h-2c0 1.03.62 1.9 1.5 2.3l.8-1.84zM20 16v-2.13h-2V16h2zM1 17h18v-2H1v2zm-1-3.12V16h2v-2.12H0zm1.4.91a2.5 2.5 0 001.5-2.29h-2a.5.5 0 01-.3.46l.8 1.83zm1.5-2.29a2.5 2.5 0 00-1.5-2.3l-.8 1.84c.18.08.3.26.3.46h2zM0 10.48v.65h2v-.65H0zM.9 9.1a.5.5 0 01-.3.46l.8 1.83A2.5 2.5 0 002.9 9.1h-2zm-.3-.46c.18.08.3.26.3.46h2a2.5 2.5 0 00-1.5-2.3L.6 8.65zM0 7.08v.65h2v-.65H0zM.9 5.7a.5.5 0 01-.3.46l.8 1.83A2.5 2.5 0 002.9 5.7h-2zm-.3-.46c.18.08.3.26.3.46h2a2.5 2.5 0 00-1.5-2.3L.6 5.25zM0 2v2.33h2V2H0z"
                          mask="url(#voucher-mask0_d)"
                        />
                      </g>
                      <path
                        clipRule="evenodd"
                        d="M6.49 14.18h.86v-1.6h-.86v1.6zM6.49 11.18h.86v-1.6h-.86v1.6zM6.49 8.18h.86v-1.6h-.86v1.6zM6.49 5.18h.86v-1.6h-.86v1.6z"
                      />
                      <defs>
                        <filter
                          id="voucher-filter0_d"
                          x={0}
                          y={1}
                          width={20}
                          height={16}
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity={0}
                            result="BackgroundImageFix"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          />
                          <feOffset />
                          <feGaussianBlur stdDeviation=".5" />
                          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0" />
                          <feBlend
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow"
                          />
                          <feBlend
                            in="SourceGraphic"
                            in2="effect1_dropShadow"
                            result="shape"
                          />
                        </filter>
                      </defs>
                    </svg>
                    <span>Voucher</span>
                  </div>
                  <div className="box">
                    <div className="box-text">
                      {!VCode || VCode === "" ? (
                        <div
                          onClick={
                            items.length > 0
                              ? () => this.setPopupOpen()
                              : () =>
                                  this.setErr(
                                    "Cart is empty. Please place an order."
                                  )
                          }
                        >
                          <span>Select or enter a code</span>
                          <svg
                            enableBackground="new 0 0 11 11"
                            viewBox="0 0 11 11"
                            className="stardust-icon stardust-icon-arrow-right ekGwAM"
                          >
                            <path
                              stroke="none"
                              d="m2.5 11c .1 0 .2 0 .3-.1l6-5c .1-.1.2-.3.2-.4s-.1-.3-.2-.4l-6-5c-.2-.2-.5-.1-.7.1s-.1.5.1.7l5.5 4.6-5.5 4.6c-.2.2-.2.5-.1.7.1.1.3.2.4.2z"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="box-vocher-checked">
                          <span
                            className="vcode"
                            onClick={
                              items.length > 0
                                ? () => this.setPopupOpen()
                                : () =>
                                    this.setErr(
                                      "Cart is empty. Please place an order."
                                    )
                            }
                          >
                            (
                            {VDiscount && Number(VDiscount) < 100
                              ? `- ${VDiscount}%`
                              : `- ${formatPriceVietnamese(VDiscount)}SGD`}
                            ) {VCode}
                          </span>
                          <i
                            className="las la-times"
                            onClick={() => this.handleVcode({ Code: "" })}
                          ></i>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
                <li className="total">
                  <div className="title">
                    Total money :
                    <span>
                      {formatPriceVietnamese(TotalOrder)}
                      <b>sgd</b>
                    </span>
                  </div>
                  <div className="btns">
                    <button
                      className={`btn-small ${
                        items.length > 0 ? "" : "disabled-btn"
                      } ${isBtn && "loading"}`}
                      onClick={this.handlePay}
                      type="button"
                    >
                      <span>Pay</span>
                      <div className="loader">
                        <div className="loader-item"></div>
                        <div className="loader-item"></div>
                        <div className="loader-item"></div>
                      </div>
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Popup
          className="voucher-popup-swipe"
          opened={popupOpened}
          onPopupClosed={() => this.setPopupClose()}
          // swipeToClose
        >
          <div className="voucher-popup-swipe__close"></div>
          <div className="head">
            <div className="head-title">Promotional code</div>
            <div className="head-close" onClick={() => this.setPopupClose()}>
              <i className="las la-times"></i>
            </div>
          </div>
          <div className="body">
            <form className="form-voucher" onSubmit={this.onSearchVoucher}>
              <input
                type="text"
                placeholder="Insert code"
                onChange={(evt) =>
                  this.setState({
                    voucherSearch: evt.target.value.toUpperCase(),
                  })
                }
              />
              <button
                className={`btn-submit-order ${loadingBtn && "loading"}`}
                type="submit"
              >
                <span>Insert code</span>
                <div className="loading-icon">
                  <div className="loading-icon__item item-1"></div>
                  <div className="loading-icon__item item-2"></div>
                </div>
              </button>
            </form>
            {voucherList.length === 0 ? (
              <ul>
                <li>You don't have a promotional code.</li>
              </ul>
            ) : (
              ""
            )}
            <ul>
              {voucherList &&
                voucherList
                  .slice()
                  .reverse()
                  .map((item, index) => (
                    <li
                      key={index}
                      style={{
                        backgroundImage: `url(${imgCoupon})`,
                      }}
                    >
                      <div className="coupon">
                        <div className="coupon-title">
                          Code <span>{item.Code}</span>
                        </div>
                        <div className="coupon-value">
                          {item?.ValueType === 2 ? (
                            <>
                              Same price{" "}
                              <span>
                                {formatPriceVietnamese(item.Discount)} SGD
                              </span>
                            </>
                          ) : (
                            <>
                              Preferential
                              <span>
                                {item.Discount > 100
                                  ? `${formatPriceVietnamese(
                                      item.Discount
                                    )} sgd`
                                  : `${item.Discount} %`}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="coupon-end">
                          Expiry :{" "}
                          {item.EndDate === null
                            ? "Unlimited"
                            : `Still ${
                                checkDateDiff(item.EndDate) === 0
                                  ? "1"
                                  : checkDateDiff(item.EndDate)
                              } day`}
                        </div>
                      </div>
                      <div
                        onClick={() => this.handleVcode(item)}
                        className="apply-coupon"
                      >
                        Select code
                      </div>
                    </li>
                  ))}
            </ul>
          </div>
        </Popup>

        <Popup
          className="voucher-popup-swipe wallet-popup-swipe"
          opened={popupWalletOpened}
          onPopupClosed={() => this.setPopupWalletClose()}
          swipeToClose
        >
          <div className="voucher-popup-swipe__close"></div>
          <div className="head">
            <div className="head-title">Wallet payment</div>
            <div
              className="head-close"
              onClick={() => this.setPopupWalletClose()}
            >
              <i className="las la-times"></i>
            </div>
          </div>
          <div className="body">
            <div className="body-wallet">
              Your wallet balance :{" "}
              <span>
                {formatPriceVietnamese(WalletMe)}
                <b>sgd</b>
              </span>
            </div>
            {WalletMe <= 0 && (
              <div className="body-wallet--error">
                The money in your wallet is zero. Please add money to your wallet to use
                payment wallet.
              </div>
            )}
            <div className="body-wallet--form">
              <NumberFormat
                value={WalletPay && WalletPay > 0 ? WalletPay : ""}
                thousandSeparator={true}
                placeholder="Enter the amount ..."
                onValueChange={(val) => {
                  this.handleWalet(val.floatValue ? val.floatValue : val.value);
                }}
              />
              <button
                className={`${WalletMe > 0 ? "" : "btn-no-click"}`}
                onClick={() => this.handleApply()}
                type="button"
              >
                Apply
              </button>
            </div>
          </div>
        </Popup>
      </Page>
    );
  }
}
