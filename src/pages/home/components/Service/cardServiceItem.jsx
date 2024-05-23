import React from "react";
import { Link } from "framework7-react";
import { SERVER_APP } from "../../../../constants/config";
import { PopupConfirm } from "../PopupConfirm";
import BookDataService from "../../../../service/book.service";
import { getStockIDStorage, getUser } from "../../../../constants/user";
import { toast } from "react-toastify";

export default class CardServiceItem extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
      initialValues: null,
      btnLoading: false,
    };
  }

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

  render() {
    const item = this.props.item;
    const { initialValues, show, btnLoading } = this.state;

    return (
      <>
        <Link onClick={() => this.handleUrl(item)} noLinkClass>
          <img
            src={`${SERVER_APP}/Upload/image/${item.FileName}`}
            alt={item.Title}
          />
          <div className="text">{item.Title}</div>
        </Link>
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
