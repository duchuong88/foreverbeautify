import {
    SERVER_APP
} from "../constants/config";
import imgNoProduct from "./../assets/images/no-product.png";
import moment from 'moment';
import 'moment/locale/vi';
moment.locale('vi');

//Format VNĐ
export const formatPriceVietnamese = (price) => {
    if (!price || price === 0) {
        return "0";
    } else {
        return price.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    }
};

export const formatPricePositive = (price) => {
    if (!price || price === 0) {
        return "0";
    } else {
        return Math.abs(price).toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    }
};

//format date service
export const formatDateSv = (date) => {
    if (date === null) return false;
    const dateSv = date.split("T")[0];
    const dateTo = dateSv.split("-");
    return dateTo[2] + "/" + dateTo[1] + "/" + dateTo[0];
}
export const formatDateNotYYYY = (date) => {
    if (date === null) return false;
    const dateSv = date.split("T")[0];
    const dateTo = dateSv.split("-");
    return dateTo[2] + "-" + dateTo[1];
}
export const formatDateBirday = (date) => {
    if (date === null || date === undefined) return false;
    const dateSv = date.split("T")[0];
    const dateTo = dateSv.split("-");
    return dateTo[2] + "." + dateTo[1] + "." + dateTo[0];
}
export const formatDateUTC = (date) => {
    var date = new Date(date),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("/");
}

// Check Sale 
export const checkSale = (SaleBegin, SaleEnd, PriceSale) => {
    if (!SaleBegin || !SaleEnd) return false;
    var SaleBegins = SaleBegin.slice(0, 10);
    var SaleEnds = SaleEnd.slice(0, 10);
    var todaydate = new Date();
    var day = todaydate.getDate();
    var month = todaydate.getMonth() + 1;
    var year = todaydate.getFullYear();
    var datetoday = year + "-" + month + "-" + day;

    if (
        Date.parse(todaydate) < Date.parse(SaleEnd) &&
        Date.parse(SaleBegin) <= Date.parse(todaydate) && PriceSale > 0
    ) {
        return true;
    } else {
        return false;
    }
};

// So sánh ngày giờ

export const isFromBiggerThanTo = (dtmfrom, dtmto) => {
    return new Date(dtmfrom).getTime() > new Date(dtmto).getTime();
}

//Tính phần trăm sale Product
export const percentagesSale = (Price, PriceSale) => {
        return 100 - ((PriceSale / Price) * 100);
    }
    //Check avatar Null
export const checkImageProduct = (src) => {
        if (src === "null.gif" || src === "") {
            return SERVER_APP + "/app2021/images/no-product.png"
        } else {
            return SERVER_APP + "/Upload/image/" + src;
        }
    }
    //Check avatar Null
export const checkAvt = (src) => {
    if (src === "null.gif" || src === "" || src === undefined) {
        return SERVER_APP + "/app2021/images/avatar-null.png"
    } else {
        return SERVER_APP + "/Upload/image/" + src;
    }
}
export const checkAvt2 = (src) => {
    if (src === "null.gif" || src === "") {
        return SERVER_APP + "/app2021/images/avatar-null2.png"
    } else {
        return SERVER_APP + "/Upload/image/" + src;
    }
}

// Get date max book
export const maxBookDate = (services) => {
    var max = '';
    services && services.map((x) => {
        if (x.BookDate && x.BookDate > max) max = x.BookDate;
    })
    if (max) {
        return moment(max).fromNow()
    }
    return max;
}

export const getDateFacebook = (date) => {
    return moment(date).startOf('day').fromNow();
}

// validateEmail
export const validateEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// Kiểm tra số ngày tới
export const checkDateDiff = (dateEnd) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date();
    const secondDate = new Date(dateEnd);
    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    return diffDays;
}

export const groupbyTIME = (arr, name = "BookDate") => {
    return arr.sort(function(left, right) {
        return moment.utc(left[name]).diff(moment.utc(right[name]))
    })
}

//Group item theo ngày
export const groupbyDDHHMM = (arr, name = "BookDate") => {
    const newArr = [];
    if (!arr) return false;
    arr.map(item => {
        const dayFull = item[name];
        const d = dayFull.split("T")[0];
        var g = null;
        newArr.every((_g) => {
            if (_g.day == d) g = _g;
            return g == null;
        })
        if (g == null) {
            g = {
                day: d,
                dayFull: dayFull,
                items: []
            };
            newArr.push(g);
        }
        g.items.push(item);
    })
    return newArr.map(item => ({...item,
        items: item.items.sort(function(left, right) {
            return moment.utc(right[name]).diff(moment.utc(left[name]))
        })
    })).sort(function(left, right) {
        return moment.utc(right.dayFull).diff(moment.utc(left.dayFull))
    });
}

export const groupbyDDHHMM2 = (arr, key) => {
    const newArr = [];
    if (!arr) return false;
    arr.map(item => {
        const dayFull = item.BookDate;
        const d = moment(dayFull).format("YYYY-DD-MM");
        var g = null;
        newArr.every((_g) => {
            if (_g.day == d) g = _g;
            return g == null;
        })
        if (g == null) {
            g = {
                day: d,
                dayFull: dayFull,
                items: []
            };
            newArr.push(g);
        }
        g.items.push(item);
    })
    return newArr;
}

export const getTimeToCreate = (date) => {
    if (!date) return false;
    const time = date.split(" ")[1];
    return time;
}
export const getDateToCreate = (date) => {
    if (!date) return false;
    const dates = date.split(" ")[0];
    return dates;
}