import { DataAPIClient } from "@datastax/astra-db-ts";


const {OPENAI_API_KEY,ASTRA_DB_NAMESPACE,ASTRA_DB_PDF_COLLECTION,ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_TOKEN,
}=process.env

const client=new DataAPIClient(ASTRA_DB_TOKEN)
const db=client.db(ASTRA_DB_API_ENDPOINT as string,{namespace:ASTRA_DB_NAMESPACE})

export async function GET(req:Request){
    const pdfCollection=db.collection(ASTRA_DB_PDF_COLLECTION as string)

    const cursor=pdfCollection.find({},{
        limit:10
    })

    const pdf_array=await cursor.toArray();
    console.log(pdf_array)
    return Response.json({pdf_array})
}