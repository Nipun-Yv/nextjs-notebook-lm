"use client"

import React,{useState,useContext,createContext} from "react"

interface SelectedFileContextType{
    fileID:string,
    setFileID:React.Dispatch<React.SetStateAction<string>>
}

const SelectedFileContext=createContext<SelectedFileContextType|undefined>(undefined)

export const SelectedFileContextProvider=({children}:{children:React.ReactNode})=>{
    const [fileID,setFileID]=useState<string>("")
    return (
        <SelectedFileContext.Provider value={{fileID,setFileID}}>
            {children}
        </SelectedFileContext.Provider>
    )
}

export const useSelectedFileContext=()=>{
    const context=useContext(SelectedFileContext)
    if(!context){
        throw new Error("Please wrap teh componet in the selected file context provider")
    }
    return context;
}