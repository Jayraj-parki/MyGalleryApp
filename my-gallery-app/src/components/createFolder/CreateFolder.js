import React, { useState, useRef } from 'react'
import style from "./createFolder.module.scss"
import { useContext } from 'react'
import { AuthContext } from '../../App'
import { sidebarContext } from '../sidebar/Sidebar'
export default function CreateFolder({  }) {
    const { setFolder}=useContext(sidebarContext)
    const { user } = useContext(AuthContext)
    const [create, setCreate] = useState(false)
    const foldername = useRef()
    const createNewFolder = async (e) => {
        if (!foldername.current.value) {
            alert("plz write folder name beforing creating")
        }
        else {

            try {
                const result = await fetch((`api/folder/addFolder/${user._id}`), {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        foldername: foldername.current.value
                    })
                })
                const data = await result.json()
                if (result.status == 200) {
                    setFolder()
                    setCreate(false)
                    alert(data)
                } else {
                    alert(data)
                }
            } catch (err) {
                console.log(err)
            }
        }
    }

    return (
        <div className="row col-12 mx-auto">

            {
                create ?
                    <>
                        <input ref={foldername} className={style.folderinput + " col-12 p-1 ps-2 mx-auto rounded mt-2 bg-secondary border-0 text-light  lh-lg border-bottom "} type="text" placeholder="Write the name of folder" />
                        <button onClick={() => setCreate(false)} className={style.createFolder + " col-md-5  col-lg-4 mx-auto text-center my-1  my-md-3 border-0 p-2 px-3 rounded-3 bg-danger text-white"} >Cancel</button>
                        <button onClick={createNewFolder} className={style.createFolder + "  col-md-6 col-lg-4 mx-auto  my-md-3 my-1 text-center border-0 p-2 px-3 rounded-3 bg-success text-white"} >Create</button>
                    </>
                    :
                    <button onClick={() => setCreate(true)} className={style.createFolder + "  row col-auto mx-auto  my-3 border-0 p-2 px-3 rounded-3 "} >Create new Folder</button>
            }
        </div>

    )
}
