import React, { useRef } from 'react'
import style from "./register.module.scss"
import axios from "axios"
export default function Register({ setActive }) {
    const username = useRef()
    const email = useRef()
    const password = useRef()
    const cpassword = useRef()
    const handleSubmit = async (e) => {
        e.preventDefault();
       if (cpassword.current.value !== password.current.value) {
            alert("Password and confirm password is not matching")
        }
        else {
            try {
                const result = await fetch(("api/user/register"), {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        username: username.current.value,
                        email: email.current.value,
                        password: password.current.value,
                    })
                })
                const data = await result.json()
                if(result.status==200){
                   username.current.value=""
                   email.current.value=""
                   password.current.value=""
                   cpassword.current.value=""
                }
                alert(data)
            }
            catch (err) {
                console.log(err)
            }
        }
    }
    return (
        <div className={style.register + " row -col-12 py-3 d-flex flex-column"}>
            <span className={style.registerTitle + " col-auto mx-auto py-1 px-3 fw-bold"}>Sign Up </span>
            <form onSubmit={handleSubmit} className={style.form + " row  col-10 mx-auto p-1 d-flex flex-column align-items-center justify-content-center align-self-center"}>
                <label className="p-1 pb-0 fs-6 align-self-start" htmlFor="name">Username</label>
                <input className="col-12 ps-2   rounded-3 mb-2 " ref={username} id="name" type="text" name="username" placeholder="Enter your username" autoComplete="off" />
                <label className="p-1 pb-0 fs-6 align-self-start" htmlFor="email">Email ID</label>
                <input className="col-12 ps-2   rounded-3 mb-2 " ref={email} id="email" type="email" name="email" placeholder="Enter your email" autoComplete="off" />
                <label className="p-1 pb-0 fs-6 align-self-start" htmlFor="password">Password</label>
                <input className="col-12 ps-2   rounded-3 mb-2 " ref={password} id="password" type="password" name="password" placeholder="Enter your password" autoComplete="off" />
                <label className="p-1 pb-0 fs-6 align-self-start" htmlFor="cpassword">Confirm Password</label>
                <input className="col-12 ps-2   rounded-3 mb-2 " ref={cpassword} id="cpassword" type="password" name="password" placeholder="Enter Confirm password" autoComplete="off" />
                <input className={style.registerSubmit + " col-8 p-1 border-0 text-light rounded-3 my-2 fs-5 "} type="submit" name="submit" value="Register" />
                <p className="col-auto ">Already have an Account? <span onClick={setActive} className="fw-bold">Login here</span></p>
            </form>
        </div>
    )
}
