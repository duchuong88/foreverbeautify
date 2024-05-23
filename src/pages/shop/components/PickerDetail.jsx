import { Button, PageContent, Sheet } from "framework7-react";
import React, { useState } from "react";
import ReactHtmlParser from "react-html-parser";
import { useQuery } from "react-query";
import ShopDataService from "./../../../service/shop.service";
import { SERVER_APP } from "../../../constants/config";

function PickerDetail({ children, item }) {
  const [visible, setVisible] = useState(false);

  let { data, isLoading } = useQuery({
    queryKey: ["detail-id", { ID: item.root.ID }],
    queryFn: async () => {
      let { data } = await ShopDataService.getContentIDService(item.root.ID);
      return data && data.list && data.list.length > 0 ? data.list[0] : null;
    },
    enabled: visible,
  });

  const fixedContentDomain = (content) => {
    if (!content) return "";
    return content.replace(/src=\"\//g, 'src="' + SERVER_APP + "/");
  };

  return (
    <>
      {children({
        open: () => setVisible(true),
        close: () => setVisible(false),
      })}
      <Sheet
        opened={visible}
        className="sheet-detail"
        style={{
          height: "auto",
          "--f7-sheet-bg-color": "#fff",
        }}
        //swipeToClose
        onSheetClosed={() => setVisible(false)}
        backdrop
      >
        <Button
          onClick={() => setVisible(false)}
          className="show-more sheet-close"
        >
          <i className="las la-times"></i>
        </Button>
        <PageContent>
          <div className="page-shop__service-detail">
            <div className="title">
              <h4>{item.root.Title}</h4>
            </div>
            <div className="content">
              {ReactHtmlParser(item.root.Desc)}
              {isLoading ? "Đang tải nội dung ... " : ReactHtmlParser(fixedContentDomain(data?.Detail))}
            </div>
          </div>
        </PageContent>
      </Sheet>
    </>
  );
}

export default PickerDetail;
