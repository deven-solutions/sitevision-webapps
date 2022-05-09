import * as React from "react";
import PropTypes from 'prop-types';
import i18n from "@sitevision/api/common/i18n";

const Menu = ({updateActiveTab}) => {

  const handleClick = (activeTab) => {
    updateActiveTab(activeTab)
  };

  return (
    <>
      <ul className="env-nav env-nav--menubar env-nav--border" role="menubar">
        <li className="env-nav__item" role="menuitem">
          <a id="menu-root" className="env-nav__link" onClick={() => handleClick(0)}>
            {i18n.get("latestItems")}
          </a>
        </li>
        <li className="env-nav__item" role="menuitem">
          <a
            id="menu-user-items"
            className="env-nav__link"
            onClick={() => handleClick(1)}
          >
            {i18n.get("userItems")}
          </a>
        </li>
        <li className="env-nav__item" role="menuitem">
          <a
            id="menu-create"
            className="env-nav__link"
            onClick={() => handleClick(2)}
          >
            {i18n.get("create")}
          </a>
        </li>
      </ul>
    </>
  );
};

Menu.propTypes = {
  updateActiveTab: PropTypes.func
};

export default Menu;