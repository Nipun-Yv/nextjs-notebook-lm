"use client"
import { Box, Text } from '@chakra-ui/react'
import React from 'react'
import { useSelectedFileContext } from '@/app/contexts/SelectedFileContext'
interface PDF{
    pdf_id:string,
    pdf_name:string
}

const PdfButton = ({pdf}:{pdf:PDF}) => {
    const {fileID,setFileID}=useSelectedFileContext()
    return (
    <Box shadow="sm" rounded="md"
    w="full" h="min-content" p="2"
    display="flex" alignItems="center" justifyContent="center"
    color={fileID!=pdf.pdf_id?"gray.700":"white"} gap="3"
    bg={fileID==pdf.pdf_id?"linear-gradient(to bottom right,deeppink,blue)":"white"}
    fontWeight="light"
    onClick={()=>{setFileID(pdf.pdf_id)}}>
        <img src="/BookCover.png" style={{width:"35px",height:"50px", objectFit:"cover"}}/>
        <Text flex='1'>
            {pdf.pdf_name}
        </Text>
    </Box>
  )
}

export default PdfButton