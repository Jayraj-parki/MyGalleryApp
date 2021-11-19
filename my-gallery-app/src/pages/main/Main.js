import React, { useState,createContext } from 'react'
import style from "./main.module.scss"
import Sidebar from '../../components/sidebar/Sidebar'
import { Search, Add } from "@material-ui/icons"
import { Link } from 'react-router-dom'
import ViewImages from '../../components/viewImages/ViewImages'
import RightBar from '../../components/righbar/RightBar'
export const mainContext = createContext()
export default function Main() {
    const [searchInput, setSearchInput] = useState("")
    const [activeFolder,setActiveFolder]=useState("")
    return (
        <>
        <mainContext.Provider value={{activeFolder:activeFolder, setActiveFolder:(val)=>setActiveFolder(val)}}>

            <div className={style.mainContainer + "  container-fluid  p-0 py-1"}>
                <div className={style.wrapper + " row col-12 m-0"}>
                    <div className={style.left + " col-6 col-sm-5 col-lg-3  order-1 order-sm-1 pb-3"}>
                        <Sidebar />
                    </div>
                    <div id="folder" className={style.center + " col-12 col-sm-7 col-lg-6 order-3 order-sm-2 mx-auto "}>
                        <ViewImages  />
                    </div>
                    <div className={style.right + " col-6 col-sm-12 col-lg-3 order-2 order-sm-3 d-flex flex-column p-2"}>
                      <RightBar/>
                    </div>
                </div> 
            </div>

        </mainContext.Provider>
        </>
    )
}
