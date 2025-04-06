import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AxiosInstance from "./AxiosInstance"; // Your Axios instance
import Esp from "./Esp";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import Loading from "./Ocomponents/Loading";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
   const [dailyData, setDailyData] = useState([]);
   const [prevDate, setPrevDate] = useState(null);
   const [nextDate, setNextDate] = useState(null);
   const [currentDate, setCurrentDate] = useState(null);
   const [table, setTable] = useState(false);
   const [lastData, setLastData] = useState(null); // To store the latest data
   const [relayStatus, setRelayStatus] = useState("OFF");
   const navigate = useNavigate();

   useEffect(() => {
      const fetchDeviceData = async () => {
         try {
            const response = await AxiosInstance.get(`aerolamp/devices/${deviceId}/air-quality/hourly-average/`);
            console.log("API Response:", response.data);
            setDeviceData(response.data);
            if (response.data && response.data.length > 0) {
               setLastData(response.data[response.data.length - 1]);
            }
         } catch (error) {
            console.error("Error fetching device data:", error);
         }
      };
      fetchDeviceData();
   }, [deviceId]);

   useEffect(() => {
      if (!deviceData || deviceData.length === 0) {
         const timer = setTimeout(() => {
            navigate("/aerolamp");
         }, 5000);
         return () => clearTimeout(timer);
      }
   }, [deviceData, navigate]);

   const fetchDailyData = async (dateParam = "") => {
      try {
         let url = `aerolamp/devices/${deviceId}/air-quality-daily-history/`;
         if (dateParam) {
            url += `?date=${dateParam}`;
         }
         const response = await AxiosInstance.get(url);
         setCurrentDate(response.data.date);
         setDailyData(response.data.data);     // Set data for the current date
         setPrevDate(response.data.previous);  // Set previous date for pagination
         setNextDate(response.data.next);      // Set next date for pagination
      } catch (error) {
         console.error("Error fetching daily data:", error);
      }
   };

   useEffect(() => {
      fetchDailyData();
   }, [deviceId]);


   useEffect(() => {
      fetchRelayStatus();
   }, []);

   const fetchRelayStatus = async () => {
      try {
         const response = await AxiosInstance.get(`appcontrol/device/${deviceId}/relay-status/`);
         setRelayStatus(response.data.relay_status);
      } catch (error) {
         console.error("Error fetching relay status", error);
      }
   };

   const toggleRelay = async () => {
      const newStatus = relayStatus === "ON" ? "OFF" : "ON";
      try {
         await AxiosInstance.post(`appcontrol/device/${deviceId}/set-relay/`, { device_id: `${deviceId}`, relay_status: newStatus });
         setRelayStatus(newStatus);
      } catch (error) {
         console.error("Error updating relay", error);
      }
   };

   const toggleRelay1 = async () => {
      try {
         await Esp.post(`appcontrol/device/${deviceId}/set-relay/`);
      } catch (error) {
         console.error("Error updating relay", error);
      }
   };

   // Format the hour with local time conversion
   const formatTimestamp = (hour) => {
      const date = new Date();
      date.setUTCHours(hour, 0, 0, 0); // Assuming backend sends UTC time
      // Convert to local time
      const localDate = new Date(date.toLocaleString()); // Convert to local timezone
      const options = {
         year: 'numeric',
         month: 'long',
         day: 'numeric',
         hour: 'numeric',
         minute: 'numeric',
         second: 'numeric',
         hour12: true
      };
      return new Intl.DateTimeFormat('en-US', options).format(localDate);
   };

   const formatTimestamp1 = (hour) => {
      const date = new Date();
      date.setUTCHours(hour, 0, 0, 0); // Assuming backend sends UTC time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
   };

   const formatTimestamp3 = (hour) => {
      const date = new Date();
      date.setUTCHours(hour, 0, 0, 0);
      const options = {
         hour: '2-digit',
         minute: '2-digit',
         second: '2-digit',
         hour12: true
      };
      return new Intl.DateTimeFormat('en-US', options).format(date);
   };

   // Format the full timestamp as "MM/DD/YYYY, HH:mm:ss AM/PM"
   const formatTimestamp2 = (timestamp) => {
      const dateObj = new Date(timestamp);
      const options = {
         hour: '2-digit',
         minute: '2-digit',
         second: '2-digit',
         hour12: true
      };
      return new Intl.DateTimeFormat('en-US', options).format(dateObj);
   };

   const formatTimestamp4 = (timestamp) => {
      const dateObj = new Date(timestamp);
      const options = {
         year: 'numeric',
         month: 'long',
         day: 'numeric',
         hour: 'numeric',
         minute: 'numeric',
         second: 'numeric',
         hour12: true
      };
      return new Intl.DateTimeFormat('en-US', options).format(dateObj);
   };

   

   const hour = deviceData.map(entry => formatTimestamp1(entry.hour));

   const chartData = {
      labels: hour,
      datasets: [
         {
            label: "PM2.5 (µg/m³)",
            data: deviceData.map(entry => entry.pm25), // Using 'pm25' instead of 'pm'
            fill: false,
            borderColor: "#FFA500",
            tension: 0.1
         },
         {
            label: "PM10 (µg/m³)",
            data: deviceData.map(entry => entry.pm10), // Using 'pm10'
            fill: false,
            borderColor: "#FF6347",
            tension: 0.1
         },
         {
            label: "CO (ppb)",
            data: deviceData.map(entry => entry.co),
            fill: false,
            borderColor: "#FF6347",
            tension: 0.1
         },
         {
            label: "Ozone (ppb)",
            data: deviceData.map(entry => entry.ozone),
            fill: false,
            borderColor: "#4682B4",
            tension: 0.1
         },
         {
            label: "SO2 (ppb)",
            data: deviceData.map(entry => entry.so2),
            fill: false,
            borderColor: "#32CD32",
            tension: 0.1
         },
         {
            label: "NO2 (ppb)",
            data: deviceData.map(entry => entry.no2),
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

   const getAqiStatus = (aqi) => {
      if (aqi <= 50) return "Good";
      if (aqi <= 100) return "Moderate";
      if (aqi <= 150) return "Unhealthy for Sensitive Groups";
      if (aqi <= 200) return "Unhealthy";
      if (aqi <= 300) return "Very Unhealthy";
      return "Hazardous";
   };

   if (!deviceData || deviceData.length === 0) {
      return <Loading />;
   }

   const lastDataTimestamp = lastData ? formatTimestamp(lastData.hour) : "";
   const lastDataAqi = lastData ? lastData.avg_aqi : null; // Use avg_aqi instead of aqi
   const lastDataAqiStatus = lastDataAqi ? getAqiStatus(lastDataAqi) : "";

   return (
      <div className="bg1 flex flex-col items-center justify-start font-inknut pt-[6.5%] aerolamp-data-container overflow-hidden relative">
         <h3 className="bg-[#D4EBF8] w-[200px] h-[35px] text-[28px] text-center mb-4 text2">Aerolamp {deviceData.device_name}</h3>
         <div className="flex flex-col w-full sm:w-[90%]"> {/* Adjusted for responsiveness */}
            <div className="flex flex-row w-full h-auto sm:h-[50vh] aerolamp-data-graph-container">
               {table == false &&
                  <div className="w-full sm:w-[80%] h-full flex items-center justify-center mt-[20px] mr-[-40px]">
                     <Line data={chartData} options={options} height={200} />
                  </div>
               }
               {table &&
                  <div className="w-full sm:w-[80%] h-[72vh] flex items-start justify-start white overflow-y-auto mt-[20px] mr-[-20px] table1">
                     <table className="table-auto w-auto border-collapse border border-gray-400 table-col">
                        <thead className="w-[100px] border h-[30px]">  
                           <tr>
                              <th className="border border-gray-300 px-4 py-2">Hour</th>
                              <th className="border border-gray-300 px-4 py-2">PM2.5 (µg/m³)</th>
                              <th className="border border-gray-300 px-4 py-2">PM10 (µg/m³)</th>
                              <th className="border border-gray-300 px-4 py-2">CO (ppb)</th>
                              <th className="border border-gray-300 px-4 py-2">Ozone (ppb)</th>
                              <th className="border border-gray-300 px-4 py-2">SO2 (ppb)</th>
                              <th className="border border-gray-300 px-4 py-2">NO2 (ppb)</th>
                           </tr>
                        </thead>
                        <tbody>
                           {dailyData.map((entry, index) => (
                              <tr key={index} className="h-[25px]">
                                 <td className="border border-gray-300 px-4 py-2">
                                    {entry.hour ? formatTimestamp3(entry.hour) : formatTimestamp2(entry.timestamp)}
                                 </td>
                                 <td className="border border-gray-300 px-4 py-2">{entry.pm25}</td>
                                 <td className="border border-gray-300 px-4 py-2">{entry.pm10}</td>
                                 <td className="border border-gray-300 px-4 py-2">{entry.co}</td>
                                 <td className="border border-gray-300 px-4 py-2">{entry.ozone}</td>
                                 <td className="border border-gray-300 px-4 py-2">{entry.so2}</td>
                                 <td className="border border-gray-300 px-4 py-2">{entry.no2}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                     <div className="pagination ">
                        {prevDate && (
                           <button
                              className="px-4 py-2 bg-gray-300"
                              onClick={() => fetchDailyData(prevDate)}  
                           >
                              &lt;
                           </button>
                        )}
                        <h1>{currentDate}</h1>
                        {nextDate && (
                           <button
                              className="px-4 py-2 bg-gray-300"
                              onClick={() => fetchDailyData(nextDate)} 
                           >
                              &gt;
                           </button>
                        )}
                     </div>
                  </div>
               }
               <div className="w-full sm:w-[100%] flex-col h-full flex items-center justify-center mt-[5%] aerolamp-data-text-container pr-[30px]">
                  <h3 className="text-[20px] bg-[#D4EBF8] px-[40px] py-[10px] text-center">{lastDataTimestamp}</h3>
                  <h3 className="text-[20px] bg-[#D4EBF8] w-[150px] py-[10px] text-center mt-[2%] text1">Data Result</h3>
                  <div className="flex flex-row items-center justify-between w-[70%] h-[50px] mt-[5%] aerolamp-text-below">
                     <h3 className="text-[20px] bg-[#F3BA52A6] w-[30%] h-[40px] flex items-center justify-center">{lastDataAqi}</h3>
                     <h3 className="text-[20px] bg-[#F3BA52A6] w-[65%] h-[40px] flex items-center justify-center text">{lastDataAqiStatus}</h3>
                  </div>
                  <button
                     className="w-[25%] h-[40px] flex flex-row justify-center items-center font-inknut font-normal text-[16px] cursor-pointer mt-[2%] aerolamp-but"
                     style={{ backgroundColor: relayStatus === "ON" ? "#4CAF50" : "#F44336" }}
                     onClick={async () => {
                        await toggleRelay(); 
                        await toggleRelay1();
                        fetchRelayStatus();  // Fetch and update relay status
                     }}
                  >
                     <img className="w-[30px] h-[30px]" src="../../public/icons/light.png" alt="" />
                     {relayStatus === "ON" ? "Turn OFF" : "Turn ON"}
                  </button>

                  <Link
                     key={deviceId}
                     to={`/aerolamp/history/${deviceId}`}
                     className="text-[20px] bg-[#24549D] w-[35%] h-[40px] flex items-center justify-center rounded mt-[2%] hover:opacity-30 cursor-pointer no-underline color aerolamp-but"
                  >
                     Data History
                  </Link>
               </div>
            </div>
         </div>
         <button className="table-but" onClick={() => {setTable(!table)}}>{table ? "Graph" : "Table"}</button>
      </div>
   );
};

export default AerolampModel;
