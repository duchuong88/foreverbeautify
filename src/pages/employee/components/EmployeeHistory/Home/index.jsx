import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useState } from "react";
import UserService from "../../../../../service/user.service";

import "moment/locale/vi";
import moment from "moment";
import { groupbyDDHHMM } from "../../../../../constants/format";
import PageNoData from "../../../../../components/PageNoData";
import LoadingChart from "../../../../../components/Loading/LoadingChart";
moment.locale("vi");

const History = forwardRef(({ MemberID }, ref) => {
  const [ListData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getListHistory();
  }, [MemberID]);

  useImperativeHandle(ref, () => ({
    onRefreshHistory(fn) {
      getListHistory(false, fn);
    },
  }));

  const getListHistory = (isLoading = true, callback) => {
    isLoading && setLoading(true);
    UserService.getListTagService(MemberID, 0)
      .then(({ data }) => {
        const newData = [];
        for (let item of data) {
          for (let service of item.Services) {
            if (service.Status === "done")
              newData.push({
                ...service,
                ProdTitle: item.OrderItem.ProdTitle,
              });
          }
        }
        setListData(groupbyDDHHMM(newData));
        setLoading(false);
        callback && callback();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="h-100 p-15px bs-bb">
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
                    {item.items.map((sub, idx) => (
                      <div className="item-lst_sub" key={idx}>
                        <div className="time">
                          <i className="las la-clock pr-5px"></i>
                          {moment(sub.BookDate).format("HH:mm A")}
                        </div>
                        <div className="service-name fw-500">
                          <i className="las la-heart pr-5px"></i>
                          {sub.ProdTitle} ({sub.Title})
                        </div>
                        <div className="staff fw-500">
                          <i className="las la-user-circle pr-5px"></i>
                          Thực hiện :{" "}
                          {sub.Staffs &&
                            sub.Staffs.map((staff) => staff.FullName).join(
                              ", "
                            )}
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
      {loading && <LoadingChart />}
    </div>
  );
});

export default History;
