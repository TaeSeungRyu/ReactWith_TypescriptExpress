
//http값이 없으면 붙여 주는 에노테이션 입니다.
function validateUrlString (target : any, key : string, desc : PropertyDescriptor) : any{
    const originCode = desc.value;
    desc.value = function(...args: any[]){
        if(args && args[0] && typeof args[0]  == 'string' ){
            let url : string = args[0];
            url = url.toLowerCase().trim();
            if(url.indexOf('http') != 0) args[0] = 'http://' + url;
        }
        return originCode.apply(this, args);        
    } 
    return desc;
}

export {validateUrlString}