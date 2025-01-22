import request from "@/tool/request.js"

export const getChinaAvgService=()=>{
    return  request.get('/overall/provinceAvg');
};
export const getProvinceDataService=(params)=>{
    return  request.get('/overall/province',{params:{provinceName:params}});
};
export const getQualificationSalaryService=()=>{
    return  request.get('/overall/qualification');
};
export const getMajor=(company)=>{
    return request.post('/companyMajor', company).then(response => {
        return response.data; // 返回 response.data
    })
};
export const getExpSalaryService=()=>{
    return  request.get('/overall/experience');
};
export const getSectionService=()=>{
    return  request.get('/overall/field');
};
export const getNatureService=()=>{
    return  request.get('/overall/ep-nature');
};
export const getEducationService = (postData) => {
    return request.post('/all', postData).then(response => {
        return response.data;
    })

};

export const getCompanyService=(postData)=>{
    const params=new URLSearchParams()
    params.append('type',postData['type']);
    return  request.post('companydescription',params);
};

export const getDescriptionService=()=>{
    return  request.get('/getDescription');
};
export const getDomainService=()=>{
    return  request.get('/all/domain');
};
export const getResponseService=()=>{
    return  request.get('/all/response');
};

//---------能力趋势图表
export const getAbilityService=(postData)=>{
    return  request.post('/trend/ability',postData).then(response => {
        return response.data; // 返回 response.data
    })
};



