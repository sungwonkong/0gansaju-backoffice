import styled from "styled-components";
import { useEffect, useState } from "react";
import alchemyConfig from "config/api/alchemyConfig";
import {Network, Alchemy} from "alchemy-sdk"
import ReactPlayer from 'react-player'
import TradeChart from "./TradeChart"
import etherScanConfig from "../../config/api/etherScanConfig"
import util from "utils/util";

//컨트랙트 주소
const ContractAddress = alchemyConfig.fullhouseContract;

const Wrapper = styled.div`
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 2%;
`;

const settings = {
    apiKey : alchemyConfig.apiToken,
    network : Network.ETH_MAINNET,            
}
const alchemy = new Alchemy(settings);

const checkHolder = function(){
    alert(1);
}

const Dashboard = () => {
    /*=================================================================================
    데이터 정의
    =================================================================================*/

    const [FP, setFP] = useState(0);                            //바닥가
    const [holderCnt, setHolderCnt] = useState(0)               //홀더수
    const [totalCnt, setTotalCnt] = useState(0)                 //총 발행량
    const [token, setToken] = useState([]);                     //토큰의 총 정보
    const [renderAmount, setRenderAmount] = useState(3);        //한번에 보여줄 NFT 갯수

    const [collectionUrl, setCollectionUrl] = useState("");     //오픈시 콜렉션 URL
    const [collectionImg, setCollectionImg] = useState("");     //오픈시 콜렉션 대표이미지    
    const [openseaTradeCnt, setOpenseaTradeCnt] = useState(0);  //오픈시 거래수
    const [openseaTrade, setOpenseaTrade] = useState([]);       //오픈시 거래 상세 데이터(차트 원본 데이터)

    /*=================================================================================
    데이터 Fetch
    =================================================================================*/

    //오픈씨 거래내역
    async function getOpenseaTradeData(){
        const options = {method: 'GET', headers: {accept: 'application/json'}};

        const openseaTradeData = await fetch('https://eth-mainnet.g.alchemy.com/nft/v2/' +
                alchemyConfig.apiToken + 
                '/getNFTSales?fromBlock=0&toBlock=latest&order=asc&contractAddress='+ContractAddress, options)
            .then(response => response.json());
        
        setOpenseaTradeCnt(Object.keys(openseaTradeData.nftSales).length);      //총 거래횟수
        
        //거래 히스토리 데이터
        setOpenseaTrade([]);
        let timestamp : string;
        let blockNumber : number;
        let blockDate : Date;
        for(const key in openseaTradeData.nftSales){
            blockNumber = openseaTradeData.nftSales[key]['blockNumber'];
            timestamp = await fetch(etherScanConfig.api.getblockreward(blockNumber) + etherScanConfig.apiToken)
                            .then(response=>response.json());           //블록넘버를 받아서 타임스탬프로 변환
            timestamp = timestamp.result.timeStamp;
            //console.log(util.getDateToTimestamp(timestamp));
            setOpenseaTrade((prev) => {
                return[
                    ...prev,
                    {
                        x : util.getDateFromTimestamp(timestamp), //타임스탬프를 날짜로 변환
                        y : (Number(openseaTradeData.nftSales[key]['protocolFee']['amount']) + Number(openseaTradeData.nftSales[key]['sellerFee']['amount'])) / (10**18)
                    }
                ]});
        };        
        
    }

    //바닥가
    async function getFloorPrice(){        
         const resFP = await alchemy.nft.getFloorPrice(ContractAddress);
         //console.log(resFP);
         setFP(resFP.openSea.floorPrice);          
         setCollectionUrl(resFP.openSea.collectionUrl);
    }
    //홀더수
    async function getHolderCnt(){
        const resHolderCnt = await alchemy.nft.getOwnersForContract(ContractAddress);                     
        //console.log(resHolderCnt);
        setHolderCnt(Object.keys(resHolderCnt.owners).length);
    }
    //총데이터
    async function getOwnersForCollection(){
        const resOwnerForCollection = await alchemy.nft.getNftsForContract(ContractAddress);        
        setTotalCnt(Object.keys(resOwnerForCollection.nfts).length);               
        //데이터 넣기
        setToken([]);
        for(const key in resOwnerForCollection.nfts){
            setToken((prevNfts) => {
                return[
                    ...prevNfts,
                    {
                        title : resOwnerForCollection.nfts[key]['title'],
                        animationURL : resOwnerForCollection.nfts[key]['rawMetadata']['animation_url'],
                        id : resOwnerForCollection.nfts[key]['rawMetadata']['id'],
                        imageURL : resOwnerForCollection.nfts[key]['rawMetadata']['image'],
                    }                
                ]});
        };
        
        
    }


    /*=================================================================================
    화면 렌더링
    =================================================================================*/

    //Stat 그리기
    function RenderStat(){
        return(
            <>            
            <div className="stats shadow justify-center items-center">  
                <div className="stat">
                    <div className="avatar">                        
                        <div className="w-24 rounded-full">
                            <a href={collectionUrl} target='_blank' rel="noreferrer">
                                <img src={collectionImg} />
                            </a>
                        </div>                        
                    </div>
                </div>
                <div className="stat">
                    <div className="stat-figure text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </div>
                    <div className="stat-title">Total Quantity</div>
                    <div className="stat-value text-primary">{totalCnt}</div>                    
                </div>
                
                <div className="stat">
                    <div className="stat-figure text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <div className="stat-title">Holder Count</div>
                    <div className="stat-value text-secondary">{holderCnt}</div>                    
                </div>
                
                <div className="stat">
                    <div className="stat-figure">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                    </div>
                    <div className="stat-title">Floor Price</div>
                    <div className="stat-value">{FP} ETH</div>
                </div>

                <div className="stat">
                    <div className="stat-figure">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                    </div>
                    <div className="stat-title">Opensea<br/>Trade Cnt</div>
                    <div className="stat-value">{openseaTradeCnt}</div>
                </div>            
            </div>
            </>
        )
    }

    //NFT 그리기
    function RenderToken({token}:any){                 
        
        const urlNft = token.animationURL.replace(
            "ipfs://", ""
        ).replace(            
            "/", ".ipfs.w3s.link/"
        );
        
        const[hasWindow, setHasWindow] = useState(false);
        
        useEffect(()=>{
            if(typeof window !== "undefined"){
                setHasWindow(true);
            }
        },[]);

        return(
            <div className="flex flex-col justify-center items-center">
                <div className='player-wrapper rounded-lg overflow-hidden relative w-full'>
                    {hasWindow &&
                    <ReactPlayer
                        className='react-player rounded-lg overflow-hidden'
                        url={"https://"+urlNft}
                        width='300px'         // 플레이어 크기 (가로)
                        height='300px'        // 플레이어 크기 (세로)
                        playing={false}        // 자동 재생 on
                        muted={true}          // 자동 재생 on
                        controls={true}       // 플레이어 컨트롤 노출 여부
                        light={false}         // 플레이어 모드
                        pip={true}            // pip 모드 설정 여부                        
                        onLoad={() => console.log(token.tokenId, " : complete")}
                        onEnded={()=>{}}  // 플레이어 끝났을 때 이벤트
                        loading="lazy"
                    />
                    }
                </div>                
                <div className="flex w-full mt-7 font-montserrat text-[15px] text-[#949494] leading-loose">
                    {token.title}
                </div>                
            </div>
        )
    }

    //홀더체크 그리기
    function RenderHolderCheck(){
        const [address, setAddress] = useState("");

        const onChangeAddress = (e : any) => {
            setAddress(e.target.value);            
        };

        const checkHolder = async function(){            
            if(address.length != 42){
                alert("주소를 잘못 입력하였습니다. 정확한 주소를 입력해주세요.");
                return;
            }
            const isHolderRes = await alchemy.nft.checkNftOwnership(address,[ContractAddress]);
            
            if(isHolderRes){
                alert("해당 지갑은 홀더지갑입니다.");
            }else{
                alert("해당 지갑은 홀더지갑이 아닙니다");
            }
        };        

        return(            
            <div>
                <br/>
                <input onChange={onChangeAddress} id="checkHolder" type="text" placeholder="홀더체크 지갑주소" className="input input-bordered input-primary w-full max-w-xs" />
                <button className="btn btn-info" onClick={()=>{checkHolder();}}>체크</button>
                <br/>
            </div>
        )
    }

    /*=================================================================================
    useEffect
    =================================================================================*/

    useEffect(() => {
        getFloorPrice();
        getHolderCnt();
        getOwnersForCollection();     
        setToken([]);           
        setCollectionImg("https://i.seadn.io/gcs/files/0f6dde62210ee127a3ecf22250d91d12.png?auto=format&w=3840");   //이미지를 위해서 api를 돌리는것보다 하드코딩이 더 낫다고 판단.

        getOpenseaTradeData();
    }, []);
    

    /*=================================================================================
    
    =================================================================================*/

    return(
        <Wrapper>
            <RenderStat/>
            <RenderHolderCheck/>
            <TradeChart chartData={openseaTrade}/>
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
                  onClick={() => {setRenderAmount((prev) => prev + 3); window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });}}
                >View More</button>
              ) : (
                <></>
              )}
            </div>
        </Wrapper>
    )
};

export default Dashboard;