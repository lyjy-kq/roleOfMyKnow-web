import request from "@/tool/request.js"
export const getMatchService=(postData)=>{
    return  request.post('/advice',postData);
};
