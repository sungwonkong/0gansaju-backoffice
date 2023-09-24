import Backoffice from "components/backoffice/Backoffice";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-top:3%;
`;
const Container = styled.div``;
const Br = styled.div`
  height: 5%;
`;


function fullhouse() {
    return (
        <Wrapper>
          <Container>        
            <div className="bg-gray-800 pt-3">
                <div className="rounded-tl-3xl bg-gradient-to-r from-blue-900 to-gray-800 p-4 shadow text-2xl text-white">
                    <h1 className="font-bold pl-2">BACK OFFICE</h1>
                </div>
            </div>
            <Backoffice/>
            <Br />
          </Container>
        </Wrapper>
      );
}

export default fullhouse;