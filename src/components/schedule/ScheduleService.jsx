import React, { useEffect, useRef, useState } from "react";
import { Link, ListItem, Toolbar } from "framework7-react";
import { getStockIDStorage, getUser } from "../../constants/user";
import BookDataService from "../../service/book.service";
import InfiniteScroll from "react-infinite-scroll-component";
import SkeletonScheduleSpa from "./SkeletonScheduleSpa";
import PageNoData from "../PageNoData";
import ReactHtmlParser from "react-html-parser";
import IMAGEHOT from "../../assets/images/hot-deal.png";
import LoadingDot from "../Loading/LoadingDot";

function ScheduleService({
  height,
  selectedService,
  handleService,
  DateTimeBook,
}) {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    Ps: 15,
    Pi: 1,
    Key: "",
    Total: 0,
  });
  const [notLoading, setNotLoading] = useState(false);
  const [Total, setTotal] = useState(0);
  const [listService, setListService] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [valueS, setValueS] = useState("");
  const typingTimeoutRef = useRef(null);

  async function getServices() {
    !loading && !notLoading && setLoading(true);
    const StockID = DateTimeBook.stock
      ? DateTimeBook.stock
      : getStockIDStorage() || 0;
    const { ID } = getUser();
    const objFilter = {
      MemberID: ID,
      StockID: StockID,
      Key: filters.Key || valueS,
      ...filters,
    };
    const { data } = await BookDataService.getCardService(objFilter);
    const lst =
      filters.Pi > 1 ? [...new Set([...listService, ...data.lst])] : data.lst;
    setLoading(false);
    //setHasMore(false);
    setTotal(data.total);
    setListService(lst);
    setNotLoading(false);
  }

  useEffect(() => {
    getServices();
  }, [filters]);

  const fetchMoreData = () => {
    if (listService.length >= Total) {
      return;
    }
    setHasMore(true);
    setNotLoading(true);
    setFilters({
      ...filters,
      Pi: filters.Pi + 1,
    });
  };

  const handleSearch = (val) => {
    setLoading(true);
    setValueS(val);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setFilters({
        ...filters,
        Key: val,
        Pi: 1,
      });
    }, 500);
  };

  const onSumit = () => {
    event.preventDefault();
    getServices();
  };

  const treatmentCard = (item) => {
    return (
      item.OsBook > 0 || item.OsDoing > 0 || item.OsNew > 0 || item.OsBH > 0
    );
  };

  const isSvHot = (item) => {
    return item.Status.search("2") > -1;
  };

  const isActive = (selectedService, item) => {
    return selectedService.some((service) => service?.ID === item?.ID);
  };

  return (
    <div className="page-schedule__box h-100">
      <div className="service-me h-100">
        <div className="service-search">
          <form onSubmit={onSumit}>
            <input
              type="text"
              placeholder="Nhập tên dịch vụ bạn cần ?"
              value={valueS}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <button type="submit">
              <i className="las la-search"></i>
            </button>
          </form>
        </div>
        {listService && (
          <InfiniteScroll
            dataLength={listService.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={listService.length < Total && <LoadingDot />}
            height={height}
            // endMessage={
            //   <p style={{ textAlign: "center" }}>
            //     <b>Tổng có {filters.Total} nhân viên</b>
            //   </p>
            // }
          >
            <div className="service-me__list">
              {loading && <SkeletonScheduleSpa />}
              {!loading && (
                <>
                  {listService && listService.length > 0 ? (
                    listService.map((item, index) => (
                      <div
                        className={`item ${
                          isActive(selectedService, item) && "active"
                        } ${
                          isSvHot(item) && !treatmentCard(item) && "deal-hot"
                        }`}
                        key={index}
                        onClick={() => handleService(item)}
                      >
                        <div className="item-title">
                          {item.Title} <label className="hot">HOT</label>
                        </div>
                        <div className="font-size-xs text-muted">
                          {item.ProdItems &&
                            item.ProdItems.map((prod) => prod.Title).join(", ")}
                        </div>
                        {treatmentCard(item) && (
                          <div className="item-desc item-treat">
                            <i className="las la-tag"></i>{" "}
                            {item.OsBH > 0
                              ? "Đang có thẻ bảo hành"
                              : "Đang có thẻ liệu trình"}
                          </div>
                        )}
                        {item.SaleDecs && (
                          <div className="item-desc">
                            {ReactHtmlParser(item.SaleDecs)}
                          </div>
                        )}
                        <i className="las la-check-circle"></i>
                      </div>
                    ))
                  ) : (
                    <PageNoData text="Không tìm thấy dịch vụ" />
                  )}
                </>
              )}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}

export default ScheduleService;
