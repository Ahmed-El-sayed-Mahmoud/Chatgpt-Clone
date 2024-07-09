import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDV6OxSzj-XnAD-DTXV4yd-TTO6QgHYKso"); // Replace with your actual API key
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
let chat = model.startChat({
    history: [],
    generationConfig: {
        maxOutputTokens: 500,
    },
});


const AiHelper = async (input,UpdateChatHistory,chatHistory, updateCallback) => { 
    if(UpdateChatHistory)
    {
        chat=model.startChat({
            history:chatHistory,
            generationConfig: {
                maxOutputTokens: 500,
            },
        })
    }
   
    try {
        console.log("Initializing Google Generative AI...");
        
 
        const result = await chat.sendMessageStream(input);
        
        for await (const chunk of result.stream) {

            console.log("Chunk received:", chunk);

            if (chunk && chunk.text) {
                const chunkText = chunk.text();
                console.log("callll baaaackckcckck")
               updateCallback(chunkText); 
            } else {
                console.warn("Received chunk without text property:", chunk);
            }
        }
        console.log(" real History",await chat.getHistory())
       // return (await chat.getHistory())
        //return 
    } catch (error) {
        console.error('Error creating chat completion:', error);
        throw error; 
    }
}

export { AiHelper };
