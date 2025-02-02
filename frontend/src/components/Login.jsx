
import AxiosInstance from './AxiosInstance'
import { useNavigate } from 'react-router-dom'
import {useForm} from 'react-hook-form'

const Login = () => {
   const navigate = useNavigate()
   const { register, handleSubmit } = useForm();


   const submission = async (data) => {
      AxiosInstance.post(`users/login/`,{
         email: data.email, 
         password: data.password,
      })

      .then((response) => {
         localStorage.setItem('Token', response.data.token)
         navigate(`/home`)
      })
      .catch((error) => {
            console.error('Error during login', error)
            alert("Incorrect username or password.")
      })
   };
   return (
      <>
         <div className="bg-cover bg-center bg-no-repeat h-screen flex items-center justify-center" style={{ backgroundImage: "url('../../public/images/bg1.jpg')" }}>
            <div className=" w-[40%] h-[80%] flex flex-col items-center">
               <div className="flex flex-row items-center justify-center w-[100%] h-[80px] ">
                  <img className="w-[50px] h-[50px]" src="../../public/images/logoA.svg" alt="" />
                  <h3 className="font-inknut text-[30px] font-normal color ml-[10px]">Aerolamp</h3>
               </div>
               <h1 className="font-inknut text-[28px] font-normal color mt-[10%]">Login</h1>
               <p className="font-inknut text-[16px] font-normal color mt-[3%]">Please enter your Email and Password</p>
               <form onSubmit={handleSubmit(submission)} className="w-[100%] h-[40%] flex flex-col items-center justify-center">
                  <div className="w-[70%] h-[80%] flex items-center justify-center relative mt-[5%]">
                     <input {...register("email")} className="input" type="text" placeholder="Username"/>
                     <img className="inputicon" src="../../public/icons/mail.svg" alt="" />
                  </div>
                  <div className="w-[70%] h-[80%] flex items-center justify-center relative mt-[3%]">
                     <input {...register("password")} className="input" type="password" placeholder="Password"/>
                     <img className="inputicon" src="../../public/icons/key.svg" alt="" />
                  </div>
                  <a className="font-inknut font-normal text-[18px] ml-[40%] no-underline hover:underline mt-[2%] link" href="/forgotpassword">Forgot Password</a>
                  <button type={"submit"} className="font-inknut font-normal text-[20px] px-[10px] py-[5px] round mt-[5%] cursor-pointer">Log  In </button>
               </form>
               <p className="font-inknut font-normal text-[18px] color mt-[1%]">No account yet? <span className="span link cursor-pointer" onClick={() => {navigate('/register')}}>Sign Up</span></p>
            </div>
         </div>
      
      </>
   )
}

export default Login