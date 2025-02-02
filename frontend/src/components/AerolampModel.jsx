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
   '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'
   ], // Time in hours
   datasets: [
   {
      label: 'µg/m³',
      data: [85, 45, 60, 50, 30, 55, 40, 70, 75, 60, 85, 90, 65, 45, 55, 40, 60, 70, 75, 65, 80, 85, 95, 100], // The data points
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
   title: {
      display: true,
      text: 'Particulate Matter',
      color: 'black', // Set title color to black
      font: {
         size: 18,
      },
   },
   },
   scales: {
   x: {
      title: {
         display: true,
         text: 'Time (every hour)',
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
   <div className="chart-container" style={{ width: '90%', height: '300px', background: 'transparent', color: 'black' }}>
   <Line data={data} options={options} />
   </div>
);
};

// Main AerolampModel Component
const AerolampModel = () => {
return (
   <div className="bg1 flex flex-col items-center justify-start font-inknut font-normal">
   <h3 className="bg-[#D4EBF8] w-[200px] h-[35px] text-[28px] text-center mb-4">Aerolamp 1</h3>
   <div className="flex flex-col w-full">
      <div className="flex flex-row w-full h-[70vh]">
         <div className=" w-[50%] h-full flex items-center justify-center">
            <MyChart /> 
         </div>
         <div className=" w-[50%] flex-col h-full flex items-center justify-center">
            <h3 className='text-[20px] bg-[#D4EBF8] px-[40px] py-[10px] text-center'>January 01, 2025 <br /> 12:00 n.n.</h3>
            <h3 className='text-[20px] bg-[#D4EBF8] w-[150px] py-[10px] text-center mt-[2%]'>Data Result</h3>
            <div className='flex flex-row items-center justify-between w-[70%] h-[50px] mt-[5%]'>
               <h3 className="text-[20px] bg-[#F3BA52A6] w-[30%] h-[40px] flex items-center justify-center">138</h3>
               <h3 className="text-[20px] bg-[#F3BA52A6] w-[65%] h-[40px] flex items-center justify-center">Unhealthy for Sensitive Groups</h3>
            </div>
            <button className="text-[20px] bg-[#24549D] w-[35%] h-[40px] flex items-center justify-center round mt-[5%] hover:opacity-30 cursor-pointer">Data History</button>
         </div>
      </div>
   </div>
   </div>
);
}

export default AerolampModel;
