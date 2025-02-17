import { useForm } from 'react-hook-form';
import AxiosInstance from './AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const Register = () => {
   const navigate = useNavigate();

   const schema = yup.object({
      email: yup
         .string()
         .email('Field expects an email address')
         .required('Email is a required field'),
      first_name: yup
         .string()
         .required('First name is a required field'),
      last_name: yup
         .string()
         .required('Last name is a required field'),
      phone_number: yup
         .string()
         .min(11, 'Phone number must be at least 11 digits')
         .matches(/^[0-9]+$/, 'Phone number must be numeric'),
      password: yup
         .string()
         .required('Password is a required field')
         .min(8, 'Password must be at least 8 characters')
         .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
         .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
         .matches(/[0-9]/, 'Password must contain at least one number')
         .matches(/[!@#$%^&*(),.?":;{}|<>+]/, 'Password must contain at least one special character'),
      confirm_password: yup
         .string()
         .required('Password confirmation is a required field')
         .oneOf([yup.ref('password'), null], 'Passwords must match')
   });

   const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: yupResolver(schema)
   });

   const submission = async (data) => {
      try {
         // Create a new FormData object
         const formData = new FormData();
   
         // Append form fields to FormData
         formData.append('email', data.email);
         formData.append('first_name', data.first_name);
         formData.append('last_name', data.last_name);
         formData.append('phone_number', data.phone_number);
         formData.append('password', data.password);
         formData.append('confirm_password', data.confirm_password);
   
         // Ensure that profile_image is a file and append it to FormData
         if (data.profile_image && data.profile_image[0]) {
            formData.append('profile_image', data.profile_image[0]); // Append the file
         }
   
         // Make the POST request
         const response = await AxiosInstance.post('users/register/', formData, {
            headers: {
               'Content-Type': 'multipart/form-data', // This is essential for file uploads
            },
         });
         console.log(response)
         console.log(data);  // Log data for debugging
         navigate('/login');  // Redirect to login on success
      } catch (error) {
         console.error("Registration failed:", error.response ? error.response.data : error.message);
         alert("Registration failed. Please try again.");
      }
   };
   
   

   // Helper function for conditional margin
   const getMarginTop = (error) => (error ? 'mt-[5px]' : 'mt-[5%]');

   return (
      <div className="bg-cover bg-center bg-no-repeat h-screen flex items-start justify-center" style={{ backgroundImage: "url('/images/bg1.jpg')" }}>
         <div className="w-auto h-[90%] flex flex-col items-center">
            <div className="flex flex-row items-center justify-center w-[100%] h-[20px] mt-[50px] margin">
               <img className="w-[50px] h-[50px] logo" src="/images/logoA.svg" alt="" />
               <h3 className="font-inknut text-[30px] font-normal color ml-[10px] text2">Aerolamp</h3>
            </div>
            <h1 className="font-inknut text-[28px] font-normal color mt-[5%] signup">Sign up</h1>
            <h3 onClick={() => navigate('/login')} className='link text-[12px] cursor-pointer login1'>Login</h3>
            <p className="font-inknut text-[16px] font-normal color mt-[1%] text w-auto">Please enter your Email and Password</p>
            <form onSubmit={handleSubmit(submission)} className="w-[100%] h-[100%] flex flex-col items-center justify-center">
               {errors.email && <p className="text-[#F87171] text-sm mt-[5px]">{errors.email.message}</p>}
               <div className={`w-[80%] h-[90%] flex items-center justify-center relative ${getMarginTop(errors.email)}`}>
                  <input {...register("email")} className="input" type="text" placeholder="Username" />
                  <img className="inputicon inputicon1" src="/icons/mail.svg" alt="" />
               </div>

               {errors.first_name && <p className="text-[#F87171] text-sm mt-[5px]">{errors.first_name.message}</p>}
               <div className={`w-[80%] h-[90%] flex items-center justify-center relative ${getMarginTop(errors.first_name)}`}>
                  <input {...register("first_name")} className="input" type="text" placeholder="First Name" />
                  <img className="inputicon inputicon1" src="/icons/user.svg" alt="" />
               </div>

               {errors.last_name && <p className="text-[#F87171] text-sm mt-[5px]">{errors.last_name.message}</p>}
               <div className={`w-[80%] h-[90%] flex items-center justify-center relative ${getMarginTop(errors.last_name)}`}>
                  <input {...register("last_name")} className="input" type="text" placeholder="Last Name" />
                  <img className="inputicon inputicon1" src="/icons/user.svg" alt="" />
               </div>

               {errors.phone_number && <p className="text-[#F87171] text-sm mt-[5px]">{errors.phone_number.message}</p>}
               <div className={`w-[80%] h-[90%] flex items-center justify-center relative ${getMarginTop(errors.phone_number)}`}>
                  <input {...register("phone_number")} className="input" type="text" placeholder="Phone Number" />
                  <img className="inputicon inputicon1" src="/icons/phone.svg" alt="" />
               </div>

               {errors.password && <p className="text-[#F87171] text-sm mt-[5px]">{errors.password.message}</p>}
               <div className={`w-[80%] h-[90%] flex items-center justify-center relative ${getMarginTop(errors.password)}`}>
                  <input {...register("password")} className="input" type="password" placeholder="Password" />
                  <img className="inputicon inputicon1" src="/icons/key.svg" alt="" />
               </div>

               {errors.confirm_password && <p className="text-[#F87171] text-sm mt-[5px]">{errors.confirm_password.message}</p>}
               <div className={`w-[80%] h-[90%] flex items-center justify-center relative ${getMarginTop(errors.confirm_password)}`}>
                  <input {...register("confirm_password")} className="input" type="password" placeholder="Confirm Password" />
                  <img className="inputicon inputicon1" src="/icons/key.svg" alt="" />
               </div>

               {errors.profile_image && <p className="text-[#F87171] text-sm mt-[5px]">{errors.profile_image.message}</p>}
               <div className={`w-[80%] h-[90%] flex items-center justify-center relative ${getMarginTop(errors.confirm_password)}`}>
                  <input
                        {...register("profile_image")}
                        className="w-[100%] px-[10px] py-[5px] text-[18px] ml-[40px] file-upload text1 text-[#00001a]"
                        type="file"
                        accept="image/jpeg, image/png"
                     />
               </div>
               <button type={"submit"} className="font-inknut font-normal text-[20px] px-[10px] py-[5px] round mt-[5%] cursor-pointer text1">Sign Up</button>
            </form>
         </div>
      </div>
   );
}

export default Register;
