"use client"

import React,{useState,useContext,createContext, use} from "react"

interface UploadedFileContextType{
    file:File|null
    setFile:React.Dispatch<React.SetStateAction<File | null>>
}

const UploadedFileContext=createContext<UploadedFileContextType|undefined>(undefined)

export const UploadedFileContextProvider=({children}:{children:React.ReactNode})=>{
    const [file,setFile]=useState<File|null>(null)
    return (
        <UploadedFileContext.Provider value={{file,setFile}}>
            {children}
        </UploadedFileContext.Provider>
    )
}

export const useUploadedFileContext=()=>{
    const context=useContext(UploadedFileContext)
    if(!context){
        throw new Error("Please wrap the component in the UploadedFileContextProvider")
    }
    return context;
}