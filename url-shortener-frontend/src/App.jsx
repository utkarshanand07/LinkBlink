import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom' 

import LandingPage from './components/LandingPage' 
import AboutPage from './components/AboutPage'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import RegisterPage from './components/RegisterPage'
import LoginPage from './components/LoginPage'   
import DashboardLayout from './Dashboard/DashboardLayout'

import { Toaster } from 'react-hot-toast'

function App() {

  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Toaster position='bottom-center'/>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/Register" element={<RegisterPage />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/Dashboard" element={<DashboardLayout />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
