import * as React from 'react';
import PropTypes from 'prop-types';
import CreateItem from '../CreateItem';
import Items from '../Items';
import Menu from '../Menu';
import UserItems from '../UserItems';

const App = () => {

  const [activeTab, setActiveTab] = React.useState(0)

  const updateActiveTab = activeTab => {
    setActiveTab(activeTab)
  }

  return (
    <>
      <Menu activeTab={activeTab} updateActiveTab={updateActiveTab}/>
      {
        {
          0: <Items/>,
          1: <UserItems/>,
          2: <CreateItem/>
        }[activeTab]
      }
    </>
  );
};

App.propTypes = {
  message: PropTypes.string,
  name: PropTypes.string
};

export default App;