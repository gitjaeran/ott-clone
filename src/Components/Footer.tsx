import styled from "styled-components";

const Wrap = styled.div`
  width: 100%;
  margin-top: 200px;
  padding: 20px 30px;
`;

const Info = styled.div``;

function Footer() {
  return (
    <Wrap>
      <Info>Nomad Coder _ ReactJS Challenge</Info>
      <Info>2023.09.11</Info>
    </Wrap>
  );
}

export default Footer;
