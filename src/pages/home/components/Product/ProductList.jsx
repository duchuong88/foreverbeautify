import React from "react";
import ShopDataService from "../../../../service/shop.service";
import { Col, Link, Row } from "framework7-react";
import { getStockIDStorage } from "../../../../constants/user";
import ProductItem from "../Product/ProductItem";
import SkeletonProduct from "../../components/Product/SkeletonProduct";

export default class ProductList extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getDataList("794,10106", "1", 4, "", "");
  }

  getDataList = (ID, pi, ps, tag, keys) => {
    //ID Cate
    //Trang hiện tại
    //Số sản phẩm trên trang
    // Tag
    //keys Từ khóa tìm kiếm

    let stockid = getStockIDStorage();
    if (!stockid) {
      stockid = 0;
    }
    ShopDataService.getList(ID, pi, ps, tag, keys, stockid, "2")
      .then((response) => {
        const arrCateList = response.data.data.lst;
        this.setState({
          arrCateList: arrCateList,
          isLoading: false,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    const { arrCateList, isLoading } = this.state;
    return (
      <React.Fragment>
        {!isLoading && (
          <React.Fragment>
            {arrCateList && arrCateList.length > 0 && (
              <div className="home-page__product">
                <div className="head">
                  <h5>
                    <Link href="/shop/794/">
                      Hot products <i className="las la-angle-right"></i>
                    </Link>
                  </h5>
                </div>
                <div className="body">
                  <Row>
                    {arrCateList &&
                      arrCateList.map((item, index) => (
                        <Col width="50" key={index}>
                          <ProductItem item={item} source={item.source} />
                        </Col>
                      ))}
                  </Row>
                </div>
              </div>
            )}
          </React.Fragment>
        )}
        {isLoading && (
          <div className="home-page__product">
            <div className="head">
              <h5>Hot products</h5>
              <div className="all">
                <Link href="/shop/794/">
                  See all <i className="las la-angle-right"></i>
                </Link>
              </div>
            </div>
            <div className="body">
              <SkeletonProduct />
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}
