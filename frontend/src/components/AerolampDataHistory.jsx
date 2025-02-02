import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

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

// Chart component
const MyChart = () => {
// Data for the chart
   const data = {
      labels: [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
      ], // Time in hours
      datasets: [
      {
         label: 'µg/m³',
         data: [85, 45, 60, 50, 30, 55, 40, 70, 75, 60, 85, 90], // The data points
         fill: false,
         borderColor: '#FFA500', // Orange color for the line
         tension: 0.1
      }
      ]
   };

   // Options for customizing the chart (e.g., background, title, and text color)
   const options = {
      responsive: true,
      plugins: {
      legend: {
         position: 'top',
         labels: {
            color: 'black', // Set legend text color to black
         },
      },
      },
      scales: {
      x: {
         title: {
            display: true,
            text: 'Month',
            color: 'black', // Set x-axis label color to black
         },
         ticks: {
            color: 'black', // Set x-axis tick labels color to black
         },
      },
      y: {
         title: {
            display: true,
            text: 'µg/m³',
            color: 'black', // Set y-axis label color to black
         },
         ticks: {
            color: 'black', // Set y-axis tick labels color to black
         },
         min: 0,
         max: 100,
      }
      }
   };

   return (
      <div className="chart-container ml-[290px] mt-[-80px]" style={{ width: '90%', height: '350px', background: 'transparent', color: 'black'}}>
      <Line data={data} options={options} />
      </div>
   );
};



const AerolampDataHistory = () => {
   return (
      <div className="bg1 flex flex-col items-start font-inknut font-normal w-[100%] h-[100%]">
         <h3 className="text-[28px] round bg-[#D4EBF8] px-[25px] py-[5px] ml-[160px] mt-[80px]">Data History</h3>
         <div className="flex flex-col w-[100%] h-[80vh]">
            <div className="w-[55%] h-[20%] flex flex-row items-center justify-between">
               <button className="bg-[#003366] text-[22px] w-[140px] py-[5px] color relative ml-[5%]">2025 <img className="absolute right-[10px] top-[8px] w-[20px] h-[20px] cursor-pointer" src="../../public/icons/dropdown.svg" alt="" /></button>
               <h3 className="bg-[#D4EBF8] text-[18px] px-[20px] py-[5px] ml-[5%]">Particulate Matter</h3>
            </div>
            <div className='flex justify-center items-center w-[100%] h-full'>
               <MyChart />
            </div>
         </div>
      </div>
   )
}

export default AerolampDataHistory