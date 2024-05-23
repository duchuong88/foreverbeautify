import React from "react";
import { Page, Navbar, Link, Toolbar } from "framework7-react";
import ToolBarBottom from "../../components/ToolBarBottom";
import userService from "../../service/user.service";
import ReactHtmlParser from "react-html-parser";
import Skeleton from "react-loading-skeleton";
import { SET_BADGE } from "../../constants/prom21";
import { iOS } from "../../constants/helpers";
import { Form, Formik } from "formik";
import DatePicker from "react-mobile-datepicker";
import { toast } from "react-toastify";
import { PopupConfirm } from "../../components/Popup/PopupConfirm";
import BookDataService from "../../service/book.service";

import moment from "moment";
import "moment/locale/vi";
import { SERVER_APP } from "../../constants/config";

moment.locale("vi");

const dateConfig = {
  hour: {
    format: "hh",
    caption: "Hour",
    step: 1,
  },
  minute: {
    format: "mm",
    caption: "Minute",
    step: 1,
  },
  date: {
    caption: "Day",
    format: "D",
    step: 1,
  },
  month: {
    caption: "Month",
    format: "M",
    step: 1,
  },
  year: {
    caption: "Year",
    format: "YYYY",
    step: 1,
  },
};

const isExpected = (title) => {
  return title && title.includes("(expected)");
};

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      sheetOpened: false,
      loadingSubmit: false,
      isOpen: false,
      btnLoading: false,
      initialValues: {
        ID: 0,
        BookDate: "",
        Status: "CHUA_XAC_NHAN",
        Desc: "",
      },
      data: {},
      show: false,
    };
  }

  componentDidMount() {
    this.getDetialNoti();
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log(this.$f7route)
    if (prevState.data !== this.state.data) {
      if (this.state.data && this.state.data.Link === "/bao-kg/") {
        this.$f7router.navigate(this.state.data.Link);
      }
    }
  }

  getDetialNoti = async () => {
    const Id = this.$f7route.params.id;
    this.setState({
      isLoading: true,
    });
    try {
      const { data } = await userService.getNotiDetail(Id);
      const dataPost = new FormData();
      const dataBook =
        data?.data && data?.data.length > 0 && data.data[0].NotiData
          ? JSON.parse(data.data[0].NotiData)
          : null;

      this.setState({
        data: data.data[0],
        isLoading: false,
        initialValues: {
          ID:
            dataBook &&
            dataBook?.MemberBookIDs &&
            dataBook?.MemberBookIDs.length > 0 &&
            dataBook?.MemberBookIDs[0],
          BookDate: moment(dataBook?.Date, "YYYY-MM-DD HH:mm").toDate(),
          Status: "CHUA_XAC_NHAN",
          Desc: "",
        },
      });
      if (data.data[0] && !data.data[0].IsReaded) {
        iOS() && SET_BADGE();
        dataPost.append("ids", Id);
        if (!isExpected(data.data[0].Title)) {
          await userService.readedNotification(dataPost);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  closeSheet = () => {
    this.setState({
      sheetOpened: false,
    });
  };

  async loadRefresh(done) {
    done();
  }

  onSubmit = (values) => {
    const Id = this.$f7route.params.id;
    const { data } = this.state;

    const dataBook = data && data?.NotiData ? JSON.parse(data.NotiData) : null;

    this.setState({
      btnLoading: true,
    });
    const newDataPost = {
      MemberBook: {
        ...values,
        BookDate: values.BookDate
          ? moment(values.BookDate).format("YYYY-MM-DD HH:mm")
          : "",
        Desc:
          moment(dataBook?.Date, "YYYY-MM-DD HH:mm").format(
            "HH:mm DD/MM/YYYY"
          ) === moment(values.BookDate).format("HH:mm DD/MM/YYYY")
            ? "Guest agrees to the proposed schedule"
            : "Guest changes the date of expected calendar",
      },
    };

    userService.confirmBook(newDataPost).then((response) => {
      const dataPost = new FormData();
      dataPost.append("ids", Id);

      userService.readedNotification(dataPost).then(() => {
        this.$f7router.navigate(`/`);
        toast.success("Confirm successful receipt!");
        this.setState({
          btnLoading: false,
        });
      });
    });
  };

  getTitleAction = (title) => {
    if (title && title.includes("/pupup-contact/")) return "Register now";
    if (title && title.includes("/schedule/?SelectedId"))
      return "Schedule now";
    return "See details";
  };

  onActionLink = (link) => {
    if (link && link.includes("/pupup-contact/")) {
      this.setState({
        show: true,
      });
    } else {
      this.$f7router.navigate(link);
    }
  };

  onRegSubmit = (values) => {
    this.setState({
      btnLoadingReg: true,
    });
    var p = {
      contact: {
        Fullname: values.Fullname,
        Phone1: values.Phone,
        Address: "",
        Email: "",
        Content: values.Content,
      },
    };
    BookDataService.bookContact(p)
      .then(({ data }) => {
        toast.success("Registered for the promotion program successfully !", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
        this.setState({
          btnLoadingReg: false,
          show: false,
        });
        this.$f7router.navigate(`/`);
      })
      .catch((error) => console.log(error));
  };

  iconNoti = () => {
    return (
      <svg
        width={25}
        height={25}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="prefix__feather prefix__feather-bell"
        style={{
          fill: "var(--ezs-color)",
          stroke: "var(--ezs-color)",
        }}
      >
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
      </svg>
    );
  };

  fixedContentDomain = (content) => {
    if (!content) return "";
    return content.replace(/src=\"\//g, 'src="' + SERVER_APP + "/");
  };

  formatHtmlString = (htmlString) => {
    const oembedRegex = /<oembed[^>]*>/g;
    const oembedMatch = htmlString.match(oembedRegex);
    if (oembedMatch) {
      const oembedUrl = oembedMatch[0].match(/url="([^"]*)"/)[1];
      const iframeElement = `<iframe src="${oembedUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      htmlString = htmlString.replace(oembedRegex, iframeElement);
    }
    return htmlString
  };

  render() {
    const {
      isLoading,
      data,
      btnLoading,
      initialValues,
      isOpen,
      show,
      btnLoadingReg,
    } = this.state;

    return (
      <Page ptr onPtrRefresh={this.loadRefresh.bind(this)}>
        <Navbar className="navbar-no-line">
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link onClick={() => this.$f7router.navigate(`/notification/`)}>
                <i className="las la-angle-left"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">
                Thông báo
                {/* {isLoading ? "Đang tải ..." : data && data.Title} */}
              </span>
            </div>

            <div className="page-navbar__noti"></div>
          </div>
        </Navbar>
        <div className="page-render bg-white p-0">
          <div className="page-noti">
            <div
              style={{
                backgroundColor: "var(--ezs-color)",
                height: "80px",
                marginBottom: "40px",
                borderRadius: "0 0 40px 40px",
              }}
              className="position-relative"
            >
              <div
                className="position-absolute"
                style={{
                  width: "55px",
                  height: "55px",
                  bottom: "-25px",
                  background: "#fff",
                  borderRadius: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  boxShadow: "0 0 40px 0 rgba(82, 63, 105, 0.1)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {this.iconNoti()}
              </div>
            </div>
            {isLoading ? (
              <div className="p-15px">Loading ....</div>
            ) : (
              <div className="p-15px">
                <div className="page-noti-title">{data && data.Title}</div>
                <div className="page-noti-date">
                  {data && data.CreateDateVN}
                </div>
                {data && data.Thumbnail && (
                  <div className="mt-15px">
                    <img
                      className="w-100"
                      style={{
                        borderRadius: "5px",
                      }}
                      src={`${SERVER_APP}/${data.Thumbnail}`}
                      alt={data && data.Title}
                    />
                  </div>
                )}

                <div className="page-noti-desc">
                  {data &&
                    data.Body &&
                    ReactHtmlParser(data.Body.replaceAll("\n", "</br>"))}
                </div>
                <div className="page-noti-desc">
                  {data &&
                    data.Content &&
                    ReactHtmlParser(
                      this.fixedContentDomain(
                        this.formatHtmlString(data.Content)
                      )
                    )}
                </div>
                {/* <ul className="page-noti__list noti-detail">
                  <li className="readed">
                    <div>Ngày gửi </div>
                    <div>{data && data.CreateDateVN}</div>
                  </li>
                  <li className="readed">
                    <div>Nội dung</div>
                    <div>
                      {data &&
                        data.Body &&
                        ReactHtmlParser(data.Body.replaceAll("\n", "</br>"))}
                    </div>
                  </li>
                </ul> */}
              </div>
            )}
          </div>
        </div>

        <PopupConfirm
          initialValue={{
            Title: data?.Title,
          }}
          show={show}
          onHide={() => this.setState({ show: false })}
          onSubmit={(values) => this.onRegSubmit(values)}
          btnLoading={btnLoadingReg}
        />

        <Toolbar tabbar position="bottom">
          {data?.Link ? (
            <Link
              onClick={() => this.onActionLink(data?.Link)}
              className="btn-submit-order btn-submit-order text-uppercase text-white"
            >
              <span>{this.getTitleAction(data?.Link)}</span>
            </Link>
          ) : (
            <>
              {isExpected(data?.Title) && !data?.IsReaded ? (
                <Formik
                  initialValues={initialValues}
                  onSubmit={this.onSubmit}
                  enableReinitialize={true}
                >
                  {(formikProps) => {
                    const { values, touched, errors, setFieldValue } =
                      formikProps;
                    return (
                      <Form className="w-100 h-100 d--f">
                        <div
                          className="f--1 d--f fd--c jc--c px-12px"
                          onClick={() => this.setState({ isOpen: true })}
                        >
                          <div
                            className="font-size-xs"
                            style={{ lineHeight: "16px" }}
                          >
                            Execution time
                          </div>
                          <div className="fw-500" style={{ fontSize: "15px" }}>
                            {values?.BookDate
                              ? moment(values?.BookDate).format(
                                  "HH:mm DD-MM-YYYY"
                                )
                              : ""}
                            <i className="las la-edit font-size-lg pl-5px"></i>
                          </div>
                        </div>
                        <DatePicker
                          theme="ios"
                          cancelText="Close"
                          confirmText="Select"
                          headerFormat="hh:mm DD/MM/YYYY"
                          showCaption={true}
                          dateConfig={dateConfig}
                          value={values.BookDate ? values.BookDate : new Date()}
                          isOpen={isOpen}
                          onSelect={(date) => {
                            setFieldValue("BookDate", date);
                            this.setState({ isOpen: false });
                          }}
                          onCancel={() => this.setState({ isOpen: false })}
                        />
                        <button
                          type="submit"
                          className={`btn-submit-order btn-submit-order w-160px ${
                            btnLoading && "loading"
                          }`}
                        >
                          <span>Xác nhận</span>
                          <div className="loading-icon">
                            <div className="loading-icon__item item-1"></div>
                            <div className="loading-icon__item item-2"></div>
                            <div className="loading-icon__item item-3"></div>
                          </div>
                        </button>
                      </Form>
                    );
                  }}
                </Formik>
              ) : (
                <ToolBarBottom />
              )}
            </>
          )}
        </Toolbar>
      </Page>
    );
  }
}
