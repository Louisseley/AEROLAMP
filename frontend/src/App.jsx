import './App.css'
import Home from './components/Home'
import Login from './components/Login'
import Navbar from './components/Navbar'
import Register from './components/Register'
import About from './components/About'
import EditProfile from './components/EditProfile'
import Profile from './components/Profile'
import SignorLogin from './components/SIgnorLogin'
import ForgotPassword from './components/Ocomponents/ForgotPassword'
import PasswordReset from './components/Ocomponents/PasswordReset'
import Logout from './components/Logout'
import Aerolamp from './components/Aerolamp'
import AerolampModel from './components/AerolampModel'
import AerolampDataHistory from './components/AerolampDataHistory'
import {Routes, Route, useLocation } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoutes'

function App() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/' && location.pathname !== '/register' && location.pathname !== '/login' && location.pathname !== '/forgotpassword'  && location.pathname !== '/logout' && location.pathname !== '/loading';
  return (
    <>
      {showNavbar && <Navbar />} 
      <Routes>
        <Route path="/" element={<SignorLogin/>}/> 
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/forgotpassword" element={<ForgotPassword/>}/>
        <Route path="/password-reset/:token" element={<PasswordReset/>}/> 
        <Route  element={<ProtectedRoute/>}>
          <Route path="/home" element={<Home/>}/> 
          <Route path="/about" element={<About/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/editprofile" element={<EditProfile/>}/>
          <Route path="/aerolamp" element={<Aerolamp/>}/>
          <Route path="/aerolampmodel" element={<AerolampModel/>}/>
          <Route path="/aerolamp_datahistory" element={<AerolampDataHistory/>}/>
          <Route path="/logout" element={<Logout/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
