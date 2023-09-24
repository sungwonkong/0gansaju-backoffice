import Web3 from "web3";
import dinoConfig from "config/contracts/dinoConfig";

declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
  interface TransactionParam {
    from?: string;
    to?: string;
    data?: string;
    gas?: number;
    value?: string;
  }
}

let _web3: any;
let DinoContract: any;

const web3 = {
  connect: async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  },
  getABI: () => {
    return dinoConfig.abi;
  },
  getAddress: () => {
    return dinoConfig.address;
  },
  init: async () => {
    _web3 = new Web3(window.ethereum);
    DinoContract = new _web3.eth.Contract(dinoConfig.abi, dinoConfig.address);
  },
  sendTransaction: async (
    name: string,
    stateMutability: string,
    inputs: string,
    contractName: string
  ) => {
    const CONTRACT = ((name_: string) => {
      name_ = name_.toUpperCase();

      switch (name_) {
        case "DINO":
          return "DinoContract";
        default:
          throw new Error("sendTransaction: Not Correct Contract Name");
      }
    })(contractName);

    const contractConfig = ((name_: string) => {
      name_ = name_.toUpperCase();

      switch (name_) {
        case "DINO":
          return dinoConfig;
        default:
          throw new Error("sendTransaction: Not Correct Contract Name");
      }
    })(contractName);

    try {
      switch (stateMutability) {
        case "view":
          console.log(`${CONTRACT}.methods.${name}(${inputs}).call()`);
          return await eval(`${CONTRACT}.methods.${name}(${inputs}).call()`);

        case "nonpayable":
        case "payable":
          console.log(`${CONTRACT}.methods.${name}(${inputs})`);

          const METHOD = eval(`${CONTRACT}.methods.${name}(${inputs})`);
          const params: TransactionParam = {
            from: window.ethereum.selectedAddress,
            to: contractConfig.address,
            data: METHOD.encodeABI(),
          };

          if (stateMutability === "payable") {
            params["value"] =
              "" +
              parseInt(inputs) *
                (await web3.sendTransaction("PRICE", "view", "", "DINO"));
          }

          const estimateGas: number = await METHOD.estimateGas(params);

          params["gas"] = Math.ceil(estimateGas * 1.2);

          console.log(params);
          return await _web3.eth.sendTransaction(params);

        default:
          alert("[ERROR] web3.ts:runTransaction");
          break;
      }
    } catch (e) {
      alert("[ERROR] web3.ts:runTransaction");
    }
  },
};

export default web3;
