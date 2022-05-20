import * as React from "react";
import PropTypes from 'prop-types';
import i18n from "@sitevision/api/common/i18n";
import './Menu.scss';

const Menu = ({activeTab, updateActiveTab}) => {

  return (
    <>
      <ul className="env-nav env-nav--menubar env-nav--border" role="menubar">
        <li className="env-nav__item" role="menuitem">
          <a id="menu-root" className={`env-nav__link ${activeTab === 0 ? 'env-nav__link--active' : ''}`} onClick={() => updateActiveTab(0)}>
            {i18n.get("latestItems")}
          </a>
        </li>
        <li className="env-nav__item" role="menuitem">
          <a
            id="menu-user-items"
            className={`env-nav__link ${activeTab === 1 ? 'env-nav__link--active' : ''}`}
            onClick={() => updateActiveTab(1)}
          >
            {i18n.get("userItems")}
          </a>
        </li>
        <li className="env-nav__item" role="menuitem">
          <a
            id="menu-create"
            className={`env-nav__link ${activeTab === 2 ? 'env-nav__link--active' : ''}`}
            onClick={() => updateActiveTab(2)}
          >
            {i18n.get("create")}
          </a>
        </li>
      </ul>
    </>
  );
};

Menu.propTypes = {
  activeTab: PropTypes.number,
  updateActiveTab: PropTypes.func
};

export default Menu;