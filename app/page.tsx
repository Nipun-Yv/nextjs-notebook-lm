"use client"
import Chatbot from "@/components/Chatbot";
import Preview from "@/components/Preview";
import { Box, Button } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";
import { SelectedFileContextProvider } from "./contexts/SelectedFileContext";
import { UploadedFileContextProvider } from "./contexts/UploadedFileContext";

export default function Home() {
  const [file,setFile]=useState<File|null>(null)
  return (
    <Box display="flex" h="100%">
      <UploadedFileContextProvider>
          <SelectedFileContextProvider>
              <Chatbot/>
          </SelectedFileContextProvider>
          <Preview/>
      </UploadedFileContextProvider>
    </Box>
  );
}
