import React from "react";
import PropTypes from "prop-types";
import { Link } from "framework7-react";
import { getUser } from "../constants/user";

PrivateNav.propTypes = {
  // auth: PropTypes.object.isRequired
};

function PrivateNav({ roles, text, icon, className, href }) {
  const infoUser = getUser();
  const userRoles = infoUser.GroupTitles;
  const hasRole = roles === 'all' || Array.isArray(roles) && roles.some((role) => userRoles.includes(role));
  const hasRoleLength = Array.isArray(userRoles) && userRoles.length === 0 && Array.isArray(roles) && roles.length === 0 ;
  if (hasRole || hasRoleLength || Number(infoUser.acc_group) === 1) {
    return (
      <Link noLinkClass href={href} className={className}>
        <i className={icon}></i>
        <span>{text}</span>
      </Link>
    );
  } else {
    return null;
  }
}

export default PrivateNav;
