import React, { useEffect, useState } from 'react'
import img from "./1.jpg"
import style from "./home.module.scss"
import Register from '../../components/register/Register'
import Login from '../../components/login/Login'
export default function Home() {
    const [active, setActive] = useState(true)
    return (
        <>
            {/* <Topbar /> */}
            <div className={style.homeContainer + " container-fluid d-flex py-2"}>
                <div className="row col-lg-10 col-xl-8 m-auto my-auto  d-flex flex-row ">
                    <h2 className=" col-sm-12 col-lg-6 col-xl-5  col-xxl-4 me-auto y-sm-2 my-lg-auto px-2 py-2 rounded-3 text-center text-lg-start text-white">Welcome to MyGalleryApp</h2>
                    <div className={"col-sm-8 col-lg-6 my-auto ms-lg-auto mx-auto bg-white rounded-3 shadow-lg"}>
                        {active ? <Register setActive={() => setActive(false)} /> : <Login setActive={() => setActive(true)} />}
                    </div>
                </div>
            </div>
        </>
    )
}
