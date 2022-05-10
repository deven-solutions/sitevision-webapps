import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './App.scss';
import CreateItem from '../CreateItem';
import Items from '../Items';
import Menu from '../Menu';

const App = ({ name }) => {

  const [activeTab, setActiveTab] = React.useState(0)

  const updateActiveTab = activeTab => {
    setActiveTab(activeTab)
  }

  return (
    <>
      {/*<div className={styles.container}>
        <p className={styles.text}>
          {name}
        </p>
      </div>*/}
      <Menu updateActiveTab={updateActiveTab}/>
      {
        {
          0: <Items/>,
          1: <h2>TODO Visa mina annonser..</h2>,
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