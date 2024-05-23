import { getToken } from "../constants/user";
import http from "../service/http-common";

const SubApi = "/api/v3/r23";

class ReportService {
    getReportDate(data) {
        return http.post(`${SubApi}/bao-cao-ngay/danh-sach?token=${getToken()}`, JSON.stringify(data));
    }
    getReportCustomerOverview = (data) => {
        return http.post(`${SubApi}/khach-hang/tong-quan?token=${getToken()}`, JSON.stringify(data));
    }
    getReportCustomerList = (data) => {
        return http.post(`${SubApi}/khach-hang/danh-sach?token=${getToken()}`, JSON.stringify(data));
    }
}

export default new ReportService();