import { useNavigate } from 'react-router-dom'
import AxiosInstance from './AxiosInstance';
function Logout() {
   const navigate = useNavigate();
   const logoutUser = () =>{
      AxiosInstance.post(`logoutall/`,{
      })
      .then( () => {
         localStorage.removeItem("Token")
         navigate('/')
      }
      )
   }
 
   return (
      <div className="bg-cover bg-center bg-no-repeat h-screen flex items-center justify-center font-inknut font-normal" style={{ backgroundImage: "url('../../public/images/bg1.jpg')" }}>
         <div className="bg3 w-[30%] h-[70%] round flex flex-col items-center justify-start logout">
            <div className="flex flex-row items-center justify-center w-[100%] h-[80px] mt-[20%]">
               <img className="w-[50px] h-[50px] logo" src="../../public/images/logoA.svg" alt="" />
               <h3 className="font-inknut text-[30px] font-normal color ml-[10px] text2">Aerolamp</h3>
            </div>
            <h3 className="text-[28px] mt-[10%]">Logout</h3>
            <div className="flex flex-row items-center justify-between w-[80%] mt-[10%]">
               <button onClick={() => {navigate('/home')}} className="w-[150px] h-[40px] round bg-[#F87171] text-[20px] font-medium cursor-pointer text1 hover:text-[#F87171] hover:bg-transparent hover:border-[#F87171] hover:border">Back</button>
               <button onClick={logoutUser} className="w-[150px] h-[40px] round bg-[#1E3A8A] text-[20px] font-medium cursor-pointer logout-box hover:text-[#1E3A8A] hover:bg-transparent hover:border-[#1E3A8A] hover:border">Confirm</button>
            </div>
         </div>
      </div>   
   );
 }
export default Logout;
 