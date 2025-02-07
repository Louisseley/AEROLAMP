import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AxiosInstance from "./AxiosInstance"; // Your Axios instance
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import Loading from "./Ocomponents/Loading";
import { Link } from "react-router-dom";
// Registering chart.js components
ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend
);

const AerolampModel = () => {
   const { deviceId } = useParams(); // Get the deviceId from the URL
   const [deviceData, setDeviceData] = useState([]);
   
   useEffect(() => {
      const fetchDeviceData = async () => {
         try {
            const response = await AxiosInstance.get(`aerolamp/devices/${deviceId}/air-quality/`); // Adjust API endpoint to include data in the last 24 hours
            console.log("API Response:", response.data); 
            setDeviceData(response.data);
         } catch (error) {
            console.error("Error fetching device data:", error);
         }
      };
      fetchDeviceData();
   }, [deviceId]); // Re-fetch data if the device ID changes

   // Define hours for x-axis (1 to 24)
   const hours = Array.from({ length: 24 }, (_, index) => index + 1);

   // Transform the data to hourly values for the graph
   const chartData = {
      labels: hours, // Using static hours for x-axis labels
      datasets: [
         {
            label: "PM2.5 (µg/m³)",
            data: Array.isArray(deviceData) ? deviceData.map((entry) => entry.pm) : [],
            fill: false,
            borderColor: "#FFA500",
            tension: 0.1
         },
         {
            label: "CO (ppm)",
            data: Array.isArray(deviceData) ? deviceData.map((entry) => entry.co) : [],
            fill: false,
            borderColor: "#FF6347",
            tension: 0.1
         },
         {
            label: "Ozone (µg/m³)",
            data: Array.isArray(deviceData) ? deviceData.map((entry) => entry.ozone) : [],
            fill: false,
            borderColor: "#4682B4",
            tension: 0.1
         },
         {
            label: "SO2 (ppm)",
            data: Array.isArray(deviceData) ? deviceData.map((entry) => entry.so2) : [],
            fill: false,
            borderColor: "#32CD32",
            tension: 0.1
         },
         {
            label: "NO2 (ppm)",
            data: Array.isArray(deviceData) ? deviceData.map((entry) => entry.no2) : [],
            fill: false,
            borderColor: "#D2691E",
            tension: 0.1
         }
      ]
   };

   const options = {
      responsive: true,
      plugins: {
         legend: {
            position: "top",
            labels: {
               color: "black",
            }
         },
         title: {
            display: true,
            text: "Pollutant Levels",
            color: "black",
            font: {
               size: 18
            }
         }
      },
      scales: {
         x: {
            title: {
               display: true,
               text: "Hour",
               color: "black"
            },
            ticks: {
               color: "black"
            }
         },
         y: {
            title: {
               display: true,
               text: "Units",
               color: "black"
            },
            ticks: {
               color: "black"
            },
            min: 0,
            max: 500
         }
      }
   };

   if (!deviceData || deviceData.length === 0) {
      return <Loading />;
   }

   return (
      <div className="bg1 flex flex-col items-center justify-start font-inknut pt-[8%]">
         <h3 className="bg-[#D4EBF8] w-[200px] h-[35px] text-[28px] text-center mb-4">Aerolamp {deviceData.device_name}</h3>
         <div className="flex flex-col w-full">
            <div className="flex flex-row w-full h-[70vh]">
               <div className="w-[50%] h-full flex items-center justify-center">
                  <Line data={chartData} options={options} />
               </div>
               <div className="w-[50%] flex-col h-full flex items-center justify-center">
                  <h3 className='text-[20px] bg-[#D4EBF8] px-[40px] py-[10px] text-center'>January 01, 2025 <br /> 12:00 n.n.</h3>
                  <h3 className='text-[20px] bg-[#D4EBF8] w-[150px] py-[10px] text-center mt-[2%]'>Data Result</h3>
                  <div className='flex flex-row items-center justify-between w-[70%] h-[50px] mt-[5%]'>
                     <h3 className="text-[20px] bg-[#F3BA52A6] w-[30%] h-[40px] flex items-center justify-center">138</h3>
                     <h3 className="text-[20px] bg-[#F3BA52A6] w-[65%] h-[40px] flex items-center justify-center">Unhealthy for Sensitive Groups</h3>
                  </div>
                  <Link key={deviceId} to={`/aerolamp/history/${deviceId}`} className="text-[20px] bg-[#24549D] w-[35%] h-[40px] flex items-center justify-center rounded mt-[5%] hover:opacity-30 cursor-pointer no-underline color">Data History</Link>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AerolampModel;

