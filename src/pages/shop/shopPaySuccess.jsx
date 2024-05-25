import {
  Navbar,
  Toolbar,
  Page,
  Link,
  Button,
  Sheet,
  PageContent,
} from "framework7-react";
import React from "react";
import IconSucces from "../../assets/images/box.svg";
import NotificationIcon from "../../components/NotificationIcon";
import ToolBarBottom from "../../components/ToolBarBottom";
import userService from "../../service/user.service";
import Skeleton from "react-loading-skeleton";
import ReactHtmlParser from "react-html-parser";
import { formatPriceVietnamese } from "../../constants/format";
import Select from "react-select";
import { QRCodeSVG } from "qrcode.react";

const RenderQR = ({ ValueBank, Total, ID, MaND }) => {
  if (ValueBank.ma_nh === "ZaloPay") {
    return (
      <div className="mt-15px">
        <QRCodeSVG
          value={`https://social.zalopay.vn/mt-gateway/v1/private-qr?amount=${Total}&note=${MaND}${ID}&receiver_id=${ValueBank.stk}`}
          size={220}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"L"}
          includeMargin={false}
        />
        <div className="fw-600">{ValueBank.ten}</div>
        <div>{ValueBank.stk}</div>
        <div>{formatPriceVietnamese(Total)}</div>
      </div>
    );
  }
  if (ValueBank.ma_nh === "MoMoPay") {
    return (
      <div className="mt-15px">
        <QRCodeSVG
          value={`2|99|${ValueBank.stk}|||0|0|${Total}|${MaND}${ID}|transfer_myqr`}
          size={220}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"L"}
          includeMargin={false}
        />
        <div className="fw-600">{ValueBank.ten}</div>
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

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      loadingText: false,
      textPay: "",
      Banks: [],
      ValueBank: null,
      MaND: "",
    };
  }

  getName = (item) => {
    let names = item.ngan_hang.split("-");
    return names[names.length - 1];
  };

  componentDidMount() {
    this.setState({
      loadingText: true,
    });
    userService
      .getConfig("App.thanhtoan,MA_QRCODE_NGAN_HANG")
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
          textPay: data.data && data.data[0]?.Value,
          loadingText: false,
          Banks: newBanks,
          MaND: newMaND,
          ValueBank: newBanks && newBanks.length > 0 && newBanks[0],
        });
      })
      .catch((error) => console.log(error));
  }

  render() {
    const { loadingText, textPay, Banks, ValueBank, MaND } = this.state;

    return (
      <Page
        onPageBeforeOut={this.onPageBeforeOut}
        onPageBeforeRemove={this.onPageBeforeRemove}
        name="shop-pay-success"
      >
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link href="/news/">
                <i className="las la-home"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">Success</span>
            </div>
            <div className="page-navbar__noti">
              <NotificationIcon />
            </div>
          </div>
        </Navbar>
        <div className="page-pay-success bg-white min-h-100 p-20px bz-bb">
          <div className="image mb-20px">
            <img
              className="w-125px"
              src={IconSucces}
              alt="Order sent successfully!"
            />
          </div>
          {/* <div className="text">
            Đơn hàng <span>#{this.$f7route.params.orderID}</span> của bạn đã
            được gửi thành công.
          </div> */}
          <div className="text-center mb-20px">
            {loadingText && <Skeleton count={5} />}
            {!loadingText &&
              textPay &&
              ReactHtmlParser(
                textPay
                  .replaceAll(
                    "ID_ĐH",
                    `<b class="fw-600 text-danger">${this.$f7route.params.orderID}</b>`
                  )
                  .replaceAll(
                    "MONEY",
                    `<b class="fw-600 text-danger">${formatPriceVietnamese(
                      Math.abs(this.$f7route.query.money)
                    )} sgd</b>`
                  )
                  .replaceAll("ID_DH", `${this.$f7route.params.orderID}`)
              )}
            {Banks && Banks.length > 1 && (
              <div className="mt-10px">
                <Select
                  options={Banks}
                  className="select-control"
                  classNamePrefix="select"
                  placeholder="Choose a bank"
                  noOptionsMessage={() => "No data"}
                  value={ValueBank}
                  onChange={(val) => this.setState({ ValueBank: val })}
                  isClearable={true}
                  menuPosition="fixed"
                  styles={{
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                  menuPortalTarget={document.body}
                />
              </div>
            )}

            {ValueBank && (
              <RenderQR
                ValueBank={ValueBank}
                Total={Math.abs(this.$f7route.query.money)}
                ID={this.$f7route.params.orderID}
                MaND={MaND}
              />
            )}
          </div>
          <div className="btn">
            <Link href="/order/">Your order</Link>
            <Link className="mb-0" href="/shop/">
              Continue shopping
            </Link>
          </div>
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
