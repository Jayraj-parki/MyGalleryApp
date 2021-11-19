
import React, { useEffect, useState } from 'react'
import "../node_modules/bootstrap/dist/css/bootstrap.css"
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
import Home from "./pages/home/Home"
import Main from './pages/main/Main'
import { Routes, Route, Navigate } from "react-router"
import { BrowserRouter } from "react-router-dom"
import { createContext } from "react"
import Topbar from './components/topbar/Topbar'
import Image from './pages/showImage/Image'
export const AuthContext = createContext()
export default function App() {
  const [user, setUser] = useState(null)
  const [profileImg,setProfile]=useState(true)
  useEffect(() => {
    const Auth = async () => {
      try {
        const result = await fetch("api/user/", {
          method: "GET",
        })
        const data = await result.json()
        if (result.status == 200) {
          setUser(data)
        }
      }
      catch (err) {
        console.log(err)
      }
    }
    Auth()
  }, [profileImg])
  return (
    <AuthContext.Provider value={{ user, setUser: setUser,setProfile:()=>setProfile(!profileImg) }}>
      <BrowserRouter>
      <Topbar />
        <Routes>
          <Route path="/" exact element={user ? <Navigate to="/account" /> : <Home />} />
          <Route path="/account" exact element={user ? <Main /> : <Navigate to="/" />} />
         <Route path="/account/:fid/:imgId"  element={user ? <Image /> : <Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>

  )
}
