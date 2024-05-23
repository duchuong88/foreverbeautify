import React from "react";
import { SERVER_APP } from "../constants/config";


export default class PageNoData extends React.Component {
    render() {
        const data = this.props;
        return (
            <div className="page-nodata">
                <div className="page-nodata__img">
                    <img src={SERVER_APP + "/app2021/images/nodata.png"} alt="Chưa có dữ liệu"/>
                </div>
                <div className="page-nodata__text">
                    {data.text}
                </div>
            </div>
        )
    }
}