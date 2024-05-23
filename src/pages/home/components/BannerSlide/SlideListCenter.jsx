import React from "react";
import { Link } from "framework7-react";
import NewsDataService from "../../../../service/news.service";
import Slider from "react-slick";
import { SERVER_APP } from "../../../../constants/config";
import Skeleton from "react-loading-skeleton";
import { validURL } from "../../../../constants/helpers";
import { getStockIDStorage, getUser } from "../../../../constants/user";
import { PopupConfirm } from "../PopupConfirm";
import BookDataService from "../../../../service/book.service";
import { toast } from "react-toastify";

export default class SlideListCenter extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getBanner();
  }

  getBanner = () => {
    NewsDataService.getBannerName(this.props.BannerName)
      .then((response) => {
        const arrBanner = response.data.data;
        this.setState({
          arrBanner: arrBanner,
          isLoading: false,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  handleUrl = (item) => {
    const userCurent = getUser();
    if (item.Link && item.Link.includes("/schedule/")) {
      const url = `${item.Link}&note=${encodeURIComponent(item.Title)}`;
      this.props.f7router.navigate(userCurent ? url : "/login/");
    } else if (item.Link && item.Link.includes("/pupup-contact/")) {
      this.setState({
        show: true,
        initialValues: item,
      });
    } else {
      this.props.f7router.navigate(item.Link);
    }
  };
  onHide = () => {
    this.setState({
      show: false,
      initialValues: null,
    });
  };
  onSubmit = (values) => {
    let StockID = getStockIDStorage();
    if (!StockID) {
      this.props.OpenStock();
    } else {
      this.setState({
        btnLoading: true,
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
          toast.success("Đăng ký chương trình ưu đãi thành công !", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
          this.setState({
            btnLoading: false,
            show: false,
            initialValues: null,
          });
        })
        .catch((error) => console.log(error));
    }
  };

  render() {
    const { arrBanner, isLoading, initialValues, show, btnLoading } =
      this.state;
    if (arrBanner && arrBanner.length < 3) {
      return "";
    }
    return (
      <React.Fragment>
        {!isLoading && (
          <React.Fragment>
            {arrBanner && arrBanner.length > 0 && (
              <div
                className={`home-slide-center bg-white ${this.props.className}`}
              >
                {arrBanner &&
                  arrBanner.slice(0, 3).map((item, index) => (
                    <Link
                      noLinkClass
                      onClick={() => this.handleUrl(item)}
                      className={`${
                        !window.GlobalConfig.APP.Home?.SliderFull && "rounded"
                      } overflow-hidden ${
                        validURL(item.Link) ? "external" : ""
                      }`}
                      key={index}
                    >
                      <img
                        src={SERVER_APP + "/Upload/image/" + item.FileName}
                        alt={item.Title}
                      />
                    </Link>
                  ))}
              </div>
            )}
          </React.Fragment>
        )}

        {isLoading && (
          <div className={`home-slide-center bg-white ${this.props.className}`}>
            <div style={{ width: "25%" }}>
              <Skeleton height={120} />
            </div>
            <div style={{ width: "50%" }}>
              <div className="px-15px">
                <Skeleton height={120} />
              </div>
            </div>
            <div style={{ width: "25%" }}>
              <Skeleton height={120} />
            </div>
          </div>
        )}

        <PopupConfirm
          initialValue={initialValues}
          show={show}
          onHide={() => this.onHide()}
          onSubmit={(values) => this.onSubmit(values)}
          btnLoading={btnLoading}
        />
      </React.Fragment>
    );
  }
}
