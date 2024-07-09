import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
console.log("enviromnett",process.env.REACT_APP_GEMINI_API_KEY)
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const getBase64 = (file) => new Promise(function (resolve, reject) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject('Error: ', error);
    })
    async function fileToGenerativePart(file) {
        const base64EncodedDataPromise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            if(file)
            reader.readAsDataURL(file);
        });
    
        return {
            inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
        };
    }
    
    async function aiImageRun(msg,imageInineData,updateCallback) {
        try{
            const result = await model.generateContentStream([
                msg, imageInineData
            ]);
    
           
            //const text = response.text();
            //console.log(response.candidates[0].content.parts[0].text)
            for await (const chunk of result.stream) {

                console.log("Chunk received:", chunk.text());
    
                if (chunk && chunk.text) {
                    const chunkText = chunk.text();
                    console.log("callll baaaackckcckck")
                   updateCallback(chunkText); 
                } else {
                    console.warn("Received chunk without text property:", chunk);
                }
            }
        }
        catch(error)
        {

        }
        
    }
    /* const handleClick = () => {
        aiImageRun()
    } */
    
    /* const handleImageChange = (e) => {
       const file = e.target.files[0];
  getBase64(file)
      .then((result) => {
          setImage(result);
      })
      .catch(e => console.log(e))

  fileToGenerativePart(file).then((image) => {
      setImageInlineData(image);
  });
    } */
   export{getBase64,fileToGenerativePart,aiImageRun}
    

