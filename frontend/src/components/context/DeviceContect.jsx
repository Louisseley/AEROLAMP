// src/components/context/DeviceContext.js

import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';  // Import PropTypes for prop validation

// Create a Context for the device
const DeviceContext = createContext();

// Create the DeviceProvider component to wrap around your app
export const DeviceProvider = ({ children }) => {
   const [deviceId, setDeviceId] = useState(null);

   return (
      <DeviceContext.Provider value={{ deviceId, setDeviceId }}>
         {children}
      </DeviceContext.Provider>
   );
};

// PropTypes validation for the `children` prop
DeviceProvider.propTypes = {
   children: PropTypes.node.isRequired,  // `children` should be a valid React node
};

// Export the custom hook that uses the DeviceContext
export const useDeviceContext = () => {
   return useContext(DeviceContext);
};
