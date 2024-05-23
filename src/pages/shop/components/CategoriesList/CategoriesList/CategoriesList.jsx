import React from "react";
import { getStockIDStorage } from "../../../../../constants/user";
import ShopDataService from "../../../../../service/shop.service";
import { Link } from "framework7-react";
import Skeleton from "react-loading-skeleton";
import PerfectScrollbar from "react-perfect-scrollbar";

const perfectScrollbarOptions = {
  wheelSpeed: 5,
  wheelPropagation: false,
  suppressScrollY: true,
  swipeEasing: false,
};

export default class CategoriesList extends React.Component {
  constructor() {
    super();
    this.state = {
      arrCate: [],
      activeId: 0,
      loading: false,
    };
  }

  componentDidMount() {
    this.getCategories();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.getCategories();
    }
    if (prevProps.currentId !== this.props.currentId) {
      this.setState({
        activeId: this.props.currentId,
      });
    }
  }

  getCategories = () => {
    this.setState({
      loading: true,
    });
    const cateID = this.props.id;
    if (Number(cateID) < 1) return false;
    const stockid = getStockIDStorage();
    stockid ? stockid : 0;
    ShopDataService.getCate(cateID, stockid)
      .then((response) => {
        const arrCate = response.data;
        const arrCateNew = arrCate.filter((item) => item.IsPublic !== 0);
        arrCateNew.unshift({
          Title: "All",
          ID: cateID,
        });

        this.setState({
          arrCate: arrCateNew,
          loading: false,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    const { arrCate, activeId, loading } = this.state;

    if (this.props.id === "hot") return "";

    return (
      <PerfectScrollbar
        options={perfectScrollbarOptions}
        className="list-cate scroll-hidden scroll"
      >
      
        {loading &&
          Array(4)
            .fill()
            .map((item, index) => (
              <Link
                //href={"/shop/" + item.ID + "/"}
                className={`page-news__list-item`}
                key={index}
              >
                <Skeleton width={100} />
              </Link>
            ))}

        {!loading &&
          arrCate &&
          arrCate.map((item, index) => {
            return (
              <Link
                //href={"/shop/" + item.ID + "/"}
                className={`${
                  Number(activeId) === Number(item.ID) && "active"
                }`}
                onClick={() => this.props.changeCate(item)}
                key={index}
              >
                {item.Title}
              </Link>
            );
          })}
      </PerfectScrollbar>
    );
  }
}
