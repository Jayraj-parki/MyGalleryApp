import React, { useContext, useRef } from 'react'
import style from "./login.module.scss"
import { AuthContext } from '../../App'
export default function Login({ setActive }) {
    const {user,setUser}=useContext(AuthContext)
    const email = useRef()
    const password = useRef()
    const handleForm = async (e) => {
        e.preventDefault();
        // dispatch(LoginStart)
        try {
            const result = await fetch(("api/user/login"), {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    email: email.current.value,
                    password: password.current.value,
                })
            })
            const data = await result.json()
            if (result.status == 200) {
                email.current.value = ""
                password.current.value = ""
                alert("User login successfully")
                setUser(data)
            }else{
                alert(data)
            }
        } catch (err) {
            // dispatch(()=>LoginError(err))
            console.log(err)
        } 
    }
    return (
        <div className={style.login + " row -col-12 py-3 d-flex flex-column"}>
            <span className={style.loginTitle + " col-auto mx-auto py-1 px-3 fw-bold"}>Sign In </span>
            <form onSubmit={handleForm} className={style.form + " row  col-10 mx-auto p-1 d-flex flex-column align-items-center justify-content-center align-self-center"}>
                <label className="p-1 pb-0 fs-6 align-self-start" htmlFor="email">Email ID</label>
                <input className="col-12 ps-2   rounded-3 mb-2 " id="email" type="email" name="email" ref={email} placeholder="Enter your email" autoComplete="off" required />
                <label className="p-1 pb-0 fs-6 align-self-start" htmlFor="password">Password</label>
                <input className="col-12 ps-2   rounded-3 mb-2 " id="password" type="password" name="password" ref={password} placeholder="Enter your password" autoComplete="off" required />
                <input className={style.loginSubmit + " col-8 p-1 border-0 text-light rounded-3 my-2 fs-5 "} type="submit" name="submit" value="Log In" />
                <p className="col-auto ">Do not have an Account? <span onClick={setActive} className="fw-bold">Sign Up here</span></p>
            </form>
        </div>
    )
}
