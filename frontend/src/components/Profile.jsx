import AxiosInstance from "./AxiosInstance";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import Loading from "./Ocomponents/Loading";
ChartJS.register(ArcElement, Tooltip, Legend);

const Profile = () => {
   const [user, setUser] = useState(null); // Default state is null
   const [lastData, setLastData] = useState(null);
   const navigate = useNavigate();

   const getAQIColor = (aqi) => {
      if (aqi >= 0 && aqi <= 50) return "#4CAF50"; // Green - Good
      if (aqi > 50 && aqi <= 100) return "#FFEB3B"; // Yellow - Moderate
      if (aqi > 100 && aqi <= 150) return "#FF9800"; // Orange - Unhealthy for Sensitive Groups
      if (aqi > 150 && aqi <= 200) return "#F44336"; // Red - Unhealthy
      if (aqi > 200 && aqi <= 300) return "#9C27B0"; // Purple - Very Unhealthy
      return "#7E0023"; // Maroon - Hazardous
   };

   const data = lastData
   ? {
      labels: ["Particulate Matter", "Ozone", "Carbon Monoxide", "Sulfur Dioxide", "Nitrogen Dioxide"],
      datasets: [
         {
            data: [
               lastData.pm || 0,
               lastData.o3 || 0,
               lastData.co || 0,
               lastData.so2 || 0,
               lastData.no2 || 0,
            ],
            backgroundColor: [
               getAQIColor(lastData.pm25),
               getAQIColor(lastData.o3),
               getAQIColor(lastData.co),
               getAQIColor(lastData.so2),
               getAQIColor(lastData.no2),
            ],
            hoverBackgroundColor: [
               getAQIColor(lastData.pm25),
               getAQIColor(lastData.o3),
               getAQIColor(lastData.co),
               getAQIColor(lastData.so2),
               getAQIColor(lastData.no2),
            ],
         },
      ],
   }
: {
      labels: ["Particulate Matter", "Ozone", "Carbon Monoxide", "Sulfur Dioxide", "Nitrogen Dioxide"],
      datasets: [
         {
            data: [0, 0, 0, 0, 0],
            backgroundColor: ["#ccc", "#ccc", "#ccc", "#ccc", "#ccc"],
         },
      ],
   };


   const options = {
      cutout: "50%", 
      plugins: {
         legend: {
            position: "right",
            labels: { color: "#666" },
         },
      },
   };

   const fetchUserProfile = async () => {
      try {
         const response = await AxiosInstance.get(`users/profile/`); 
         console.log("User Profile:", response.data);
         setUser(response.data); 
      } catch (error) {
         console.error("Error fetching user profile", error);
         alert("Session expired, please log in again.");
         localStorage.removeItem("Token"); 
         navigate("/login"); 
      }
   };


   useEffect(() => {
      fetchUserProfile();
   }, []);

   useEffect(() => {
      const fetchLastData = async () => {
         try{
            const response = await AxiosInstance.get(`aerolamp/devices/1/air-quality/`)
            if (response.data && response.data.length > 0){
               setLastData(response.data[response.data.length - 1])
            }
         } catch (error) {
            console.error("Error fetching device data:", error);
         }
         
      }
      fetchLastData()
   }, [])


   if (!user) {
      return <Loading/>
   }

   return (
      <div className="bg1 w-auto h-auto flex flex-col items-center justify-start profile-box">
         <div className="flex flex-row justify-start items-center w-[70%] mt-[80px] profile-title">
            <img className="roundedProfile edit-profile" src={user.profile_image ? `http://localhost:8000${user.profile_image}` : '../../public/images/default.jpg'} alt="profile" />
            <div className="flex flex-col justify-start items-center ml-[20px] mb-[30px] font-inknut font-normal profile-text">
               <h3 className="font-[25px] text1">Profile Information</h3>
               <p className="font-[20px] text">Manage your personal details</p>
            </div>
         </div>
         <div className="grid grid-cols-4 gap-[50px] w-[80%] mt-[30px] font-inknut font-normal mb-[20px] ml-[70px] items-center profile-info-box">
            <p className="border3 bg-[#D4EBF8] py-[10px] pl-[5px] pr-[100px] font-[20px] profile-info">
               {user ? user.first_name : null} {user ? user.last_name : null}
            </p>
            <p className="border3 bg-[#D4EBF8] py-[10px] pl-[5px] pr-[100px] font-[20px]">
               {user ? user.email : null}
            </p>
            <p className="border3 bg-[#D4EBF8] py-[10px] pl-[5px] pr-[100px] font-[20px]">
               {user ? user.phone_number : null}
            </p>
            <button
               onClick={() => navigate('/editprofile')}
               className="bg-[#0A3981] cursor-pointer color px-[40px] py-[12px] font-[20px] border3"
            >
               Edit Profile
            </button>
         </div>
         <div className="w-[70%] h-[40%] mt-[1%] flex flex-row items-center justify-center profile-graph">
            <div className="w-[50%] h-[100%] flex flex-col doughnut-container ">
               <h3 className="font-inknut font-normal color text-[20px] mb-4 profile-graph-text">Air Quality Index Overview</h3>
               <div className="w-[350px] h-[350px] mt-[-40px] ml-[40px]">
                  <Doughnut data={data} options={options} />
               </div>
            </div>
            <div className="AQI flex flex-col items-center justify-center w-[35%]">
               <h3 className="text-lg font-semibold mb-[10%] mt-[-65px]">AQI Categories</h3>
               <div className="overflow-x-auto w-[100%] ml-6">
                  <table className="table-auto w-full border-collapse border border-gray-300">
                     <thead>
                        <tr>
                           <th className="text-center px-4 py-2 font-semibold border-b border-gray-400">AQI Values</th>
                           <th className="text-center px-4 py-2 font-semibold border-b border-gray-400">Health Concern</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr>
                           <td className="p-2 text-center font-medium bg2 rounded-md">0-50</td>
                           <td className="p-2 text-center font-medium bg2 rounded-md">Good</td>
                        </tr>
                        <tr>
                           <td className="p-2 text-center font-medium bg-[#F6E05E] rounded-md">51-100</td>
                           <td className="p-2 text-center font-medium bg-[#F6E05E] rounded-md">Moderate</td>
                        </tr>
                        <tr>
                           <td className="p-2 text-center font-medium bg-[#F6E05E] rounded-md">100-150</td>
                           <td className="p-2 text-center font-medium bg-[#F6E05E] rounded-md">Unhealthy for Sensitive Groups</td>
                        </tr>
                        <tr>
                           <td className="p-2 text-center font-medium bg-[#F56565] rounded-md">151-200</td>
                           <td className="p-2 text-center font-medium bg-[#F56565] rounded-md">Unhealthy</td>
                        </tr>
                        <tr>
                           <td className="p-2 text-center font-medium bg-[#E53E3E] rounded-md">201-300</td>
                           <td className="p-2 text-center font-medium bg-[#E53E3E] rounded-md">Very Unhealthy</td>
                        </tr>
                        <tr>
                           <td className="p-2 text-center font-medium bg-[#9B2C2C] rounded-md">301-500</td>
                           <td className="p-2 text-center font-medium bg-[#9B2C2C] rounded-md">Hazardous</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Profile;