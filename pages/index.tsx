import type { NextPage } from "next";
import { useEffect, useState } from "react";
import styled from "styled-components";
import web3 from "utils/web3";
import etherScanConfig from "config/api/etherScanConfig";

const Wrapper = styled.div`
  height: 100vh;

  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 3%;
`;

const ConnectBtn = styled.button`
  width: 18vw;
  height: 7vh;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #004700;
  background-color: #fff;
  border: none;
  border-radius: 60px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
  margin-top: 5vh;
  &:hover {
    background-color: #004700;
    box-shadow: 0px 15px 20px #888999;
    color: #fff;
    transform: translateY(-7px);
  }
`;

const BordContextEthPrice = (props: any) => {
  return (
    <div className="w-full md:w-1/2 xl:w-1/3 p-6">
      <div className="bg-white border-transparent rounded-lg shadow-xl">
        <div className="bg-gradient-to-b from-gray-300 to-gray-100 uppercase text-gray-800 border-b-2 border-gray-300 rounded-tl-lg rounded-tr-lg p-2">
          <h2 className="font-bold uppercase text-gray-600">
            Current ETH PRICE
          </h2>
        </div>
        <div className="p-5">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">ETH/USD</div>
              <div
                className="stat-value text-primary"
                style={{ fontSize: "1.5rem" }}>
                $
                <span className="countdown font-mono text-1xl">
                  <span style={{ "--value": props.digitPrice.digit0 }}></span>
                  <span style={{ "--value": props.digitPrice.digit1 }}></span>.
                  <span style={{ "--value": props.digitPrice.digit3 }}></span>
                </span>
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">ETH/BTC</div>
              <div
                className="stat-value text-primary"
                style={{ fontSize: "1.5rem" }}>
                <span className="countdown font-mono text-1xl">
                  0.
                  <span
                    style={{ "--value": props.digitPricebtc.digit0 }}></span>
                  <span
                    style={{ "--value": props.digitPricebtc.digit1 }}></span>
                  <span
                    style={{ "--value": props.digitPricebtc.digit2 }}></span>
                </span>
                &nbsp;BTC
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BordContextEthGas = (props: any) => {
  return (
    <div className="w-full md:w-1/2 xl:w-1/3 p-6">
      <div className="bg-white border-transparent rounded-lg shadow-xl">
        <div className="bg-gradient-to-b from-gray-300 to-gray-100 uppercase text-gray-800 border-b-2 border-gray-300 rounded-tl-lg rounded-tr-lg p-2">
          <h2 className="font-bold uppercase text-gray-600">Current GAS FEE</h2>
        </div>
        <div className="stats stats-vertical shadow">
          <div className="stat">
            <div className="stat-title">😚Base</div>
            <div className="stat-value" style={{ color: "green" }}>
              <span className="countdown font-mono text-1xl">
                <span
                  style={{
                    "--value": Math.floor(Number(props.gasfee.suggestBaseFee)),
                  }}></span>
              </span>
              &nbsp; gwei
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">😃Safe</div>
            <div className="stat-value" style={{ color: "blue" }}>
              <span className="countdown font-mono text-1xl">
                <span
                  style={{
                    "--value": Math.floor(Number(props.gasfee.SafeGasPrice)),
                  }}>
                  {" "}
                </span>
              </span>
              &nbsp; gwei
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">🙂Fast</div>
            <div className="stat-value" style={{ color: "red" }}>
              <span className="countdown font-mono text-1xl">
                <span
                  style={{
                    "--value": Math.floor(Number(props.gasfee.FastGasPrice)),
                  }}>
                  {" "}
                </span>
              </span>
              &nbsp; gwei
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const [loginText, setLoginText] = useState("Connect Wallet");

  const [price, setPrice] = useState({
    ethusd: 0,
    ethbtc: 0,
  });
  const [digitPrice, setDigitPirce] = useState({
    digit0: 0,
    digit1: 0,
    digit2: "",
    digit3: 0,
  });
  const [digitPricebtc, setDigitPircebtc] = useState({
    digit0: 0,
    digit1: 0,
    digit2: 0,
  });
  const [gasfee, setGasfee] = useState({
    suggestBaseFee: 0,
    SafeGasPrice: 0,
    FastGasPrice: 0,
  });

  const getEtherAPI = async () => {
    //이더 가격 API
    try {
      const data = await fetch(
        etherScanConfig.api.getEtherPrice + etherScanConfig.apiToken,
      ).then((response) => response.json());

      //console.log(data.result.ethusd + " / " + data.result.ethbtc)
      setPrice({
        ...price,
        ethusd: data.result.ethusd,
        ethbtc: data.result.ethbtc,
      });

      const digitPriceNumber = [...data.result.ethusd.toString()];
      const digitPricebtcNumber = [...data.result.ethbtc.toString()];

      if (!digitPriceNumber[5]) digitPriceNumber[5] = "0"; //소숫점이 없을경우를 보전
      if (!digitPriceNumber[6]) digitPriceNumber[6] = "0"; //소숫점이 없을경우를 보전
      if (!digitPricebtcNumber[7]) digitPricebtcNumber[7] = "0"; //소숫점이 없을경우를 보전
      setDigitPirce({
        ...digitPrice,
        digit0: Number(digitPriceNumber[0] + digitPriceNumber[1]),
        digit1: Number(digitPriceNumber[2] + digitPriceNumber[3]),
        digit2: digitPriceNumber[4], //소숫점
        digit3: Number(digitPriceNumber[5] + digitPriceNumber[6]),
      });
      setDigitPircebtc({
        ...digitPricebtc,
        digit0: Number(digitPricebtcNumber[2] + digitPricebtcNumber[3]),
        digit1: Number(digitPricebtcNumber[4] + digitPricebtcNumber[5]),
        digit2: Number(digitPricebtcNumber[6] + digitPricebtcNumber[7]),
      });
    } catch (e) {
      console.log(e);
      console.log("[ERROR] ehterScanAPI: getEtherAPI");
    }
  };

  const getEtherGas = async () => {
    //가스비 API
    try {
      const data2 = await fetch(
        etherScanConfig.api.getEtherGas + etherScanConfig.apiToken,
      ).then((response) => response.json());

      //console.log(data2.result.suggestBaseFee + " / " + data2.result.SafeGasPrice + " / " + data2.result.FastGasPrice);
      setGasfee({
        ...gasfee,
        suggestBaseFee: data2.result.suggestBaseFee,
        SafeGasPrice: data2.result.SafeGasPrice,
        FastGasPrice: data2.result.FastGasPrice,
      });
    } catch (e) {
      console.log(e);
      console.log("[ERROR] ehterScanAPI: getEtherGas");
    }
  };
  useEffect(() => {
    getEtherAPI();
    getEtherGas();

    // if (window.ethereum.selectedAddress !== undefined) {
    //   login();
    //   console.log(window.ethereum.selectedAddress);
    // }

    setInterval(getEtherAPI, etherScanConfig.apiInterval);
    setInterval(getEtherGas, etherScanConfig.apiInterval);

    return () => {
      clearInterval(1000);
    };
  }, []);

  const login = async () => {
    const userAddress: string = await web3.connect();
    const shortAddress =
      userAddress.substring(0, 5) +
      "..." +
      userAddress.substring(userAddress.length - 5);
    setLoginText(shortAddress);
  };

  return (
    <Wrapper>
      <div
        id="main"
        className="main-content flex-1 bg-gray-100 mt-12 md:mt-2 pb-24 md:pb-5">
        <div className="bg-gray-800 pt-3">
          <div className="rounded-tl-3xl bg-gradient-to-r from-blue-900 to-gray-800 p-4 shadow text-2xl text-white">
            <h1 className="font-bold pl-2">HOME</h1>
          </div>
        </div>

        <ConnectBtn onClick={login}>{loginText}</ConnectBtn>

        <div className="flex flex-row flex-wrap flex-grow mt-2">
          <BordContextEthPrice
            price={price}
            digitPrice={digitPrice}
            digitPricebtc={digitPricebtc}
          />

          <BordContextEthGas gasfee={gasfee} />
        </div>
      </div>
    </Wrapper>
  );
};

export default Home;
