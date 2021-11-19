import { Search } from '@material-ui/icons'
import React, { createContext, useEffect, useState } from 'react'
import CreateFolder from '../createFolder/CreateFolder'
import Folders from '../folders/Folders'
import style from "./sidebar.module.scss"
export const sidebarContext = createContext()
export default function Sidebar() {
    const [newFolder, setFolder] = useState(false)
    const [searchInput, setSearchInput] = useState("")

    useEffect(() => {

    }, [newFolder])
    return (
        <>
            <sidebarContext.Provider value={{searchInput,newFolder,setFolder: ()=>setFolder(!newFolder)}}>
                <div style={{ zIndex: 10 }} className={style.action + "  pb-1"}>
                    <div className="d-flex flex-row border-bottom border-1">
                        <Search className="m-auto text-secondary" />
                        <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="col-11 p-1 ps-2 mx-auto bg-transparent border-0  lh-lg " type="text" placeholder="Search a folder by name" />
                    </div>
                    <CreateFolder  />
                    <hr />
                </div>
                <div className={style.folderName + " row col-12 mx-auto my-0 p-0"}>
                    <Folders    />
                </div>
            </sidebarContext.Provider>
            
        </>
    )
}
