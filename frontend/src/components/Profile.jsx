import AxiosInstance from "./AxiosInstance";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Ocomponents/Loading";
import { useDeviceContext } from "./context/DeviceContect";
const Profile = () => {
   const { deviceId } = useDeviceContext();
   const [user, setUser] = useState(null); // Default state is null
   const [lastData, setLastData] = useState(null);
   const navigate = useNavigate();


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
      if (deviceId) {
         const fetchLastData = async () => {
            try {
               const response = await AxiosInstance.get(`aerolamp/devices/${deviceId}/air-quality/`);
               if (response.data && response.data.length > 0) {
                  setLastData(response.data[response.data.length - 1]);
               }
            } catch (error) {
               console.error("Error fetching device data:", error);
            }
         };
         fetchLastData();
      }
   }, [deviceId]);

   if (!user) {
      return <Loading />;
   }

   return (
      <div className="bg1 w-auto h-auto flex flex-col items-center justify-start profile-box">
         <div className="flex flex-row justify-start items-center w-[70%] mt-[80px] profile-title">
            <img
               className="roundedProfile edit-profile"
               src={user.profile_image ? `http://localhost:8000${user.profile_image}` : "../../public/images/default.jpg"}
               alt="profile"
            />
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
               className="bg-[#0A3981] cursor-pointer color px-[40px] py-[12px] font-[20px] border3 hover:text-[#2432f0] hover:bg-transparent hover:border-[#2432f0] hover:font-bold"
            >
               Edit Profile
            </button>
         </div>
         <div className="w-[70%] h-[40%] mt-[1%] flex flex-col items-center justify-center profile-graph">
            <div className="flex flex-row items-center justify-between w-[1000px] h-[15vh] mt-[20px] aqi-box">
               <div className="flex flex-row items-center h-[10vh] w-[300px] bg-[#D4EBF8] rounded-[5px] border-[2px] border-[#0A3981]">
                  <img className="h-[50px] w-[50px] p-2 ml-[5px]" src="/icons/pm10.svg" alt="" />
                  <h3 className="ml-[5px] w-[150px]">Particulate Matter <br /> (PM2.5)</h3>
                  <h3 className="ml-[30px] link value">{lastData ? lastData.pm25 : "No Data"} <br /> {lastData ? <span>&micro;g/m&sup3;</span> : null}</h3>
               </div>
               <div className="flex flex-row items-center h-[10vh] w-[300px] bg-[#D4EBF8] rounded-[5px] border-[2px] border-[#0A3981]">
                  <img className="h-[70px] w-[70px] p-2 ml-[5px]" src="/icons/co.svg" alt="" />
                  <h3 className="w-[150px]">Carbon Monoxide <br /> (CO)</h3>
                  <h3 className="ml-[30px] link value">{lastData ? lastData.co : "No Data"} <br /> {lastData ? "ppb" : null}</h3>
               </div>
               <div className="flex flex-row items-center h-[10vh] w-[300px] bg-[#D4EBF8] rounded-[5px] border-[2px] border-[#0A3981]">
                  <img className="h-[50px] w-[50px] p-2 ml-[5px]" src="/icons/no2.svg" alt="" />
                  <h3 className="ml-[5px]  w-[160px]">Nitrogen Dioxide <br /> (NO2)</h3>
                  <h3 className="ml-[30px] link value">{lastData ? lastData.no2 : "No Data"} <br /> {lastData ? "ppb" : null}</h3>
               </div>
            </div>
            <div className="flex flex-row items-center justify-between w-[1000px] h-[15vh] mt-[30px] aqi-box">
               <div className="flex flex-row items-center h-[10vh] w-[300px] bg-[#D4EBF8] rounded-[5px] border-[2px] border-[#0A3981]">
                  <img className="h-[50px] w-[50px] p-2 ml-[5px]" src="/icons/pm10.svg" alt="" />
                  <h3 className="ml-[5px] w-[150px]">Particulate Matter <br /> (PM10)</h3>
                  <h3 className="ml-[30px] link value">{lastData ? lastData.pm10 : "No Data"} <br /> {lastData ? <span>&micro;g/m&sup3;</span> : null}</h3>
               </div>
               <div className="flex flex-row items-center h-[10vh] w-[300px] bg-[#D4EBF8] rounded-[5px] border-[2px] border-[#0A3981]">
                  <img className="h-[70px] w-[70px] p-2 ml-[5px]" src="/icons/so.svg" alt="" />
                  <h3 className="w-[150px]">Sulfur Dioxide <br /> (SO2)</h3>
                  <h3 className="ml-[30px] link value">{lastData ? lastData.so2 : "No Data"} <br /> {lastData ? "ppb" : null}</h3>
               </div>
               <div className="flex flex-row items-center h-[10vh] w-[300px] bg-[#D4EBF8] rounded-[5px] border-[2px] border-[#0A3981]">
                  <img className="h-[50px] w-[50px] p-2 ml-[10px]" src="/icons/o3.svg" alt="" />
                  <h3 className="ml-[10px]  w-[150px]">Ozone <br /> (O3)</h3>
                  <h3 className="ml-[30px] link value">{lastData ? lastData.ozone : "No Data"} <br /> {lastData ? "ppb" : null}</h3>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Profile;
