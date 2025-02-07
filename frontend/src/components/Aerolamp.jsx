import {useState, useEffect} from "react"
import AxiosInstance from './AxiosInstance';
import { Link } from "react-router-dom";
const Aerolamp = () => {
   const [devices, setDevices] = useState([]);

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
   return (
      <div className="bg1 flex items-center justify-center">
         <div className="grid grid-cols-3 grid-rows-2 w-[70%] h-[85%] gap-[30px] place-items-center mt-[40px] cursor-pointer">
            {
               devices.map((device) => (
                  <Link key={device.id} to={`/aerolamp/${device.id}`} className="h-[100%] w-[85%] bg4 shadow-md flex flex-col items-center font-inknut font-normal color pt-[5%]">
                     <img className="w-[75%] h-[75%]" src="../../public/images/aero.svg" alt="" />
                     <h3 className="text-[20px] w-[70%] border-b-[3px] border-b-[#E38E49] text-center">{device.device_name}</h3>
                     <p className="text-[16px] mt-[8px]">{device.mac_address}</p>
                  </Link>
               ))
            }
            
            
         
         </div>
      </div>
   )
}

export default Aerolamp