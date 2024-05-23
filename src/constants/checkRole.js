import { getUser } from "./user";

export const checkRole = () => {
    const infoUser = getUser();
    const Role = [
        "order",
        "sale",
        "service",
        "manager",
        "director",
        "store",
        "accountant",
    ];
    const ACC_TYPE = infoUser && infoUser.acc_type;

    if (ACC_TYPE === "M") {
        return "M";
    }

    if (ACC_TYPE === "U") {
        if (infoUser.ID === 1) {
            return "ADMIN";
        } else {
            return "STAFF"
        }
    }
    return null;
}