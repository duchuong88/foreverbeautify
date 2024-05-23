import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useState } from "react";
import UserService from "../../../../../service/user.service";
import { groupbyDDHHMM } from "../../../../../constants/format";
import LoadingChart from "../../../../../components/Loading/LoadingChart";

import "moment/locale/vi";
import moment from "moment";
import PageNoData from "../../../../../components/PageNoData";
moment.locale("vi");

const Products = forwardRef(({ MemberID }, ref) => {
  const [ListData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getListProducts();
  }, [MemberID]);

  useImperativeHandle(ref, () => ({
    onRefreshProduct(fn) {
      getListProducts(false, fn);
    },
  }));

  const getListProducts = (isLoading = true, callback) => {
    isLoading && setLoading(true);
    UserService.getListProductMember(MemberID, 1000)
      .then(({ data }) => {
        setListData(groupbyDDHHMM(data.items, "CreateDate"));
        setLoading(false);
        callback && callback();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="h-100 p-15px bs-bb">
      {loading && <LoadingChart />}
      {!loading && (
        <Fragment>
          {ListData && ListData.length > 0 ? (
            <div className="list-em-history">
              {ListData.map((item, index) => (
                <div className="item" key={index}>
                  <div className="text-uppercase fw-600">
                    Ngày {moment(item.dayFull).format("ll")}
                  </div>
                  <div className="item-lst">
                    {item.items &&
                      item.items.map((sub, idx) => (
                        <div
                          className="item-lst_sub d-flex justify-content-between align-items-center mt-0 border-bottom py-8px rounded-0"
                          key={idx}
                        >
                          <div className="service-name fw-500 pr-20px">
                            {sub.Title}
                          </div>
                          <div className="staff fw-600 w-50px text-right">
                            x{sub.Qty}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <PageNoData />
          )}
        </Fragment>
      )}
    </div>
  );
});
export default Products;
