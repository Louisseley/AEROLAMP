import { useNavigate } from "react-router-dom"

const SignorLogin = () => {
   const navigate = useNavigate();
   return (
      <div className="bg1 w-[100%] h-[100%] flex flex-col items-center justify-center font-inknut font-normal">
         <div className="w-[30%] h-[15%] flex flex-row items-center justify-between">
            <img className="w-[118px] h-[123px]" src="../../public/icons/image 22.svg" alt="" />
            <img className="w-[118px] h-[123px]" src="../../public/icons/image 20.svg" alt="" />
            <img className="w-[118px] h-[123px]" src="../../public/icons/image 21.svg" alt="" />
         </div>
         <div className="w-[20%] h-[10%] flex flex-row items-center justify-center mt-[5%]">
            <img className="h-[55px] w-[55px]" src="../../public/images/logoA.svg" alt="" />
            <h3 className="color text-[32px] ml-[10px]">Aerolamp</h3>
         </div>
         <button onClick={() => {navigate('/register')}} className="bg-[#3C619A] cursor-pointer color text-[24px] w-[20%] py-[8px] round  mt-[5%]">Sign Up</button>
         <p className="text-[16px] my-[1%]">Or</p>
         <button onClick={() => {navigate('/login')}} className="bg-[#3C619A] color text-[24px] cursor-pointer w-[20%] py-[8px] round">Log In</button>
         <p className="text-[12px] w-[20%] mt-[20px]">By signing up you agree to our <span className="text-[#3A6099]">Terms and Conditions</span> and <span className="text-[#3A6099]"> Privacy Policy.</span></p>
      </div>
   )
}

export default SignorLogin