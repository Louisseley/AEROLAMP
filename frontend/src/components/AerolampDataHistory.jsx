import { useState, useEffect } from "react";
import AxiosInstance from "./AxiosInstance"; // Your Axios instance
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import Loading from "./Ocomponents/Loading";
import { useParams } from "react-router-dom";
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

const AerolampDataHistory = () => {
   const { deviceId } = useParams();
   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
   const [monthlyData, setMonthlyData] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await AxiosInstance.get(`aerolamp/devices/${deviceId}/air-quality-history/`, {
               params: { year: selectedYear } // Pass the selected year as a query parameter
            });
            console.log("API Response:", response.data);
            setMonthlyData(response.data);
         } catch (error) {
            console.error("Error fetching data:", error);
         }
      };
      fetchData();
   }, [deviceId, selectedYear]); // Refetch when deviceId or selectedYear changes

   // Process the data for the graph
   const chartData = {
      labels: [
         "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
      ],
      datasets: [
         {
            label: "PM2.5 (µg/m³)",
            data: monthlyData.map((entry) => entry.pm || 0),
            borderColor: "#FFA500",
            fill: false,
            tension: 0.1
         },
         {
            label: "CO (ppm)",
            data: monthlyData.map((entry) => entry.co || 0),
            borderColor: "#FF6347",
            fill: false,
            tension: 0.1
         },
         {
            label: "Ozone (µg/m³)",
            data: monthlyData.map((entry) => entry.ozone || 0),
            borderColor: "#4682B4",
            fill: false,
            tension: 0.1
         },
         {
            label: "SO2 (ppm)",
            data: monthlyData.map((entry) => entry.so2 || 0),
            borderColor: "#32CD32",
            fill: false,
            tension: 0.1
         },
         {
            label: "NO2 (ppm)",
            data: monthlyData.map((entry) => entry.no2 || 0),
            borderColor: "#D2691E",
            fill: false,
            tension: 0.1
         }
      ]
   };

   const options = {
      responsive: true,
      plugins: {
         legend: {
            position: "top",
            labels: { color: "black" }
         },
         title: {
            display: true,
            text: `Pollutant Levels in ${selectedYear}`,
            color: "black",
            font: { size: 18 }
         }
      },
      scales: {
         x: {
            title: { display: true, text: "Month", color: "black" },
            ticks: { color: "black" }
         },
         y: {
            title: { display: true, text: "Units", color: "black" },
            ticks: { color: "black" },
            min: 0,
            max: 500
         }
      }
   };

   if (!monthlyData || monthlyData.length === 0) {
      return <Loading />;
   }

   return (
      <div className="bg1 flex flex-col items-start font-inknut font-normal w-full h-full">
         <h3 className="text-[28px] bg-[#D4EBF8] px-[25px] py-[5px] ml-[160px] mt-[80px]">Data History</h3>
         <div className="flex flex-col w-full h-[80vh]">
            {/* Dropdown for Year Selection */}
            <div className="w-[55%] h-[20%] flex flex-row items-center justify-between">
            <div className="relative w-[120px] ml-[200px]"> {/* Increased width */}
               <img 
                  className="absolute right-[10px] top-[50%] transform -translate-y-1/2 w-[20px] h-[20px] cursor-pointer"
                  src="../../public/icons/dropdown.svg"
                  alt="Dropdown"
               />
               <select
                  className="appearance-none color bg-[#003366] text-[22px] w-full py-[5px] pl-[20px] pr-[40px] cursor-pointer border-none"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)} // Update selected year
               >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                     <option key={year} value={year}>{year}</option>
                  ))}
               </select>
            </div>
               <h3 className="bg-[#D4EBF8] text-[18px] px-[20px] py-[5px] ml-[5%]">Pollutant Data</h3>
            </div>

            {/* Graph Display */}
            <div className="flex justify-center items-center w-full h-full">
               <div className="chart-container ml-[290px] mt-[-80px]" style={{ width: "90%", height: "350px" }}>
                  <Line data={chartData} options={options} />
               </div>
            </div>
         </div>
      </div>
   );
};

export default AerolampDataHistory;
