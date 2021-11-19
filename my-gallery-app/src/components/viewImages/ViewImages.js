import React, { useState, useContext, useEffect } from 'react'
import { Search, Add, PermMedia, Cancel } from "@material-ui/icons"
import { Link } from 'react-router-dom'
import style from "./viewImages.module.scss"
import { mainContext } from '../../pages/main/Main'
import { storage } from '../firebase/index'
import axios from "axios"
import { format } from "timeago.js"
export default function ViewImages() {
    const [file, setFile] = useState(null)
    const [newPost, setPost] = useState(false)
    const { activeFolder } = useContext(mainContext)
    const [searchInput, setSearchInput] = useState("")
    const [category, setCategory] = useState(true)
    const [images, setImages] = useState([])
    const [refresh, setRefresh] = useState(false)
    useEffect(() => {
        const getImages = async () => {
            try {
                const result = await fetch(("api/folder/getActiveFolder/" + activeFolder), {
                    method: "GET",
                })
                const data = await result.json()
                if (result.status == 200) {
                    setImages(data[0]?.images)
                }
            } catch (err) {
                console.log(err)
            }
        }
        if (activeFolder) {
            getImages()
        }
    }, [activeFolder, refresh])

    const uploadNewMedia = async () => {
        setPost(false)
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

                            const res = await axios.post("/api/folder/addImg", {
                                _id: activeFolder,
                                name: file.name,
                                path: url
                            })
                            setRefresh(!refresh)
                            alert(res.data)
                            setFile(null)

                        }
                        catch (err) {
                            console.log("err in saving new post")
                        }
                    })
            }
        )
    }
    return (
        <>
            {
                newPost &&
                <div className={style.uploadImg + " row col-12 d-flex justify-content-center align-items-start rounded-3 mx-auto m-0 pb-4 px-2"}>
                    <h2 className={"col-12   border-bottom border-dark p-2 fs-3 text-center"}>Upload Your Images/Videos here</h2>
                    <span className={style.shareOption + " col-auto ms-auto  d-flex align-items-center  align-self-start"}>
                        {
                            file ?
                                <span onClick={uploadNewMedia} className={style.shareOptionText + " bg-primary p-2 px-3 text-white rounded mx-auto"}> Save</span>
                                : <label htmlFor="file" className={style.shareOptionText + " bg-primary p-2 text-white rounded mx-auto"}> Add Photo or Video</label>
                        }

                        <input style={{ display: "none" }} type="file" id={"file"} onChange={(e) => setFile(e.target.files[0])} />
                    </span>
                    <span onClick={() => { setFile(null); document.getElementById("file").value = null; setPost(false) }} className={style.cancelUplaod + " col-auto  p-2 pb-1 text-white rounded  bg-dark "}> Cancel</span>
                    {
                        file && (

                            <div className={style.shareImageContainer + " mt-3  "}>
                                <img className={style.selectedImg + " rounded-3"} src={URL.createObjectURL(file)} alt="not found" />
                                <Cancel className={style.shareCancel + " fs-1  text-white shadow"} onClick={() => { setFile(null); document.getElementById("file").value = null }} />
                            </div>

                        )
                    }
                </div>
            }
            {
                images?.length !== 0 || activeFolder ?
                    <>
                        <div className={style.action + "   mx-auto d-flex border-bottom"}>
                            <Search className="col-1 ms-auto my-auto text-secondary" />
                            <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className=" col-11 p-1 mx-auto bg-transparent border-0  lh-lg " type="text" placeholder={"Search a Images by name"} />
                        </div>
                        <div className={style.categorySize + " row col-12 p-2"}>
                            <select onChange={() => setCategory(!category)} className="border-0 p-1 col-auto ms-auto px-3 rounded-1  text-light" name="" id="">
                                <option value={"Small Size"}>Small Size</option>
                                <option value={"Large Size"}>Large Size</option>
                            </select>
                        </div>
                        <div className={style.imageContainer + " row col-12 mx-auto my-2  d-flex justify-content-center pb-3"}>
                            <button onClick={() => setPost(true)} id="newImg" style={{ marginBottom: !category ? "10px" : "" }} className={style.uploadNewImg + " border-0 rounded-3 p-0 pb-1 d-flex flex-column  "}>
                                <Add className={style.AddIcon + " mx-auto "} />
                                <span className="mt-auto text-center mx-auto ">New Post</span>
                            </button>

                            {
                                images?.reverse().map((i) =>
                                    i?.name.includes(searchInput) &&
                                    <Link key={i._id} to={`${activeFolder}/${i._id}`} id={category ? style.image : ""} className={style.image + " d-flex flex-column mb-2 text-decoration-none"}>
                                        <img className="rounded-3" src={i.path} alt="..." />
                                        <span className=" text-center ms-auto text-secondary pe-1">{format(i?.time)}</span>
                                    </Link>

                                )
                            }
                        </div>
                    </>
                    :
                    <span className="text-dark">No Folder is selected</span>
            }


        </>
    )
}
