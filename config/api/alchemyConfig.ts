const alchemyConfig = {
  apiToken: "mrjNscmPU_Dw_4oaKuyfhDS46lFQYR-a",
  apiInterval: 10000,
  apiHttps:
    "https://eth-goerli.g.alchemy.com/v2/mrjNscmPU_Dw_4oaKuyfhDS46lFQYR-a",
  apiWebSockets:
    "wss://eth-goerli.g.alchemy.com/v2/mrjNscmPU_Dw_4oaKuyfhDS46lFQYR-a",
  api: {
    getNftsForContract: "getNftsForContract",
    getFloorPrice: "getFloorPrice", //바닥가
    getOwnersForContract: "getOwnersForContract", //홀더수 체크용
  },
  fullhouseContract: "0x7d4694af2b34f2c35120d2a5a03fcb83184c05ce",
  metakongzContract: "0x46FdfCb3Cd89A1C54D36EE83a4ADC184747B40D9",
  prismContract: "0x37229c935da44b02839dd02c7cd3f1b42567898d",

  nftContract: "0x67f3b379457478c1077b7e38a0e5aa12fbdcb035",
};

export default alchemyConfig;
