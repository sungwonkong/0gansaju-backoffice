import etherScanConfig from "config/api/etherScanConfig";
import alchemyConfig from "config/api/alchemyConfig";
import {Network, Alchemy} from "alchemy-sdk"

const api = {    
    //이더 가격 API
    getEtherPrice : async () =>{                
        try{
            const data = await fetch(etherScanConfig.api.getEtherPrice + etherScanConfig.apiToken)
                            .then(response => response.json())       
            //console.log(data.result);
            return data.result;
        }catch(e){
            console.log(e);
            alert("[ERROR] ehterScanAPI: getEtherPrice")
        }                     
    },
    //이더 가스 API
    getEtherGas : async () =>{
        try{
            const data = await fetch(etherScanConfig.api.getEtherGas + etherScanConfig.apiToken)
                            .then(response => response.json())       
            //console.log(data.result);
            return data.result;
        }catch(e){
            console.log(e);
            alert("[ERROR] ehterScanAPI: getEtherGas")
        } 
    },    

}

export default api