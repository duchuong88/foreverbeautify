import { getUser } from "./user";

export const checkRouterHome = () => {
    const infoUser = getUser();
    const ACC_TYPE = infoUser && infoUser.acc_type;
    if (ACC_TYPE === "M") {
        return HomeIndex;
    }

    if (ACC_TYPE === "U") {
        if (infoUser.ID === 1) {
            return EmployeeReportPage;
        } else {
            const groupRole = infoUser.GroupTitles;
            if (groupRole.includes("service")) {
                return EmployeeServicePage;
            } else if (groupRole.includes("director")) {
                return EmployeeReportPage;
            } else {
                return EmployeeStatisticalPage;
            }
        }
    }
    return HomeIndex;
}

export const CheckPrivateNav = (roles) => {
    const infoUser = getUser();
    const userRoles = infoUser.GroupTitles;
    const hasRole = roles.some((role) => userRoles.includes(role));
    const hasRoleLength = Array.isArray(userRoles) && userRoles.length === 0 && Array.isArray(roles) && roles.length === 0;
    return hasRole || hasRoleLength;
}