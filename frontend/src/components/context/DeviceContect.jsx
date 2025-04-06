// src/components/context/DeviceContext.js

import { createContext, useState, useContext } from 'react';

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

// Export the custom hook that uses the DeviceContext
export const useDeviceContext = () => {
   return useContext(DeviceContext);
};
