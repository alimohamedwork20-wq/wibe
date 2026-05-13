import styled from "styled-components";

export const ImageProfile = styled.div`
  width: ${(props) => props.size || "120px"};
  height: ${(props) => props.size || "120px"};
  background: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${(props) => props.fontSize || "3rem"};
  font-weight: 900;
  color: #000;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
  }
`;
export default ImageProfile;
