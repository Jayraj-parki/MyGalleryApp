import React, { useState, useEffect } from 'react'
import style from "./image.module.scss"
import { Link, useNavigate } from 'react-router-dom'
import { useParams } from 'react-router'
import { FavoriteBorder, Favorite, Delete, Fullscreen } from "@material-ui/icons"
export default function Image() {
    const { fid, imgId } = useParams()
    const navigate = useNavigate()
    const [active, setActive] = useState(true)
    const [currentImg, setCurrentImg] = useState()
    const [like, setLike] = useState()
    const [rename, setRename] = useState({
        old: "",
        new: ""
    })

    const deleteImg = async () => {
        const res = window.prompt(`Please type "${rename.old}" to delete Img.`)
        if (rename.old === res) {
            try {
                const result = await fetch(("/api/folder/deleteImg"), {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        _id: fid,
                        imgId
                    })
                })
                const data = await result.json()
                if (result.status == 200) {
                    navigate("/account")
                    alert(data)

                } else {
                    alert(data)
                }
            } catch (err) {
                console.log(err)
            }
        }
        if (res && rename.old !== res) {
            alert("Invalid Img name ")
        }

    }

    const renameImg = async () => {
        try {
            const result = await fetch("/api/folder/renameImg", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    _id: fid,
                    imgId: imgId,
                    name: rename.new
                })
            })

            if (result.status == 200) {
                setRename({ ...rename, old: rename.new })
                setActive(true)
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    const likeImg = async () => {
 
        try {
            const result = await fetch("/api/folder/likeImg", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    _id: fid,
                    imgId,
                    like
                })
            })
            if (result.status == 200) {
                setLike(!like)
            }

        } 
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const getImg = async () => {
            try {
                const result = await fetch(`/api/folder/img/${fid}/${imgId}`, {
                    method: "GET",
                })
                const data = await result.json()
                if (result.status == 200) {
                    setLike(data.like)

                    setCurrentImg(data)
                    setRename({ old: data.name, new: data.name })
                }
            }
            catch (err) {
                console.log(err)
            }
        }
        getImg()
    }, [fid, imgId])
    return (
        <div className={style.image + " container-fluid d-flex "}>
            <div className="row col-sm-10 col-lg-7 mx-auto p-3  d-flex my-auto bg-light rounded-3">
                <div className="col-12 mx-auto my-2 d-flex flex-sm-row flex-column justify-content-between">
                    <input className=" col-12 col-sm-6  px-3  outline-0 rounded" type="text" value={active ? rename.old : rename.new} onChange={(e) => setRename({ ...rename, new: e.target.value })} disabled={active ? "disabled" : false} style={!active?{border:"2px solid #16a085"}:null} />
                    {
                        active ?
                            <span onClick={() => setActive(false)} className="col-lg-4 col-xl-3 text-center my-auto  px-2 py-1 text-white bg-primary rounded-3" >Rename Filename</span>
                            :
                            <div className="d-flex flex-row justify-content-evenly m-sm-0 m-1 col-12 col-sm-6">
                                <span onClick={() => setActive(true)} className="col-5 text-center my-auto  px-2 py-1 text-white bg-black rounded-3" >Cancel</span>
                                <span onClick={() => renameImg()} className="col-5 text-center my-auto  px-2 py-1 text-white bg-success rounded-3" >Save</span>
                            </div>

                    }
                </div>
                <div className=" col-12 my-2 mx-auto d-flex justify-content-end">
                    <Fullscreen onClick={()=>window.open(currentImg?.path,"_blank")} className={style.icon + " mx-2 fs-2"}/>
                    {
                        like ?
                            <Favorite onClick={() => likeImg()} className={"mx-2 text-danger fs-2 " + style.icon} />
                            :
                            <FavoriteBorder onClick={() => likeImg()} className={style.icon + " mx-2 fs-2  text-dark"} />
                    }
                    <Delete onClick={deleteImg} className={style.icon + " mx-2 fs-2"} />
                    <Link to="/account" className="text-decoration-none d-flex p-0 ">
                        <span className=" mx-0 bg-dark text-white  rounded-3 p-1 my-auto px-2">Go Back</span>
                    </Link>
                </div>
                <div className={style.imageContainer + " row col-12 mx-auto p-2"}>
                    <img className={"col-12 shadow p-0 rounded-3"} src={currentImg?.path} alt="" />
                </div>
            </div>
        </div>
    )
}
