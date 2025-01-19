import request from "@/tool/request.js";

export const userRegisterService =(registerData)=>{
   // 借助urlSearchParams传递
    const params=new URLSearchParams()
    for(let key in registerData){
        params.append(key,registerData[key]);
    }
    return  request.post('/user/register', params);
}

export const userLoginService=(loginData)=>{
    const params=new URLSearchParams()
    for(let key in loginData){
        params.append(key,loginData[key]);
    }
    return  request.post('/user/login',params);
}