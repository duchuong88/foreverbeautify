import http from "../service/http-common";

class BookDataService {
    getCardService(data) {
        return http.get(`/api/v3/mbook?cmd=getroot&memberid=${data.MemberID}&ps=${data.Ps}&pi=${data.Pi}&key=${data.Key}&stockid=${data.StockID}`);
    }
    postBooking(data) {
        return http.post(`/api/v3/mbook?cmd=booking`, JSON.stringify(data));
    }
    bookDelete(data) {
        return http.post(`/api/v3/mbook?cmd=booking`, JSON.stringify(data));
    }
    getListBook(MemberID) {
        return http.get(`/api/v3/mbook?cmd=getbook&memberid=${MemberID}`);
    }
    getBookId(ID) {
        return http.get(`/api/v3/mbook?cmd=getbookid&id=${ID}`);
    }
    bookContact(data) {
        return http.post('/api/v3/contact23@send', JSON.stringify(data))
    }
}

export default new BookDataService();