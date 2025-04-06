import {useState, useEffect} from "react"
import AxiosInstance from './AxiosInstance';
import { Link } from "react-router-dom";
import { useDeviceContext } from "./context/DeviceContect";
const Aerolamp = () => {
   const [devices, setDevices] = useState([]);
   const [macAddress, setMacAddress] = useState("");
   const [deviceName, setDeviceName] = useState("");
   const [toggleAddButton, setToggleAddButton] = useState(false);
   const { setDeviceId } = useDeviceContext(); 
   useEffect(() => {
      const fetchDevices = async () => {
         try {
            const response = await AxiosInstance.get("aerolamp/devices/");
            setDevices(response.data)
         }catch (error) {
            console.error("Error fetching devices:", error);
         }
      }
      fetchDevices();
   }, [])

   const registerDevice = async () => {
      if (!macAddress || !deviceName) {
         alert("Please enter both MAC address and device name.");
         return;
      }

      try {
         const response = await AxiosInstance.post("aerolamp/devices/register_device/", {
            mac_address: macAddress,
            device_name: deviceName,
         });

         alert("Device Registered Successfully!");
         setDevices([...devices, response.data]); // Add new device to the list
         setMacAddress("");
         setDeviceName("");
      } catch (error) {
         console.error("Error registering device:", error);
         alert("Failed to register device. Please try again.");
      }
   };
   return (
      <div className="bg1 flex items-center justify-center relative w-[100%] h-[100%]">
         <button onClick={() => {setToggleAddButton(true)}} className="font-inknut font-normal color text-[16px] px-[25px] h-[40px] rounded-[20px] bg-[#24549d] border-none shadow-ls absolute right-[50px] top-[70px] cursor-pointer hover:opacity-20 hover:border2 text">Add Device</button>
         <div className="grid grid-cols-3 grid-rows-2 w-[70%] h-[85%] gap-[30px] place-items-center mt-[80px] cursor-pointer aerolamp-device transition-all duration-300 ease-in-out">
            {
               devices.map((device) => (
                  <Link key={device.id} to={`/aerolamp/${device.id}`} onClick={() => setDeviceId(device.id)}   className="h-[100%] w-[85%] bg4 shadow-md flex flex-col items-center font-inknut font-normal color pt-[5%] aerolamp transition-all duration-300 ease-in-out hover:opacity-50">
                     <img className="w-[75%] h-[75%]" src="/images/aero.svg" alt="" />
                     <h3 className="text-[20px] w-[70%] border-b-[3px] border-b-[#E38E49] text-center">{device.device_name}</h3>
                     <p className="text-[16px] mt-[8px]">{device.mac_address}</p>
                  </Link>
               ))
            }
         </div>
         {
            toggleAddButton &&
            <div className="absolute w-[100%] h-[100%] z-10 top-0 bottom-0 left-0 right-0 bg-[#00000080] flex items-center justify-center font-inknut font-normal text-[20px]">
               <div className="w-[30%] h-[70%] flex flex-col items-center justify-center bg5 relative">
                  <img onClick={() => {setToggleAddButton(false)}} className="absolute top-[20px] right-[30px] h-[30px] w-[30px] cursor-pointer hover:opacity-50" src="/icons/cancel.png" alt="" />
                  <input
                     type="text"
                     placeholder="MAC Address"
                     value={macAddress}
                     onChange={(e) => setMacAddress(e.target.value)}
                     className="h-[30px] w-[60%] px-[10px]"
                  />
                  <input
                     type="text"
                     placeholder="Device Name"
                     value={deviceName}
                     onChange={(e) => setDeviceName(e.target.value)}
                     className="h-[30px] w-[60%] px-[10px] mt-[10px]"
                  />
                  <button
                     onClick={() => {
                        registerDevice();
                        setToggleAddButton(!toggleAddButton);
                     }}
                     className=" text-white px-4 py-2 rounded h-[30px] w-[40%] bg-[#24549d] color mt-[20px] button-intro cursor-pointer"
                  >
                     Connect ESP32
                  </button>
               </div>
         </div>
         }
      </div>
   )
}

export default Aerolamp