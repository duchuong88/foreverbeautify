// return the user data from the storage
export const getNotiID = () => {
    const NotiID = localStorage.getItem("NOTI_ID");
    if (NotiID) return NotiID;
    else return null;
};
export const setNotiID = (id) => {
    localStorage.setItem("NOTI_ID", id);
};
// return the user data from the storage
export const getUser = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    else return null;
};

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export const delete_cookie = (name) => {
    document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

// return the password from the storage
export const getPassword = () => {
    return localStorage.getItem("password") || null;
};
// return the token from the storage
export const getToken = () => {
    return localStorage.getItem("token") || null;
};

// set the token and user from the storage
export const setUserLoginStorage = (usn, pwd) => {
    if (usn) setCookie("USN", usn, 365);
    if (pwd) setCookie("PWD", pwd, 365);
};

export const getUserLoginStorage = () => {
    return {
        username: getCookie("USN") || "",
        password: getCookie("PWD") || "",
    };
};

// remove the token and user from the storage
export const removeUserStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    //localStorage.removeItem('password');
};

// set the token and user from the storage
export const setUserStorage = (token, user) => {
    if (token) localStorage.setItem("token", token);
    if (user) localStorage.setItem("user", JSON.stringify(user));
    //localStorage.setItem('password', password);
};
// get Stock
export const getStockIDStorage = () => {
    return localStorage.getItem("CurrentStockID") || null;
};
// set Stock
export const setStockIDStorage = (stockID) => {
    localStorage.setItem("CurrentStockID", stockID);
};
// remove Stock
export const removeStockIDStorage = () => {
    localStorage.removeItem("CurrentStockID");
};
// get Stock
export const getStockNameStorage = () => {
    return localStorage.getItem("CurrentStockName") || null;
};
// set Stock
export const setStockNameStorage = (stockName) => {
    localStorage.setItem("CurrentStockName", stockName);
};
// remove Stock
export const removeStockNameStorage = () => {
    localStorage.removeItem("CurrentStockName");
};
//reg notification user
export const subscribe = (rt) => {
    //nếu chưa có key subscribe => ios iphone 8 lỗi
    //vì vậy cần 1 bước phụ để xác định đã có key subscribe=> để unsubscribe
    if (localStorage.getItem("_subscribe")) app_request("unsubscribe", "");
    localStorage.setItem("_subscribe", rt);

    //code bên dưới copy từ hàm login
    var topic = [];
    var Firebase_Prefix = 1;
    topic.push("news-" + Firebase_Prefix + "-" + rt.acc_type); //cho loại M(member) || (U)user
    topic.push("news-" + Firebase_Prefix + "-" + rt.acc_type + "-gr-0"); //Mặc định mọi tài khoản đều thuộc nhóm 0 tương ứng với * trong admin
    topic.push("news-" + Firebase_Prefix + "-" + rt.acc_type + "-id-0"); //Mặc định mọi tài khoản là 0 tương ứng với * trong admin

    (rt.acc_group || "")
    .split(",")
        .filter((x) => {
            return x;
        })
        .forEach((x) => {
            topic.push("news-" + Firebase_Prefix + "-" + rt.acc_type + "-gr-" + x);
        });
    topic.push(
        "news-" + Firebase_Prefix + "-" + rt.acc_type + "-id-" + rt.acc_id
    );
    //console.log(topic);
    app_request("subscribe", topic.join(","));
};

export const app_request = (cmd, value) => {
    if (window["ANDROID"]) {
        ANDROID.Do(cmd, value);
    } else {
        window.webkit &&
            window.webkit.messageHandlers &&
            window.webkit.messageHandlers.IOS.postMessage({
                cmd: cmd,
                value: value,
            });
    }
};
// return the search data from the storage
export const getKeySearch = () => {
    const dataKey = localStorage.getItem("keysearch");
    if (dataKey) return JSON.parse(dataKey);
    else return null;
};
// set the token and user from the storage
export const setKeySearch = (key) => {
    const dataKey = localStorage.getItem("keysearch");
    let arrSearch = [];
    if (dataKey) {
        arrSearch = JSON.parse(dataKey).filter((item) => item !== key);
        arrSearch.unshift(key);
    } else {
        arrSearch.push(key);
    }
    localStorage.setItem("keysearch", JSON.stringify(arrSearch));
};
export const removeKeySearch = (key) => {
    const dataKey = localStorage.getItem("keysearch");
    let arrSearch = JSON.parse(dataKey).filter((item) => item !== key);
    localStorage.setItem("keysearch", JSON.stringify(arrSearch));
};
export const getViewed = () => {
    const dataViewted = localStorage.getItem("viewed");
    if (dataViewted) return JSON.parse(dataViewted);
    else return null;
};
export const setViewed = (item) => {
    const dataViewted = localStorage.getItem("viewed");
    let arrViewted = [];
    if (dataViewted) {
        const ID = item.ID;
        arrViewted = JSON.parse(dataViewted).filter((item) => item.ID !== ID);
        arrViewted.unshift(item);
    } else {
        arrViewted.push(item);
    }
    localStorage.setItem("viewed", JSON.stringify(arrViewted));
};
export const removeViewed = (item) => {
    const dataViewted = localStorage.getItem("viewed");
    const ID = item.ID;
    let arrViewted = JSON.parse(dataViewted).filter((item) => item.ID !== ID);
    localStorage.setItem("viewed", JSON.stringify(arrViewted));
};