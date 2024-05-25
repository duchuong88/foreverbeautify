import React, { useEffect } from "react";
import {
  Page,
  Link,
  Toolbar,
  Navbar,
  Sheet,
  Button,
  PageContent,
} from "framework7-react";
import ToolBarBottom from "../../components/ToolBarBottom";
import UserService from "../../service/user.service";
import NotificationIcon from "../../components/NotificationIcon";
import { getUser, getPassword } from "../../constants/user";
import PageNoData from "../../components/PageNoData";
import {
  formatPriceVietnamese,
  checkImageProduct,
} from "../../constants/format";
import Skeleton from "react-loading-skeleton";
import ReactHtmlParser from "react-html-parser";
import moment from "moment";
import "moment/locale/vi";
import clsx from "clsx";
moment.locale("vi");
import Select from "react-select";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

const RenderQR = ({ ValueBank, Total, ID, MaND }) => {
  if (ValueBank.ma_nh === "ZaloPay") {
    return (
      <div className="mt-15px d-flex justify-content-center align-items-center fd--c">
        <QRCodeSVG
          value={`https://social.zalopay.vn/mt-gateway/v1/private-qr?amount=${Total}&note=${MaND}${ID}&receiver_id=${ValueBank.stk}`}
          size={220}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"L"}
          includeMargin={false}
        />
        <div className="fw-600 mt-15px">{ValueBank.ten}</div>
        <div>{ValueBank.stk}</div>
        <div>{formatPriceVietnamese(Total)}</div>
      </div>
    );
  }
  if (ValueBank.ma_nh === "MoMoPay") {
    return (
      <div className="mt-15px d-flex justify-content-center align-items-center fd--c">
        <QRCodeSVG
          value={`2|99|${ValueBank.stk}|||0|0|${Total}|${MaND}${ID}|transfer_myqr`}
          size={220}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"L"}
          includeMargin={false}
        />
        <div className="fw-600 mt-15px">{ValueBank.ten}</div>
        <div>{ValueBank.stk}</div>
        <div>{formatPriceVietnamese(Total)}</div>
      </div>
    );
  }
  return (
    <div className="mt-12px">
      <div className="position-relative m-auto" style={{ maxWidth: "320px" }}>
        <div className="bg-white position-absolute h-40px w-100 bg-white top-0 left-0"></div>
        <img
          src={`https://img.vietqr.io/image/${ValueBank.ma_nh}-${ValueBank.stk}-compact2.jpg?amount=${Total}&addInfo=${MaND}${ID}&accountName=${ValueBank.ten}`}
          alt="Payment QR Code"
        />
      </div>
    </div>
  );
};

const SheetOrder = ({ item, textPay, loadingText, Banks, MaND }) => {
  const [ValueBank, setValueBank] = useState(null);

  useEffect(() => {
    if (Banks && Banks.length > 0) {
      setValueBank(Banks[0]);
    }
  }, [Banks]);

  let TotalDebt = Math.abs(
    item.thanhtoan.tong_gia_tri_dh -
      item.thanhtoan.thanh_toan_tien -
      item.thanhtoan.thanh_toan_vi -
      item.thanhtoan.thanh_toan_ao
  );

  return (
    <Sheet
      className={`demo-sheet-${item.ID} sheet-detail`}
      style={{
        height: "auto !important",
        "--f7-sheet-bg-color": "#fff",
      }}
      backdrop
    >
      <Button sheetClose={`.demo-sheet-${item.ID}`} className="show-more">
        <i className="las la-times"></i>
      </Button>
      <PageContent>
        <div className="page-shop__service-detail">
          <div className="title">
            <h4>Payment orders #{item.ID}</h4>
          </div>
          <div className="content">
            {loadingText && <Skeleton count={6} />}
            {!loadingText &&
              textPay &&
              ReactHtmlParser(
                textPay
                  .replaceAll("ID_ĐH", `#${item.ID}`)
                  .replaceAll(
                    "MONEY",
                    `${formatPriceVietnamese(Math.abs(TotalDebt))} ₫`
                  )
                  .replaceAll("ID_DH", `${item.ID}`)
              )}
            <div>
              <div className="mt-10px">
                <Select
                  options={Banks}
                  className="select-control"
                  classNamePrefix="select"
                  placeholder="Choose a bank"
                  noOptionsMessage={() => "No data"}
                  value={ValueBank}
                  onChange={(val) => setValueBank(val)}
                  isClearable={true}
                  // menuPosition="fixed"
                  // styles={{
                  //   menuPortal: (base) => ({
                  //     ...base,
                  //     zIndex: 9999,
                  //   }),
                  // }}
                  // menuPortalTarget={document.body}
                  menuPlacement="top"
                />
              </div>
              {ValueBank && (
                <RenderQR
                  ValueBank={ValueBank}
                  Total={TotalDebt}
                  ID={item.ID}
                  MaND={MaND}
                />
              )}
            </div>
          </div>
        </div>
      </PageContent>
    </Sheet>
  );
};

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      arrOder: [],
      loading: false,
      loadingText: false,
      textPay: "",
      Banks: null,
      MaND: "",
    };
  }

  getName = (item) => {
    let names = item.ngan_hang.split("-");
    return names[names.length - 1];
  };

  componentDidMount() {
    this.getOrderAll();

    this.setState({
      loadingText: true,
    });

    UserService.getConfig("App.thanhtoan,MA_QRCODE_NGAN_HANG")
      .then(({ data }) => {
        let newBanks = [];
        let newMaND = "";
        if (data.data && data.data.length > 1) {
          let JsonBanks = JSON.parse(data.data[1].Value);
          if (
            JsonBanks &&
            JsonBanks.ngan_hang &&
            Array.isArray(JsonBanks.ngan_hang)
          ) {
            newBanks = JsonBanks.ngan_hang.map((x) => ({
              ...x,
              value: x.stk,
              label: this.getName(x),
            }));
            newMaND = JsonBanks.ma_nhan_dien;
          }
        }

        this.setState({
          textPay: data.data && data.data[0]?.ValueLines,
          loadingText: false,
          Banks: newBanks,
          MaND: newMaND,
        });
      })
      .catch((error) => console.log(error));
  }

  getOrderAll = () => {
    this.setState(() => ({ loading: true }));
    UserService.getOrderAll2()
      .then((response) => {
        const data = response.data;
        const TongNo =
          data && data.length > 0
            ? data
                .filter((x) => x.Status !== "cancel")
                .reduce(
                  (n, { thanhtoan }) =>
                    n +
                    Math.abs(
                      (thanhtoan?.tong_gia_tri_dh) -
                        (thanhtoan?.thanh_toan_tien) -
                        (thanhtoan?.thanh_toan_vi) -
                        (thanhtoan?.thanh_toan_ao)
                    ),
                  0
                )
            : 0;
        this.setState({
          arrOder: data,
          loading: false,
          TongNo: TongNo,
        });
      })
      .catch((er) => console.log(er));
  };

  formatDateFull = (data) => {
    const dateSplit = data.split("T");
    return dateSplit[1] + " " + dateSplit[0];
  };

  checkStatus = (item) => {
    if (item.Status === "finish") {
      return "success";
    }
    if (item.Status === "cancel" && item.IsReturn !== 0) {
      return "primary";
    }
    if (item.Status === "cancel") {
      return "danger";
    }
    return "warning";
  };

  async loadRefresh(done) {
    await this.getOrderAll();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    done();
  }

  render() {
    const { arrOder, loading, loadingText, textPay, TongNo, Banks, MaND } =
      this.state;
    return (
      <Page
        onPtrRefresh={this.loadRefresh.bind(this)}
        ptr
        infiniteDistance={50}
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
                Order
                {TongNo && Number(TongNo) > 0 ? (
                  <span className="pl-2px font-size-sm">
                    {" "}
                    - In debt {formatPriceVietnamese(TongNo)}
                  </span>
                ) : ""}
              </span>
            </div>
            <div className="page-navbar__noti">
              <NotificationIcon />
            </div>
          </div>
        </Navbar>
        <div className="page-render no-bg p-0">
          <div className="page-order">
            <div className="page-order__list">
              {loading &&
                Array(5)
                  .fill()
                  .map((item, index) => (
                    <Link key={index} href="" noLinkClass className="item">
                      <div className="item-header">
                        <i className="las la-dolly"></i>
                        <div className="text">
                          <div className="date">
                            <Skeleton width={60} />
                          </div>
                          <div className={`status`}>
                            <Skeleton width={60} />
                          </div>
                        </div>
                      </div>
                      <div className="item-body">
                        <div className="list-sub">
                          {Array(index + 2)
                            .fill()
                            .map((sub, idx) => (
                              <div className="list-sub-item" key={idx}>
                                <div className="img">
                                  <Skeleton width={60} height={60} />
                                </div>
                                <div className="text">
                                  <Skeleton count={2} />
                                  <div className="text-count">
                                    <Skeleton width={70} />
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div className="item-footer">
                        <div className="content-item">
                          <span>Total order :</span>
                          <span className="price text-red">
                            <Skeleton width={60} />
                          </span>
                        </div>
                        <div className="content-item">
                          <span>Paid :</span>
                          <span className="price">
                            <Skeleton width={60} />
                          </span>
                          <span className="px">,</span>
                          <span>Still in debt :</span>
                          <span className="price">
                            <Skeleton width={60} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
              {!loading && arrOder.length > 0 ? (
                arrOder &&
                arrOder.map((item, index) => (
                  <Link key={index} href="" noLinkClass className="item">
                    <div className="item-header">
                      <i className="las la-dolly"></i>
                      <div className="text">
                        <div className="date">
                          {this.formatDateFull(item.OrderDate)}
                        </div>
                        <div className={`status ` + this.checkStatus(item)}>
                          {item.IsReturn !== 0 && item.Status === "cancel"
                            ? "Trả lại"
                            : item.StatusText}
                        </div>
                      </div>
                    </div>
                    <div className="item-body">
                      <div className="list-sub">
                        {item.Items &&
                          item.Items.map((sub, idx) => (
                            <div className="list-sub-item" key={idx}>
                              <div
                                className={clsx(
                                  "img",
                                  window?.GlobalConfig?.APP?.UIBase && "d-none"
                                )}
                              >
                                <img src={checkImageProduct(sub.ProdThumb)} />
                              </div>
                              <div
                                className={clsx(
                                  "text",
                                  window?.GlobalConfig?.APP?.UIBase &&
                                    "w-100 pl-0"
                                )}
                              >
                                <div className="text-name">{sub.ProdTitle}</div>
                                <div className="text-count">
                                  Quantity <b>x{sub.Qty}</b>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="item-footer">
                      <div className="content-item">
                        <span>Total order :</span>
                        <span className="price text-red">
                          {formatPriceVietnamese(item.ToPay)}
                          <b>sgd</b>
                        </span>
                      </div>
                      {item.Status !== "cancel" && (
                        <div className="content-item">
                          {/* <span>Đã thanh toán :</span>
                          <span className="price">
                            {formatPriceVietnamese(item.Payed)}
                            <b>sgd</b>
                          </span> */}
                          {item.Status === "finish" && (
                            <React.Fragment>
                              {item.thanhtoan.thanh_toan_tien > 0 && (
                                <React.Fragment>
                                  <span className="px">,</span>
                                  <span>Actual payment :</span>
                                  <span className="price">
                                    {formatPriceVietnamese(
                                      Math.abs(item.thanhtoan.thanh_toan_tien)
                                    )}
                                    <b>sgd</b>
                                  </span>
                                </React.Fragment>
                              )}
                              {item.thanhtoan.thanh_toan_vi > 0 && (
                                <React.Fragment>
                                  <span className="px">,</span>
                                  <span>Wallet payment :</span>
                                  <span className="price">
                                    {formatPriceVietnamese(
                                      Math.abs(item.thanhtoan.thanh_toan_vi)
                                    )}
                                    <b>sgd</b>
                                  </span>
                                </React.Fragment>
                              )}
                              {item.thanhtoan.hoan_vi_tra_hang > 0 && (
                                <React.Fragment>
                                  <span className="px">,</span>
                                  <span>Refund upon return :</span>
                                  <span className="price">
                                    {formatPriceVietnamese(
                                      Math.abs(item.thanhtoan.hoan_vi_tra_hang)
                                    )}
                                    <b>sgd</b>
                                  </span>
                                </React.Fragment>
                              )}
                              {item.thanhtoan.hoan_vi_ket_thuc_the > 0 && (
                                <React.Fragment>
                                  <span className="px">,</span>
                                  <span>Refund the wallet at the end of the card :</span>
                                  <span className="price">
                                    {formatPriceVietnamese(
                                      Math.abs(
                                        item.thanhtoan.hoan_vi_ket_thuc_the
                                      )
                                    )}
                                    <b>sgd</b>
                                  </span>
                                </React.Fragment>
                              )}
                              {item.thanhtoan.ket_thuc_the_hoan_tien > 0 && (
                                <React.Fragment>
                                  <span className="px">,</span>
                                  <span>End of cashback card :</span>
                                  <span className="price">
                                    {formatPriceVietnamese(
                                      Math.abs(
                                        item.thanhtoan.ket_thuc_the_hoan_tien
                                      )
                                    )}
                                    <b>sgd</b>
                                  </span>
                                </React.Fragment>
                              )}
                              {item.thanhtoan.ket_thuc_the_hoan_vi > 0 && (
                                <React.Fragment>
                                  <span className="px">,</span>
                                  <span>End of wallet refund card :</span>
                                  <span className="price">
                                    {formatPriceVietnamese(
                                      Math.abs(
                                        item.thanhtoan.ket_thuc_the_hoan_vi
                                      )
                                    )}
                                    <b>sgd</b>
                                  </span>
                                </React.Fragment>
                              )}
                              {/* {item.thanhtoan.thanh_toan_ao > 0 && (
                                <React.Fragment>
                                  <span className="px">,</span>
                                  <span>Thanh toán ảo :</span>
                                  <span className="price">
                                    {formatPriceVietnamese(
                                      Math.abs(item.thanhtoan.thanh_toan_ao)
                                    )}
                                    <b>sgd</b>
                                  </span>
                                </React.Fragment>
                              )} */}
                              {item.thanhtoan.tra_hang_hoan_tien > 0 && (
                                <React.Fragment>
                                  <span className="px">,</span>
                                  <span>Refund return :</span>
                                  <span className="price">
                                    {formatPriceVietnamese(
                                      Math.abs(
                                        item.thanhtoan.tra_hang_hoan_tien
                                      )
                                    )}
                                    <b>sgd</b>
                                  </span>
                                </React.Fragment>
                              )}
                              {item.thanhtoan.tra_hang_hoan_vi > 0 && (
                                <React.Fragment>
                                  <span className="px">,</span>
                                  <span>Return wallet :</span>
                                  <span className="price">
                                    {formatPriceVietnamese(
                                      Math.abs(item.thanhtoan.tra_hang_hoan_vi)
                                    )}
                                    <b>sgd</b>
                                  </span>
                                </React.Fragment>
                              )}
                              <span className="px">,</span>
                            </React.Fragment>
                          )}
                          <span>Still in debt :</span>
                          <span className="price">
                            {formatPriceVietnamese(
                              Math.abs(
                                item.thanhtoan.tong_gia_tri_dh -
                                  item.thanhtoan.thanh_toan_tien -
                                  item.thanhtoan.thanh_toan_vi -
                                  item.thanhtoan.thanh_toan_ao
                              )
                            )}
                            <b>sgd</b>
                          </span>
                          <div className="btn-div">
                            {Math.abs(
                              item.thanhtoan.tong_gia_tri_dh -
                                item.thanhtoan.thanh_toan_tien -
                                item.thanhtoan.thanh_toan_vi -
                                item.thanhtoan.thanh_toan_ao
                            ) > 0 && (
                              <Button
                                sheetOpen={`.demo-sheet-${item.ID}`}
                                className="show-more"
                              >
                                Pay
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                      <SheetOrder
                        item={item}
                        textPay={textPay}
                        loadingText={loadingText}
                        Banks={Banks}
                        MaND={MaND}
                      />
                    </div>
                  </Link>
                ))
              ) : (
                <PageNoData text="Your order is empty. Please place an order." />
              )}
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
