import { Link } from "framework7-react";
import React from "react";
import { SERVER_APP } from "../../../../constants/config";
import ReactHtmlParser from "react-html-parser";
import { getStockIDStorage, getUser } from "../../../../constants/user";
import { PopupConfirm } from "../../../home/components/PopupConfirm";
import { toast } from "react-toastify";
import BookDataService from "../../../../service/book.service";

export default class ProductItemCategory extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  handleUrl = (item) => {
    const userCurent = getUser();
    if (item.Link && item.Link.includes("/schedule/")) {
      const url = `${item.Link}&note=${encodeURIComponent(item.Title)}`;
      this.$f7.views.main.router.navigate(userCurent ? url : "/login/");
    } else if (item.Link && item.Link.includes("/pupup-contact/")) {
      this.setState({
        show: true,
        initialValues: item,
      });
    } else {
      this.$f7.views.main.router.navigate(item.Link);
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
    const { item, isUI } = this.props;
    const {initialValues, show, btnLoading} = this.state
    return (
      <>
        <li className={`${isUI > 0 ? "no-before" : ""}`} key={item.ID}>
          <Link onClick={() => this.handleUrl(item)}>
            <div className="image">
              <img
                className={`${isUI > 0 ? "h-auto" : ""}`}
                src={SERVER_APP + "/Upload/image/" + item.FileName}
                alt={item.Title}
              />
            </div>
            {isUI === 0 && (
              <div className="text">
                <h3>{item.Title}</h3>
                <div className="text-desc">{ReactHtmlParser(item.Desc)}</div>
              </div>
            )}
          </Link>
        </li>
        <PopupConfirm
          initialValue={initialValues}
          show={show}
          onHide={() => this.onHide()}
          onSubmit={(values) => this.onSubmit(values)}
          btnLoading={btnLoading}
        />
      </>
    );
  }
}
