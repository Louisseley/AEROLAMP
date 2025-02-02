   import { useState } from 'react';
   import { useNavigate } from 'react-router-dom';
const Navbar = () => {
   const navigate = useNavigate();
   const [isModalOpen, setIsModalOpen] = useState(false);


   const toggleModal = () => {
      setIsModalOpen(!isModalOpen);
   };

   return (
      <nav className="transparent fixed w-full top-[20px] left-0 z-50">
   <div
      className="w-[90%] h-[20%] flex flex-row items-center justify-between px-[5%] z-10"
   >
      <div className="w-[15%] flex flex-row items-center justify-center">
         <img className="w-[46px] h-[49px]" src="/images/logoA.svg" alt="logo" />
         <h3 className="font-inknut font-normal text-[25px] ml-[15px] color">Aerolamp</h3>
      </div>
      <img
         className="w-[40px] h-[20px] border-white cursor-pointer"
         src="/icons/drawer.svg"
         alt="drawer"
         onClick={toggleModal}
      />
   </div>
   {isModalOpen && (
      <div onClick={toggleModal} className="modal relative w-[400px] h-full flex flex-col z-10 shadow-lg transition-transform transform ease-in-out duration-800">
         <div onClick={() => {navigate("/home"), toggleModal()}} className="w-[100%] mt-[30px]">
            <h1
               className="border1 font-inknut text-[24px] font-normal h-[30px] w-[100%] pl-[20px] py-[5px] cursor-pointer"
            >
               Home
            </h1>
         </div>
         <div onClick={() => {navigate("/aerolamp"), toggleModal()}} className="w-[100%] flex flex-row justify-between items-center border2">
            <h1 className="font-inknut text-[24px] font-normal h-[30px] w-[100%] pl-[20px] py-[5px] cursor-pointer">
               Aerolamp
            </h1>
         </div>
         <div onClick={() => {navigate("/about"), toggleModal()}} className="w-[100%] flex flex-row justify-between items-center border2">
            <h1 className="font-inknut text-[24px] font-normal h-[30px] w-[100%] pl-[20px] py-[5px] cursor-pointer">
               About
            </h1>
         </div>
         <div className="w-[100%]">
            <h1
               onClick={() => {navigate("/profile"), toggleModal()}}
               className="border2 font-inknut text-[24px] font-normal h-[30px] w-[100%] pl-[20px] py-[5px] cursor-pointer"
            >
               Users
            </h1>
         </div>
         <div className="w-[100%]">
            <h1
               onClick={() => {navigate("/logout"), toggleModal()}}
               className="border2 font-inknut text-[24px] font-normal h-[30px] w-[100%] pl-[20px] py-[5px] cursor-pointer"
            >
               Logout
            </h1>
         </div>
      </div>
   )}
</nav>
   );
   };

   export default Navbar;
