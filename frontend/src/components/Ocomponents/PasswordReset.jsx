import {useForm} from 'react-hook-form'
import AxiosInstance from '../AxiosInstance'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {useParams } from 'react-router-dom'
import Message from './Message'
const PasswordReset = () => {
   const navigate = useNavigate()
   const { register, handleSubmit } = useForm();

   const {token} = useParams()
   console.log(token)
   const [ShowMessage, setShowMessage] = useState(false)


   const submission = (data) => {
      AxiosInstance.post(`api/password_reset/confirm/`,{
         password: data.password, 
         token: token,
      })

      .then((response) => {
         setShowMessage(true)
         console.log(response)
         setTimeout(() =>{
               navigate('/')
         }, 6000 )
      })
   
   }
   
   
   return (
      <>
      <div className="bg-cover bg-center bg-no-repeat h-screen flex items-center justify-center bg1">
      {ShowMessage ? <Message text={"Your password reset was successfull, you will be directed to the login page in a second"} color={'#69C9AB'}/> : null}
         <div className=" w-[40%] h-[80%] flex flex-col items-center">
            <h1 className="font-inknut text-[28px] font-normal color mt-[10%]">Reset Password</h1>
            <p className="font-inknut text-[16px] font-normal color mt-[3%]">Please Enter Your New Password</p>
            <form  onSubmit={handleSubmit(submission)} className="w-[100%] h-[35%] flex flex-col items-center justify-center">
               <div className="w-[70%] h-[80%] flex items-center justify-center relative mt-[3%]">
                  <input {...register("password")} className="input" type="password" placeholder="Password"/>
                  <img className="inputicon" src="../../public/icons/key.svg" alt="" />
               </div>
               <div className="w-[70%] h-[80%] flex items-center justify-center relative mt-[3%]">
                  <input {...register("confirm_password")} className="input" type="password" placeholder="Confirm Password"/>
                  <img className="inputicon" src="../../public/icons/key.svg" alt="" />
               </div>
               <button type={"submit"} className="font-inknut font-normal text-[20px] px-[20px] py-[5px] round mt-[5%] cursor-pointer hover:opacity-50">Confirm</button>
            </form>
         </div>
      </div>
   
   </>
   )
}

export default PasswordReset