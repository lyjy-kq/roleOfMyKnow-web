import {defineStore} from "pinia";
import {ref} from "vue";

//名字+函数
//返回值也是函数
export const useTokenStore=defineStore("token",()=>{
    const token=ref("")

    const setToken=(newToken)=>{
        token.value=newToken;
    }

    const removeToken=()=>{
        token.value="";
    }

    return{
        token,setToken,removeToken
    }
},
    {
        persist:true
    })
