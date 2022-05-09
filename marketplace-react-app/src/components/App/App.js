import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './App.scss';
import CreateTab from '../CreateTab';
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
      { activeTab == 0 ? <h2>Visa alla annonser...</h2> : null }
      { activeTab == 1 ? <h2>Visa mina annonser..</h2> : null }
      { activeTab == 2 ? <CreateTab/> : null }
    </>
  );
};

App.propTypes = {
  message: PropTypes.string,
  name: PropTypes.string
};

export default App;