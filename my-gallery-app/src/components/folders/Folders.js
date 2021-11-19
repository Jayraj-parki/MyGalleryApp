import React, { useContext, useEffect, useState } from 'react'
import style from "./folders.module.scss"
import { Search, Edit, Delete } from '@material-ui/icons'
import { AuthContext } from '../../App'
import { sidebarContext } from '../sidebar/Sidebar'
import { mainContext } from '../../pages/main/Main'
import { HashLink as Link } from 'react-router-hash-link';
export default function Folders() {
    const { searchInput,newFolder,setFolder:accessFolder }=useContext(sidebarContext)
    const { setActiveFolder }=useContext(mainContext)
    const { user } = useContext(AuthContext)
    const [folder, setFolder] = useState([])
    const [activeClass, setActiveClass] = useState({
        id: "0"
    })
    
   const changeActiveFolder=(id)=>{
    setActiveClass({ id:id})
    setActiveFolder(id)
   }
    const deleteFolder=async(id,foldername)=>{
        const res=window.prompt(`Please type "${foldername}" to delete folder.`)
        if(foldername===res){
            try {
                const result = await fetch(("api/folder/deleteFolder"), {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        _id: id,
                    })
                })
                const data = await result.json()
                if (result.status == 200) {
                    accessFolder()
                    alert(data)
                }else{
                    alert(data)
                }
            } catch (err) {
                console.log(err)
            } 
        }
        if(res && foldername!==res){
            alert("Invalid folder name")
        }
        
    }
    const renameFolder=async(id,foldername)=>{
        const res=window.prompt(`Please type new name to rename folder.`)
        if(res?.trim()){
            try {
                const result = await fetch(("api/folder/rename"), {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        _id: id,
                        foldername:res
                    })
                })
                const data = await result.json()
                if (result.status == 200) {
                    accessFolder()
                    alert(data)
                }else{
                    alert(data)
                }
            } catch (err) {
                console.log(err)
            } 
        }
       
    }
    useEffect(() => {
        const getFolder = async (e) => {
            try {
                const result = await fetch((`api/folder/getFolder/${user._id}`), {
                    method: "GET",
                })
                const data = await result.json()
                if (result.status == 200) {
                    setFolder(data)
                } else {
                    alert(data)
                }
            } catch (err) {
                console.log(err)
            }
        }
        getFolder()
    }, [newFolder])
    return (
        <>
            {
                folder.length !== 0 ?
                    <Link smooth to="#folder" className="text-decoration-none">
                        {

                            folder?.map((f) =>
                            f?.foldername?.includes(searchInput)?
                                <button key={f._id} id={"" + f._id} style={activeClass.id == f._id + "" ? { backgroundColor: "#16a085", color: "white" } : null} onClick={(e) =>changeActiveFolder(f._id) } className={style.folderBtn + " row col-12 mx-auto d-flex flex-row justify-content-between text-break border-0 mb-1 p-0 py-1 p-sm-2 text-start rounded-3 text-capitalize "}>
                                    <span className="col-12 col-sm-8">
                                        {f.foldername} <sup style={{ zIndex: 0 }}>({(f.images)?.length})</sup>
                                    </span>

                                    <span className="col-12 col-sm-3 d-flex flex-row justify-content-evenly p-0">
                                        <Edit onClick={()=>renameFolder(f._id,f.foldername)} className={style.editFolder + "   rounded-3 border p-1 fs-3 "} />
                                        <Delete onClick={()=>deleteFolder(f._id,f.foldername)} className={style.deleteFolder + "  rounded-3 border p-1 fs-3"} />
                                    </span>
                                </button>
                                :null
                            )
                        }
                        

                    </Link>
                    :
                    <span className="text-dark">You have not created a folder.</span>
            }
        </>
    )
}
