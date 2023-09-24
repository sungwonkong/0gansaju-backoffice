import styled from "styled-components";
import { useEffect, useState } from "react";
import alchemyConfig from "config/api/alchemyConfig";
import { Network, Alchemy } from "alchemy-sdk";
import ReactPlayer from "react-player";
import TradeChart from "./TradeChart";
import polygonScanConfig from "config/api/polygonScanConfig";
import util from "utils/util";
import fs from "fs";

//컨트랙트 주소
const ContractAddress: string = alchemyConfig.prismContract;
const viewableTopHolder: number = 10;

const Wrapper = styled.div`
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 2%;
`;

const settings = {
  apiKey: alchemyConfig.apiToken,
  network: Network.MATIC_MAINNET, //polygon mainnet setting
};
const alchemy = new Alchemy(settings);

const palaWallet = "0x130f5c65cc7191E567848f1152B503547C1644C9";

const Dashboard = () => {
  /*=================================================================================
    데이터 정의
    =================================================================================*/

  const [FP, setFP] = useState(0); //바닥가
  const [lastPrice, setLastPrice] = useState(0); //last sales price
  const [holderCnt, setHolderCnt] = useState(0); //홀더수
  const [topHolder, setTopHolder] = useState([]); //top Holder
  const [palaHolder, setPalaHolder] = useState(0); //pala holder
  const [totalCnt, setTotalCnt] = useState(0); //총 발행량
  const [token, setToken] = useState([]); //토큰의 총 정보
  const [renderAmount, setRenderAmount] = useState(3); //한번에 보여줄 NFT 갯수

  const [collectionUrl, setCollectionUrl] = useState(""); //오픈시 콜렉션 URL
  const [collectionImg, setCollectionImg] = useState(""); //오픈시 콜렉션 대표이미지
  const [openseaTradeCnt, setOpenseaTradeCnt] = useState(0); //오픈시 거래수
  const [openseaTrade, setOpenseaTrade] = useState([]); //오픈시 거래 상세 데이터(차트 원본 데이터)
  const options = { method: "GET", headers: { accept: "application/json" } };
  /*=================================================================================
    데이터 Fetch
    =================================================================================*/

  //오픈씨 거래내역
  async function getOpenseaTradeData() {
    const openseaTradeData = await fetch(
      "https://polygon-mainnet.g.alchemy.com/nft/v2/" +
        alchemyConfig.apiToken +
        "/getNFTSales?fromBlock=47165600&toBlock=latest&order=asc&contractAddress=" +
        ContractAddress,
      options
    ).then((response) => response.json());

    const palaTradeData = await fetch(
      "https://polygon.api.pala.world/v3/histories?token_transaction_history_types=sale&token_history_types=sale&project_contract_address=0x37229c935da44b02839dd02c7cd3f1b42567898d&token_id=&page=1",
      options
    ).then((response) => response.json());

    let totalCnt = Object.keys(openseaTradeData.nftSales).length;
    setOpenseaTradeCnt(totalCnt); //총 거래횟수

    //거래 히스토리 데이터
    setOpenseaTrade([]);
    let timestamp: string;
    let blockNumber: number;

    for (const key in openseaTradeData.nftSales) {
      blockNumber = openseaTradeData.nftSales[key]["blockNumber"];
      timestamp = await fetch(
        polygonScanConfig.api.getblockreward(blockNumber)
      ).then((response) => response.json()); //블록넘버를 받아서 타임스탬프로 변환
      timestamp = timestamp.result.timeStamp;
      console.log(util.getDateFromTimestamp(timestamp));
      setOpenseaTrade((prev) => {
        return [
          ...prev,
          {
            x: util.getDateFromTimestamp(timestamp), //타임스탬프를 날짜로 변환
            y:
              (Number(openseaTradeData.nftSales[key]["protocolFee"]["amount"]) +
                Number(openseaTradeData.nftSales[key]["sellerFee"]["amount"])) /
              10 ** 18,
          },
        ];
      });

      //최종 판매가격 셋팅
      // if (Number(key) === totalCnt) {
      //   setLastPrice(
      //     (Number(openseaTradeData.nftSales[key]["protocolFee"]["amount"]) +
      //       Number(openseaTradeData.nftSales[key]["sellerFee"]["amount"])) /
      //       10 ** 18
      //   );
      // }
    }

    let palaTradeDataJson: [] = palaTradeData.items;
    for (const key in palaTradeDataJson) {
      palaTradeDataJson[key].timestamp = palaTradeDataJson[key].timestamp.slice(
        0,
        19
      );
    }
    //console.log(palaTradeData.items);
    palaTradeDataJson = util.sortJSON(palaTradeDataJson, "timestamp", "asc");

    for (const key in palaTradeDataJson) {
      setOpenseaTrade((prev) => {
        return [
          ...prev,
          {
            x: palaTradeDataJson[key].timestamp, //타임스탬프를 날짜로 변환
            y: Number(palaTradeDataJson[key]["price"]) / 10 ** 18,
          },
        ];
      });

      // console.log(openseaTrade);

      //최종 판매가격 셋팅
      if (Number(key) === totalCnt) {
        setLastPrice(Number(palaTradeDataJson[key]["price"]) / 10 ** 18);
      }
    }
  }

  //바닥가 - API doesn't support polygon mainnet : change to last sale price
  async function getFloorPrice() {
    const resFP = await alchemy.nft.getFloorPrice(ContractAddress);

    setFP(resFP.openSea.floorPrice);
    setCollectionUrl(resFP.openSea.collectionUrl);
  }
  //홀더수
  async function getHolderCnt() {
    const resHolderCnt = await alchemy.nft.getOwnersForContract(
      ContractAddress
    );

    setHolderCnt(Object.keys(resHolderCnt.owners).length);
  }
  //총데이터
  async function getOwnersForCollection() {
    const resOwnerForCollection = await alchemy.nft.getNftsForContract(
      ContractAddress
    );
    setTotalCnt(
      Number(resOwnerForCollection.nfts[0]["contract"]["totalSupply"])
    );
    //데이터 넣기
    setToken([]);

    for (const key in resOwnerForCollection.nfts) {
      if (resOwnerForCollection.nfts[key]["title"] == "") continue;
      setToken((prevNfts) => {
        return [
          ...prevNfts,
          {
            title: resOwnerForCollection.nfts[key]["title"],
            animationURL:
              resOwnerForCollection.nfts[key]["rawMetadata"]["animation_url"],
            id: resOwnerForCollection.nfts[key]["rawMetadata"]["id"],
            imageURL: resOwnerForCollection.nfts[key]["rawMetadata"]["image"],
          },
        ];
      });
    }
  }

  //TOP Holder check
  async function getTopHolder() {
    const testContractAddress = "0xef6708d42b0bd54a809d5bdb3e86abc6f4331de5";
    let compareJson: any = [];

    const response = await fetch(
      "https://polygon-mainnet.g.alchemy.com/nft/v3/" +
        alchemyConfig.apiToken +
        "/getOwnersForContract?contractAddress=" +
        ContractAddress +
        //testContractAddress +
        "&withTokenBalances=true",
      options
    ).then((response) => response.json());

    const palaJson: any = []; //팔라 지갑은 따로 표시

    for (const key in response.owners) {
      if (
        response.owners[key]["ownerAddress"] ===
        "0x0000000000000000000000000000000000000000"
      ) {
        //address: response.owners[key]["ownerAddress"],
        // setPalaHolder(
        //   Object.keys(response.owners[key]["tokenBalances"]).length
        // );
      } else {
        compareJson.push({
          address: response.owners[key]["ownerAddress"],
          balance: Object.keys(response.owners[key]["tokenBalances"]).length,
        });
      }
    }
    //sort top balancer
    compareJson.sort(function (a: any, b: any) {
      return a.balance < b.balance ? 1 : a.balance > b.balance ? -1 : 0;
    });
    setTopHolder(compareJson.slice(0, viewableTopHolder));
  }

  /*=================================================================================
    화면 렌더링
    =================================================================================*/

  //Stat 그리기
  function RenderStat() {
    return (
      <>
        <div className="stats shadow justify-center items-center">
          <div className="stat">
            <div className="avatar">
              <div className="w-24 rounded-full">
                <a href={collectionUrl} target="_blank" rel="noreferrer">
                  <img src={collectionImg} />
                </a>
              </div>
            </div>
          </div>
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Total Quantity</div>
            <div className="stat-value text-primary">{totalCnt}</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Holder Count</div>
            <div className="stat-value text-secondary">{holderCnt}</div>
          </div>

          <div className="stat">
            <div className="stat-figure">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Last Sale Price</div>
            <div className="stat-value">{lastPrice} MATIC</div>
          </div>

          <div className="stat">
            <div className="stat-figure">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                ></path>
              </svg>
            </div>
            <div className="stat-title">
              Opensea
              <br />
              Trade Cnt
            </div>
            <div className="stat-value">{openseaTradeCnt}</div>
          </div>
        </div>
      </>
    );
  }

  function RenderRank({ data }: any) {
    const rank = Number(data.number) + 1;
    const walletAddr = data.address;
    const quantity = data.balance;
    return (
      <>
        <th>{rank}</th>
        <td>{walletAddr}</td>
        <td>{quantity}</td>
      </>
    );
  }

  //NFT 그리기
  function RenderToken({ token }: any) {
    const urlNft = token.animationURL;
    //   .replace("ipfs://", "")
    //   .replace("/", ".ipfs.w3s.link/");

    const [hasWindow, setHasWindow] = useState(false);

    useEffect(() => {
      if (typeof window !== "undefined") {
        setHasWindow(true);
      }
    }, []);

    return (
      <div className="flex flex-col justify-center items-center">
        <div className="player-wrapper rounded-lg overflow-hidden relative w-full">
          {hasWindow && (
            <ReactPlayer
              className="react-player rounded-lg overflow-hidden"
              url={urlNft}
              width="300px" // 플레이어 크기 (가로)
              height="300px" // 플레이어 크기 (세로)
              playing={true} // 자동 재생 on
              muted={true} // 소리재생 Off
              controls={false} // 플레이어 컨트롤 노출 여부
              light={false} // 플레이어 모드
              pip={true} // pip 모드 설정 여부
              onLoad={() => console.log(token.tokenId, " : complete")}
              onEnded={() => {}} // 플레이어 끝났을 때 이벤트
              loading="lazy"
              loop={true}
            />
          )}
        </div>
        <div className="flex w-full mt-7 font-montserrat text-[15px] text-[#949494] leading-loose">
          {token.title}
        </div>
      </div>
    );
  }

  //홀더체크 그리기
  function RenderHolderCheck() {
    const [address, setAddress] = useState("");

    const onChangeAddress = (e: any) => {
      setAddress(e.target.value);
    };

    const checkHolder = async function () {
      if (address.length != 42) {
        alert("주소를 잘못 입력하였습니다. 정확한 주소를 입력해주세요.");
        return;
      }
      const isHolderRes = await alchemy.nft.checkNftOwnership(address, [
        ContractAddress,
      ]);

      if (isHolderRes) {
        alert("해당 지갑은 홀더지갑입니다.");
      } else {
        alert("해당 지갑은 홀더지갑이 아닙니다");
      }
    };

    return (
      <div>
        <br />
        <input
          onChange={onChangeAddress}
          id="checkHolder"
          type="text"
          placeholder="홀더체크 지갑주소"
          className="input input-bordered input-primary w-full max-w-xs"
        />
        <button
          className="btn btn-info"
          onClick={() => {
            checkHolder();
          }}
        >
          체크
        </button>
        <br />
      </div>
    );
  }

  /*=================================================================================
    useEffect
    =================================================================================*/

  useEffect(() => {
    //getFloorPrice();
    getHolderCnt();
    getOwnersForCollection();
    setToken([]);
    setCollectionImg(
      "https://i.seadn.io/gcs/files/33495e7651b7ea0382ddfba87b37a93b.jpg?auto=format&w=3840"
    ); //이미지를 위해서 api를 돌리는것보다 하드코딩이 더 낫다고 판단.

    getOpenseaTradeData();
    getTopHolder();
    setCollectionUrl("https://opensea.io/collection/prism-one-membership");
    //console.log(palaHolder);
  }, []);

  /*=================================================================================
    
    =================================================================================*/

  return (
    <Wrapper>
      <RenderStat />
      <RenderHolderCheck />
      <div className="overflow-x-auto">
        <br />
        <div className="badge badge-primary badge-lg">Top Holder</div>
        {/* pala Wallet : {palaHolder} */}
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th>Rank</th>
              <th>Wallet Address</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {topHolder.map((d: any, i) => {
              d.number = i;
              return (
                <tr key={d.address}>
                  <RenderRank data={d} />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <TradeChart chartData={openseaTrade} />
      <div className="grid grid-cols-3 w-full gap-5 mt-16 mb-10 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3">
        {token.map((d: any, i) => {
          const name = d.title;
          return i < renderAmount ? (
            <div key={name}>
              <RenderToken token={d} />
            </div>
          ) : (
            <div key={name} className="absolute top-0"></div>
          );
        })}
      </div>

      <div className="mb-40 w-full flex justify-center">
        {renderAmount < totalCnt ? (
          <button
            onClick={() => {
              setRenderAmount((prev) => prev + 3);
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              });
            }}
          >
            View More
          </button>
        ) : (
          <></>
        )}
      </div>
    </Wrapper>
  );
};

export default Dashboard;
