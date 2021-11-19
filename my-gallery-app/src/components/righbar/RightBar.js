import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import style from "./rightbar.module.scss"
import { AuthContext } from '../../App'
import { format } from "timeago.js"
import { Favorite } from "@material-ui/icons"
import { storage } from '../firebase/index'
import axios from 'axios'
export default function RightBar() {
    const { user, setUser,setProfile } = useContext(AuthContext)
    const [images, setImages] = useState([])
    const [check, setCheck] = useState(0)
    const [file, setFile] = useState(null)
    const chnageProfileImg = async () => {
        const path = "" + file.name + Date.now()
        const uploadTask = storage.ref("/images/" + path).put(file)
        uploadTask.on(
            "state_changed",
            snapshot => {
            },
            error => {
                console.log(error);
            },
            () => {
                storage.ref("images")
                    .child(path)
                    .getDownloadURL()
                    .then(async (url) => {
                        try {

                            const res = await axios.post("/api/user/profileImg", {
                                _id: user._id,
                                path: url
                            })
                            setProfile()
                            setFile("")
                            alert(res.data)

                        }
                        catch (err) {
                            console.log("err in saving new post")
                        }
                    })
            }
        )
    }
    const getFavImg = async (e) => {
        try {
            const result = await fetch((`api/folder/favouriteImg/${user._id}`), {
                method: "GET",
            })
            const data = await result.json()
            if (result.status == 200) {
                setImages(data)
            }
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        getFavImg()
    }, [user])
    return (
        <>
            <div className={style.profileWrapper + " d-flex flex-column  mx-auto  p-0 m-0   "}>
                <label htmlFor="profileImg" className=" col-auto mx-auto ">
                    <img  className={style.profileImg + " "} src={file ? URL.createObjectURL(file):user.profileImg} alt="" />
                </label>
                {file&&<span onClick={chnageProfileImg} className={style.changeProfile+" text-center bg-success px-2 rounded-2 text-white m-1"}>Save</span>}
                {file&&<span onClick={()=>setFile("")} className={style.changeProfile+" text-center  bg-danger px-2 rounded-2 text-white m-1"}>Cancel</span>}
                <span className="text-center m-1">{user.username}</span>
                <input id="profileImg" style={{ display: "none" }} type="file"  onChange={(e) => setFile(e.target.files[0])} />
            </div>

            <div className={style.favouriteImages + "  row col-12 border-top mx-auto p-2 "}>
                <span onClick={getFavImg} className={"col-12 text-center text-light rounded-3 mb-3 p-2 " + style.favText}>My favourite Image List</span>
                {
                    images.length > 0 &&
                    <>
                        {

                            images?.map((f) =>
                                <>
                                    {
                                        f.images?.map((val) => {
                                            if (val?.like) {

                                                check <= 0 && setCheck(1)
                                                return (
                                                    <Link key={val._id} to={`${f._id}/${val._id}`} className={style.image + " col-sm-3 col-lg-6 p-0 px-1 mb-2  d-flex flex-column mx-auto text-decoration-none"}>
                                                        <img className="rounded-3 w-100" src={val.path} alt="..." />
                                                        <span className=" text-center ms-auto text-secondary pe-1 ">{format(val?.time)}</span>
                                                        <Favorite className={style.fav + " fs-6"} />
                                                    </Link>
                                                )
                                            }
                                        })
                                    }
                                </>
                            )
                        }
                    </>
                }
                {
                    check <= 0 && <span className="text-dark">No Image is Added to Favourite List.</span>
                }
            </div>
        </>
    )
}
