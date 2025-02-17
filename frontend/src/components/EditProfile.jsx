import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "./Ocomponents/Loading";
import AxiosInstance from "./AxiosInstance";

const EditProfile = () => {
   const navigate = useNavigate();
   const [user, setUser] = useState(null);
   const [updatedUser, setUpdatedUser] = useState({
      email: "",
      first_name: "",
      last_name: "",
      phone_number: ""
   });
   const [profileImage, setProfileImage] = useState(null);

   const fetchUserProfile = async () => {
      try {
         const response = await AxiosInstance.get("users/profile/");
         console.log("User Profile:", response.data);
         setUser(response.data);
         setUpdatedUser({
            email: response.data.email,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            phone_number: response.data.phone_number
         });
      } catch (error) {
         console.error("Error fetching user profile", error);
         alert("Session expired, please log in again.");
         localStorage.removeItem("Token"); 
         navigate("/login"); 
      }
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setUpdatedUser((prevState) => ({
         ...prevState,
         [name]: value
      }));
   };

   const handleImageChange = (e) => {
      setProfileImage(e.target.files[0]);
   };

   const handleUpdateProfile = async () => {
      try {
         const formData = new FormData();
         formData.append("email", updatedUser.email);
         formData.append("first_name", updatedUser.first_name);
         formData.append("last_name", updatedUser.last_name);
         formData.append("phone_number", updatedUser.phone_number);
   
         if (profileImage) {
            formData.append("profile_image", profileImage);
         }
   
         const response = await AxiosInstance.patch("users/profile/", formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });
   
         console.log("Updated Profile:", response.data);
         setUser(response.data);
         alert("Profile updated successfully!");
         navigate("/profile");
      } catch (error) {
         console.error("Error updating profile", error);
         alert("Failed to update profile.");
      }
   };
   
   useEffect(() => {
      fetchUserProfile();
   }, []);

   if (!user) {
      return <Loading />;
   }

   return (
      <>
         <div onClick={() => { navigate('/profile'); }} className="w-[200px] h-[50px] cursor-pointer fixed left-[20px] top-[70px] z-10 flex flex-row items-center edit-profile-back">
            <img className="w-[30px] h-[30px] edit-profile-img" src="../../public/icons/back.png" alt="" />
            <h3 className="text-[22px] ml-[10px]  ">Back</h3>
         </div>
         <div className="bg1 relative flex flex-col items-center justify-start w-[100%] h-[100%] font-inknut font-normal">
            <div className="flex flex-row items-center justify-center mt-[8%] edit-profile-box">
               <img className="roundedProfile edit-profile" src={user.profile_image ? `http://localhost:8000${user.profile_image}` : '../../public/images/default.jpg'} alt="Profile" />
               <h3 className="text-[20px] ml-[20px] edit-profile-text">Edit Profile Picture</h3>
            </div>
            <input  className={`mt-[20px] ml-[60px] text-[16px] px-[10px] py-[5px] text ${profileImage  ? 'text-[#FF0000]' : 'text-[#00001a]' }`} type="file" onChange={handleImageChange} />
            <input className="w-[20%] px-[10px] py-[5px] mt-[30px] edit-profile-input" value={updatedUser.email} name="email" onChange={handleInputChange} type="email" placeholder="Email" />
            <input className="w-[20%] px-[10px] py-[5px] mt-[20px] edit-profile-input" value={updatedUser.first_name} name="first_name" onChange={handleInputChange} type="text" placeholder="First Name" />
            <input className="w-[20%] px-[10px] py-[5px] mt-[20px] edit-profile-input" value={updatedUser.last_name} name="last_name" onChange={handleInputChange} type="text" placeholder="Last Name" />
            <input className="w-[20%] px-[10px] py-[5px] mt-[20px] edit-profile-input" value={updatedUser.phone_number} name="phone_number" onChange={handleInputChange} type="text" placeholder="Phone Number" />
            <button onClick={handleUpdateProfile} className="border-[#0A3981] px-[30px] py-[8px] color cursor-pointer bg-[#0A3981] mt-[40px] margin-right">
               Confirm
            </button>
         </div>
      </>
   );
};

export default EditProfile;
