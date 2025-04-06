"use client"
import { Box,Input,Button } from "@chakra-ui/react"
import axios from "axios"
import { useEffect, useState } from "react"
import PdfButton from "./PdfButton"
import { useSelectedFileContext } from "@/app/contexts/SelectedFileContext"
import { useUploadedFileContext } from "@/app/contexts/UploadedFileContext"
interface PDF{
    pdf_id:string,
    pdf_name:string
}
const PdfList = () => {
    const {setFileID}=useSelectedFileContext()
    const {file,setFile}=useUploadedFileContext()
    const [pdfList,setPdfList]=useState<PDF[]>([])
    const [loading,setLoading]=useState(true)
    const [uploading,setUploading]=useState(false)

    const handleFileChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files && e.target.files[0]){
            setFile(e.target.files[0])
        }
    }
    const uploadFile=async()=>{
        if(!file){
            return;
        }
        const formData=new FormData
        formData.append("file",file);
        try{
            const response=await axios.post("http://localhost:4000/upload",formData,
                {
                    headers:{
                        "Content-Type":"multipart/form-data"
                    }
                }
            )
            setPdfList(response.data.pdfList)
        }
        catch(error:any){
            console.log("An error occurred while uploading the file",error.message)
        }
        finally{
            setUploading(false)
        }
    }
    useEffect(()=>{
        async function fetchPdfList(){
            try{
            const response=await axios.get("/api/info-fetch")
            const {data}=response
            setPdfList(data.pdf_array)
            setFileID(data.pdf_array[0].pdf_id as string|"");
            }
            catch(err:any){
                console.log(err.message)
            }
            finally{
                setLoading(false);
            }
        }
        fetchPdfList()
    },[])
  return (
        <Box h="full" w="full" bgSize={"50%"} bg={uploading?"gray.100":"url('/PDFListBackdrop.png')"} rounded="md" shadow="md" flex="0.7" display="flex"
        flexDir="column">
            {!loading?
                !uploading?
                    <Box flex="1" display="flex" flexDir="column" gap="2" p="2" shadow="2xl">
                        {pdfList?.map((pdf)=>{
                            return (
                                <PdfButton pdf={pdf} key={pdf.pdf_id}/>
                            )
                        })}
                    </Box>
                    :
                    <Box flex="1" display="flex" justifyContent="center" alignItems="center">
                        <img src="/Uploading.gif" style={{height:"190px",width:"250px"}}/>
                    </Box>
                :
                <Box flex="1" display="flex" justifyContent="center" alignItems="center">
                    <img src="/Loading.gif" alt="Loading gif" style={{height:"40px",width:"40px"}}/>
                </Box>
            }
            <form className="flex justify-center items-center flex-col">
                <Input type="file" placeholder="Upload a pdf" onChange={handleFileChange} color="gray.600" fontWeight="thin"/>
                    <Box bg="blue.600" roundedBottom="md" width="full">
                        <Button type="button" onClick={()=>{setUploading(true);uploadFile()}} width="full" className="!text-white !bg-transparent" roundedBottom="md">Upload File</Button>
                    </Box>    
            </form>
        </Box>
  )
}

export default PdfList