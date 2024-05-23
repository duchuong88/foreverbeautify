import { getToken } from "../constants/user";
import http from "../service/http-common";

const SubApi = '/api/v3/r23'

const moreApi = {
    getAllProvinces: data => {
        return http.post(`${SubApi}/more/tinh-thanh?token=${getToken()}`, JSON.stringify(data))
    },
    getAllDistricts: data => {
        return http.post(`${SubApi}/more/quan-huyen?token=${getToken()}`, JSON.stringify(data))
    },
    getAllGroupCustomer: data => {
        return http.post(`${SubApi}/more/nhom-khach-hang?token=${getToken()}`, JSON.stringify(data))
    },
    getAllSource: data => {
        return http.post(`${SubApi}/more/nguon-khach-hang?token=${getToken()}`, JSON.stringify(data))
    },
    getAllStaff: data => {
        return http.post(`${SubApi}/more/danh-sach-nhan-vien?token=${getToken()}`, JSON.stringify(data))
    }
}
export default moreApi