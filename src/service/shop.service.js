import {
    getToken
} from "../constants/user";
import http from "../service/http-common";

class ShopDataService {
    getCate(id, stockid) {
        return http.get(`/app/index.aspx?cmd=cate_parentid&id=${id}&stockid=${stockid}&token=${getToken()}`);
    }
    getList(id, pi, ps, tags, keys, stockid, status) {
        return http.get(`/app/index.aspx?cmd=search_prods&token=${getToken()}&key=${keys}&cates=${id}&pi=${pi}&ps=${ps}&stockid=${stockid}&status=${tags === "hot" ? "3" : status}`);
    }
    getListProduct(id, stockid, count) {
        return http.get(`/app/index.aspx?cmd=search_prods&token=${getToken()}&key=&cates=${id}&pi=1&ps=${count}&tags=&stockid=${stockid}`);
    }
    getTitleCate(id) {
        return http.get(`/api/v3/content?cmd=id&id=${id}&tb=categories&token=${getToken()}`);
    }
    getDetail(id) {
        return http.get(`/app/index.aspx?id=${id}&cmd=prodid&token=${getToken()}`);
    }
    getDetailFull(id, userId, stockid) {
        return http.get(`/api/v3/prod?cmd=getid&id=${id}&mid=${userId}&token=${getToken()}&stockid=${stockid}`);
    }
    getServiceParent(id, stock, pi, ps, ignorepublic, original) {
        return http.get(`/api/v3/app2?get=sv&cid=${id}&token=${getToken()}&stockid=${stock}&takes=Detail,Desc&pi=${pi}&ps=${ps}${ignorepublic ? `&ignorepublic=${ignorepublic}` : ""}${original? `&rootIds=${original}` : ""}`);
    }
    getServiceParentCancel(id, stock, pi, ps, ignorepublic, original, cancelToken) {
        return http.get(`/api/v3/app2?get=sv&cid=${id}&token=${getToken()}&stockid=${stock}&takes=Detail,Desc&pi=${pi}&ps=${ps}${ignorepublic ? `&ignorepublic=${ignorepublic}` : ""}${original? `&rootIds=${original}` : ""}`, cancelToken);
    }
    getServiceParentID(id, stockid) {
        return http.get(`/app/index.aspx?cmd=service_parentid&token=${getToken()}&id=${id}&stockid=${stockid}`);
    }
    getContentIDService(ids) {
        return http.get(`/api/v3/JsonCache@get?type=Productent&ids=${ids}`)
    }
    getServiceOriginal(stockid) {
        return http.get(`/api/v3/prod?cmd=roots&stockid=${stockid}&token=${getToken()}`);
    }
    getServiceProdID(id, stockid) {
        return http.get(`/app/index.aspx?cmd=service_prodsid&token=${getToken()}&id=${id}&stockid=${stockid}`);
    }
    getSearchService(keys, cateId, stockid) {
        return http.get(`/app/index.aspx?cmd=search_prods&token=${getToken()}&key=${keys}&cates=${cateId}&pi=1&ps=1000&stockid=${stockid}`);
    }
    getProd() {
        return http.get(`/app/index.aspx?cmd=ProdService&token=${getToken()}`);
    }
    getUpdateOrder(data) {
        return http.post(`/api/v3/orderclient?cmd=get&token=${getToken()}`, data);
    }
    searchVoucher(data) {
        return http.get(`/api/v3/VoucherClient?cmd=precheck&token=${getToken()}&orderid=${data.orderId}&vcode=${data.vcode}`);
    }
    searchProd(data) {
        return http.get(`/app/index.aspx?cmd=search_prods&token=${getToken()}&key=${data.key}&cates=&pi=1&ps=${data.count}&tags=&stockid=${data.stockid}`);
    }
}

export default new ShopDataService();