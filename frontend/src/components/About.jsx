

const About = () => {
  return (
    <div className="bg1 w-[100%] h-[100%] flex flex-row items-center justify-center font-inknut font-normal">
      <div className="w-[20%] h-[60%] bg-[#D4EBF8] shadow-md flex flex-col items-center mx-[20px] relative">
        <img className="w-[70%] h-[70%]" src="../../public/images/img1.svg" alt="" />
        <p className="text-[20px] ">QR Code Mobile Scanning: <br /> Check Air Pollution <br />Anywhere</p>
        <div className="flex flex-row items-center ml-[5%] border4 h-[30px] w-[90%] absolute bottom-[5px]">
          <img className="w-[25px] h-[20px]" src="../../public/images/eye.svg" alt="" />
          <p className="text-[12px]">0</p>
          <img className="w-[20px] h-[16px] ml-[185px]" src="../../public/images/heart.svg" alt="" />
        </div>
      </div>
      <div className="w-[20%] h-[60%] bg-[#D4EBF8] shadow-md flex flex-col items-center mx-[20px] relative">
        <img className="w-[70%] h-[70%]" src="../../public/images/img2.svg" alt="" />
        <p className="text-[20px] ">Improving Air Quality in<br />Barangay with Aerolamp<br />Technology</p>
        <div className="flex flex-row items-center ml-[5%] border4 h-[30px] w-[90%] absolute bottom-[5px]">
          <img className="w-[25px] h-[20px]" src="../../public/images/eye.svg" alt="" />
          <p className="text-[12px]">0</p>
          <img className="w-[20px] h-[16px] ml-[185px]" src="../../public/images/heart.svg" alt="" />
        </div>
      </div>
      <div className="w-[20%] h-[60%] bg-[#D4EBF8] shadow-md flex flex-col items-center mx-[20px] relative">
        <img className="w-[70%] h-[70%]" src="../../public/images/img3.svg" alt="" />
        <p className="text-[20px] ">Solar Powered Monitoring <br /> Lamp </p>
        <div className="flex flex-row items-center ml-[5%] border4 h-[30px] w-[90%] absolute bottom-[5px]">
          <img className="w-[25px] h-[20px]" src="../../public/images/eye.svg" alt="" />
          <p className="text-[12px]">0</p>
          <img className="w-[20px] h-[16px] ml-[185px]" src="../../public/images/heart.svg" alt="" />
        </div>
      </div>
    </div>
  )
}

export default About
