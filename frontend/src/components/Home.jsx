import { useNavigate } from 'react-router-dom'
const Home = () => {
   const navigate = useNavigate();
   return (
      <div className="home flex flex-col items-center justify-center">
         <h1 className="font-inknut font-normal text-[48px] color hr w-[60%] text-center text2">BREATHE CLEAN</h1>
         <h3 className="font-inknut font-normal text-[26px] color text1">Creating Healthier Environment Effortlessly</h3>
         <button onClick={() => navigate("/about")} className="font-inknut font-normal text-[28px] px-[50px] py-[5px] round mt-[20px] cursor-pointer home-button">Learn More</button>
      </div>
   )
}

export default Home