"use client"
import { Box, Container } from "@chakra-ui/react"

interface Message{
    role:"user"|"assistant"
    content:string
}
const TextBubble = ({message}:{message:Message}) => {
    return (
        <Box w="full" h="min-content" display="flex" minH="min-content"
        p="2" justifyContent={message.role==="user"?"right":"left"}>
            {message.role==="user"?
            <Box bg="white" rounded="md" color="gray.600" w="70%" display="flex" 
                alignItems="center" p="3" fontWeight="light">
                {message.content}
            </Box>:
            <Box bg="blue.600" rounded="md" color="white" w="70%" display="flex" 
            alignItems="center" p="3" fontWeight="light" minH="min-content">
            {message.content}
            </Box>             
            }
        </Box>
        )
}

export default TextBubble