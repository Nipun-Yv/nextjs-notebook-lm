import OpenAI from "openai"
import { DataAPIClient } from "@datastax/astra-db-ts"
const {OPENAI_API_KEY,ASTRA_DB_NAMESPACE,ASTRA_DB_COLLECTION,ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_TOKEN
}=process.env

const openai=new OpenAI({apiKey:OPENAI_API_KEY})

const client=new DataAPIClient(ASTRA_DB_TOKEN)
const db=client.db(ASTRA_DB_API_ENDPOINT as string,{namespace:ASTRA_DB_NAMESPACE})

export async function POST(req:Request){
    const {messages,fileID}=await req.json()
    if(!fileID){
        return Response.json({ error: "Invalid request, please select a file" }, { status: 400 });
    }
    const lastMessage=messages.length>0?messages[messages.length-1].content:""
    console.log(lastMessage)
    try{
        const embedding=await openai.embeddings.create({
            input:lastMessage,
            model:"text-embedding-3-small",
            encoding_format:"float"
        })
        const collection=db.collection(ASTRA_DB_COLLECTION as string)
        let docContext;
        try{
            const cursor=collection.find({pdf_id:fileID},{
                sort:{
                    $vector:embedding.data[0].embedding
                },
                limit:3
            })
            const contextArray=await cursor.toArray()
            const textContent=contextArray?.map((element)=>{return (element.text)})
            docContext=JSON.stringify(textContent)
        }
        catch(error:any){
            docContext=""
        }
        const template={
            role:"system",
            content:`
        You are an AI Assistant named Laura, your job is to respond to user queries based on specific
        resources/pdfs. You are supplied with the relevant context from the given pdf, you have to reply
        by using the important keywords that you identify from the context and answer to the best of your ability by referring to the document context
        and framing the answer correctly. If you are not supplied with the context or it's not relevant, answer based on your knowledge but do mention that you couldn't find
        anything relevant in the resource.
        --------------------
        START CONTEXT
        ${docContext}
        END CONTEXT
        --------------------
        QUESTION: ${lastMessage}
        --------------------
        `}
        const response=await openai.chat.completions.create({
            stream:false,
            model:"gpt-4",
            messages:[template,...messages]
        })
        return Response.json({
            role:"assistant",
            content:response.choices[0].message.content
        })
    }
    catch(error:any){
        console.log(error.message)
        throw error;
    }

}
