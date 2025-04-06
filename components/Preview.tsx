"use client";

import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useUploadedFileContext } from "@/app/contexts/UploadedFileContext";
const Preview = () => {
    const {file}=useUploadedFileContext()
    const [previewUrl, setPreviewUrl] = useState<string>("/BookCover.png");
    useEffect(() => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [file]);
    return (
    <Box bg={`url('${previewUrl}')`} bgSize="100%" display="flex" w="50" shadow="2xl" shadowColor="black" borderLeft="4">
        <img src="/SquareBG.png" alt="square-overlay" style={{width:"100%",height:"100%"}}/>
        {/* <Document
        file={file}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading="Loading PDF..."
        error="Failed to load PDF."
        >
        <Page pageNumber={1} width={600} />
      </Document> */}
    </Box>
  )
}

export default Preview