"use client"
import { Box, Button, Container, Heading, Input } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { BiSend } from "react-icons/bi"
import TextBubble from "./TextBubble"
import axios from "axios"
import PdfList from "./PdfList"
import { useSelectedFileContext } from "@/app/contexts/SelectedFileContext"
import { useUploadedFileContext } from "@/app/contexts/UploadedFileContext"

interface Message{
    role:"user"|"assistant"
    content:string
}
const Chatbot = () => {

    const [userMessage,setUserMessage]=useState<string>("");
    const [messages,setMessages]=useState<Message[]>([]);
    const [loadingMessage,setLoadingMessage]=useState<boolean>(false)
    const {file,setFile}=useUploadedFileContext()
    const {fileID}=useSelectedFileContext()

    const addUserMessage=()=>{
        setMessages((prev)=>{
            return (
            [...prev,{role:"user",content:userMessage}]
            )
        })
    }

    useEffect(()=>{
        async function sendMessage(messages:Message[]){
            try{
                if(!fileID){
                    setMessages((prev)=>{
                        return (
                            [...prev,{role:"assistant",content:"Please select a file from the sidebar"}]
                        )
                    })
                    return ;
                }
                const response=await axios.post("/api/chat",{messages,fileID});
                const {data}:{data:Message}=response
                setMessages((prev)=>{
                    return (
                        [...prev,{role:"assistant",content:data.content}]
                    )
                })
            }
            catch(err:any){
                setMessages((prev)=>{
                    return (
                        [...prev,{role:"assistant",content:"Sorry, I'm unable to respond to your queries at the moment"}]
                    )
                })
            }
            finally{
                setLoadingMessage(false)
            }
        }
        const lastMessage=messages[messages.length-1]
        if(lastMessage && lastMessage.role=="user"){
            sendMessage(messages)
        }
        else{
            setLoadingMessage(false)
        }
    },[messages])
    return (
    <Box display="flex" flex="1" h="full" bg="gray.50" p="5" gap="3">
        <PdfList/>
        <Box display="flex" bg="url('/TrialBG.png')" flexDir="column"
            h="full" w="full" rounded="md" shadow="lg" flex="1.3">
                {messages.length==0?
                <Box display="flex" flexDir="column" justifyContent={"center"} alignItems="center" flex="2" gap="6">
                    <Heading size="4xl" color="white" w="full" textAlign="center">
                        Hi there! Select a resource or upload your own
                        <br/>Let's <span className="!text-4xl font-bold bg-gradient-to-br from-pink-500 to-blue-500 bg-clip-text text-transparent">
                            get started
                        </span>
                    </Heading>
                </Box>
                    :
                <Box display="flex" flexDir="column" justifyContent={"flex-start"} alignItems="center" flex="2" h="min-content" p="2" w="full"
                gap="-0.5" overflow="scroll">
                    {messages.map((message,index)=>{
                        return (
                            <TextBubble message={message} key={index}/>
                        )
                    })}
                    {loadingMessage?
                    <Box w="full">
                    <img src="/Loading.gif" style={{height:"60px", width:"60px"}}/>
                    </Box>
                    :null}
                </Box>
                }
            <Box h="80px" display="flex" alignItems="center" justifyContent="center" p="5">
                <Container display="flex" alignItems="center" justifyContent="center" bg="white" p="0.5" rounded="24px">
                    <Input placeholder="Ask just about anything related to the resource" h="50px" border="none" rounded="24px"
                    color="black" value={userMessage} onChange={(e)=>setUserMessage(e.target.value)}/>
                    <Button disabled={loadingMessage} rounded="50%" h="45px" w="45px" bg="blue.400" onClick={(e)=>{setLoadingMessage(true);addUserMessage();setUserMessage("")}}>
                        <BiSend/>
                    </Button>
                </Container>
            </Box>
        </Box>
    </Box>
  )
}

export default Chatbot