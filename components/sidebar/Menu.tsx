import styled from "styled-components";

interface MenuProps {
  title: string;
  url?: string;
}

const Wrapper = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Title = styled.p`
  color: #eeeeee;
  font-weight: bold;
  text-transform: uppercase;
`;

function Menu({ title, url }: MenuProps) {
  const menuClick = () => {};
  return (
    <Wrapper href={url}>
      <Title>{title}</Title>
    </Wrapper>
  );
}

export default Menu;
