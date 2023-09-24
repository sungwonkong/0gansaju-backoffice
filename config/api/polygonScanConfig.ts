const polygonScanConfig = {
  apiInterval: 10000,
  apiToken: "YE4S86HXRVQUNFUPX7XMT7S29BK191H5UU",
  api: {
    getblockreward: function (blockNumber: number) {
      const returnString =
        "https://api.polygonscan.com/api?module=block&action=getblockreward&blockno=" +
        blockNumber +
        "&apikey=" +
        polygonScanConfig.apiToken;
      return returnString;
    },
  },
};

export default polygonScanConfig;
