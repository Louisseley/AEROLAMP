
import AxiosInstance from '../AxiosInstance'
import { useNavigate } from 'react-router-dom'
import {useForm} from 'react-hook-form'
import Message from './Message'
import { useState } from 'react'
const ForgotPassword = () => {
   const navigate = useNavigate()
   const { register, handleSubmit } = useForm();
   const [ShowMessage, setShowMessage] = useState(false)
   const submission = (data) => {
      AxiosInstance.post(`api/password_reset/`,{
         email: data.email, 
      })

      .then((response) => {
         setShowMessage(true);
         setTimeout(() => {
            navigate("/login");
         }, 5000);
         console.log(response)
      })
   }

   return (
      <div className="bg1 w-[100%] h-[100%] flex flex-col items-center justify-start font-inknut font-normal">
         {ShowMessage ? <Message text={"If your email exists you have received an email with instructions for resetting the password"}  color={'#69C9AB'}/> : null}
         <div className="w-[20%] h-[10%] flex flex-row items-center justify-center mt-[5%]">
            <img className="h-[80px] w-[80x]" src="../../public/images/logoA.svg" alt="" />
            <h3 className="color text-[52px] ml-[10px]">Aerolamp</h3>
         </div>
         <form onSubmit={handleSubmit(submission)} className="flex flex-col justify-center items-center w-[20%] h-[20%] mt-[10%]" action="">
            <input {...register("email")} className="text-[16px] pl-[20px] rounded-md h-[30px] w-[100%]" placeholder="Email or Username" type="text" />
            <button type={"submit"} className="bg-[#3C619A] color text-[16px] cursor-pointer w-[100%] py-[8px] round mt-[40px]">REQUEST PASSWORD RESET</button>
         </form>
      </div>
   )
}

export default ForgotPassword