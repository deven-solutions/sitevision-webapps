import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './App.scss';
import CreateTab from '../CreateTab';

const App = ({ message, name, testDefault }) => {
  return (
    <>
      <div style={appStyle} className={styles.container}>
        <p className={styles.text}>
          {message} {name} {testDefault}
        </p>
      </div>
      <CreateTab/>
    </> // Samma som </div>
  );
};

App.propTypes = {
  message: PropTypes.string,
  name: PropTypes.string,
  testDefault: PropTypes.string
};

App.defaultProps = {
  testDefault: 'defaultvalue..'
}

// Bara för att testa, ej rekommenderat
const appStyle = {
  backgroundColor: '#CCC'
}
 
export default App;