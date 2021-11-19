import React, { useEffect } from 'react'
import style from "./topbar.module.scss"
import {Link} from "react-router-dom"
import { useContext } from 'react'
import { AuthContext } from '../../App'
export default function Topbar() {
    const {user,setUser}=useContext(AuthContext)
    const logOut=async()=>{
        setUser(null)
        try{
            const result = await fetch(("api/user/logout"), {
                method: "DELETE",
            })
            const data=await result.json()
        }
        catch(err){
            console.log(err)
        }
    }
    return (
        <div className={style.topbar + " row col-12 mx-auto d-flex flex-row justify-content-between px-3"}>
            <Link to="/" className="col-auto my-auto text-decoration-none">
                <span className="fs-3 text-light fw-bold fst-italic">Let-Save-Photo</span>
            </Link>
          {user && <button onClick={logOut} className=" btn btn-light col-auto my-auto">Log Out</button>}
        </div>
    )
}
