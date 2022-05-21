import * as React from "react";
import PropTypes from "prop-types";
import UserItem from "../UserItem";
import Items from "../Items";
import Menu from "../Menu";
import UserItems from "../UserItems";

const App = ({ isLoggedIn }) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [userItem, setUserItem] = React.useState({});

  const updateActiveTab = (activeTab) => {
    setActiveTab(activeTab);
  };

  const updateUserItem = (userItem) => {
    setUserItem(userItem);
  };

  return (
    <>
      {isLoggedIn ? (
        <Menu
          isLoggedIn={isLoggedIn}
          activeTab={activeTab}
          updateActiveTab={updateActiveTab}
          userItem={userItem}
        />
      ) : null}
      {
        {
          0: <Items />,
          1: (
            <UserItems
              updateUserItem={updateUserItem}
              updateActiveTab={updateActiveTab}
            />
          ),
          2: (
            <UserItem
              userItem={userItem}
              updateUserItem={updateUserItem}
              updateActiveTab={updateActiveTab}
            />
          ),
        }[activeTab]
      }
    </>
  );
};

App.propTypes = {
  message: PropTypes.string,
  name: PropTypes.string,
  isLoggedIn: PropTypes.bool,
};

export default App;
