import React, {
  forwardRef,
  Fragment,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import UserService from "../../../../../service/user.service";
import PageNoData from "../../../../../components/PageNoData";
import LoadingChart from "../../../../../components/Loading/LoadingChart";

import "moment/locale/vi";
import moment from "moment";
moment.locale("vi");

const TheRest = forwardRef(({ MemberID }, ref) => {
  const [ListData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getListRest();
  }, [MemberID]);

  useImperativeHandle(ref, () => ({
    onRefreshRest(fn) {
      getListRest(false, fn);
    },
  }));

  const getListRest = (isLoading = true, callback) => {
    isLoading && setLoading(true);
    UserService.getListTagService(MemberID, 0)
      .then(({ data }) => {
        const newData = [];
        for (let item of data) {
          if (item.TabIndex < 2) {
            let nearestDate = null;
            item.Services &&
              item.Services.filter((service) => service.Status === "done").map(
                ({ BookDate }) => {
                  if (!nearestDate) {
                    nearestDate = BookDate;
                  }

                  let diff = moment(BookDate).diff(
                    moment(nearestDate),
                    "minutes"
                  );

                  if (diff > 0) {
                    nearestDate = BookDate;
                  }
                }
              );

            item.Services =
              item.Services &&
              item.Services.filter((service) => service.Status !== "done");

            item.LastSession = nearestDate;
            newData.push(item);
          }
        }
        setListData(newData);
        setLoading(false);
        callback && callback();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="min-h-100 p-15px bs-bb">
      {loading && <LoadingChart />}
      {!loading && (
        <Fragment>
          {ListData && ListData.length > 0 ? (
            <div className="list-em-history">
              {ListData.map((item, index) => (
                <div className="bg-white rounded mb-15px p-15px" key={index}>
                  <div className="text-uppercase fw-600 mb-5px">
                    {item.OrderItem.ProdTitle} ({item.Title})
                  </div>
                  <div className="mb-3px">
                    {item.TabIndex === 1 ? (
                      <span className="text-danger fw-500">Thẻ bảo hành</span>
                    ) : (
                      <>
                        Số buổi còn{" "}
                        <span className="text-danger fw-500 px-5px">
                          {item.Services.length}
                        </span>
                        buổi
                      </>
                    )}
                  </div>
                  <div>
                    Buổi gần nhất
                    <span className="fw-500 pl-5px">
                      {item.LastSession
                        ? moment(item.LastSession).format("HH:mm DD-MM-YYYY")
                        : "Thẻ mới chưa thực hiện"}
                    </span>
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
export default TheRest;
