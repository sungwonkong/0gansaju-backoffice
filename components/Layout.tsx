import styled from "styled-components";
import Head from "next/head";
import { ReactNode, useEffect, useState } from "react";
import Header from "components/header/Header";
import SideBar from "components/sidebar/SideBar";
import web3 from "utils/web3";

interface LayoutProps {
  children?: ReactNode;
}

const Wrapper = styled.div`
  display: flex;
`;
const Contents = styled.div`
  width: 85vw;
`;

function Layout({ children }: LayoutProps) {
  const [loginText, setLoginText] = useState("Connect Wallet");

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
      <Head>
        <title>CJ-NFT</title>
        <link rel="icon" href="/CJ_Group_CI.jpg" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      <SideBar />

      <Contents>{children}</Contents>
      {/* If you have a FOOTER, please input here */}
    </Wrapper>
  );
}

export default Layout;
