const etherScanConfig = {
    apiInterval : 10000,
    apiToken : "FK3WZERR9HASB3YY3K1E1B3KAPTMTUCESP",
    api :{
        getEtherPrice : "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=",
        getEtherGas   : "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=",
        getblockreward : function (blockNumber : number){
            const returnString = 'https://api.etherscan.io/api?module=block&action=getblockreward&blockno=' + blockNumber + '&apikey='
            return returnString;
        },
    }
};

export default etherScanConfig;
