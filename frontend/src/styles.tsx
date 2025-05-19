import styled from "@emotion/styled";
import { Global, css } from "@emotion/react";

// Global styles
export const GlobalStyles = () => (
  <Global
    styles={css`
      * {
        font-family: 'Bookman Old Style', serif;
        font-size: 12px;
      }
      body {
        margin: 0;
      }
    `}
  />
);
export const BoxContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  // margin-top: 50px;
    font-family: 'Bookman Old Style', serif; /* Add this */
font-size: 15px;
`;

export const FormContainer = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 2.5px rgba(15, 15, 15, 0.19);
    font-family: 'Bookman Old Style', serif; /* Add this */
font-size: 15px;
`;

export const MutedLink = styled.a`
  font-size: 15px;
  color: rgba(200, 200, 200, 0.8);
  font-weight: 500;
  text-decoration: none;
    font-family: 'Bookman Old Style', serif; /* Add this */

`;

export const BoldLink = styled.a`
  font-size: 15px;
  color: rgb(241, 196, 15);
  font-weight: 500;
  text-decoration: none;
  margin: 0 4px;
    font-family: 'Bookman Old Style', serif; /* Add this */

`;

export const Input = styled.input`
  width: 100%;
  height: 42px;
  outline: none;
  border: 1px solid rgba(200, 200, 200, 0.3);
  padding: 0px 10px;
  border-bottom: 1.4px solid transparent;
  transition: all 200ms ease-in-out;
  font-size: 15px;
  font-family: 'Bookman Old Style', serif; /* Add this */

  &::placeholder {
    color: rgba(200, 200, 200, 1);
  }

  &:not(:last-of-type) {
    border-bottom: 1.5px solid #5046e5;
  }

  &:focus {
    outline: none;
    border-bottom: 2px solid #5046e5;
  }
`;

// export const SubmitButton = styled.button`
//   width: 100%;
//   padding: 11px 40%;
//   color: #fff;
//   font-size: 15px;
//   font-weight: 600;
//   border: none;
//   border-radius: 100px 100px 100px 100px;
//   cursor: pointer;
//   transition: all, 240ms ease-in-out;
//   background: rgb(241, 196, 15);
// //  font-family: 'Bookman Old Style', serif; /* Add this */

//   background: linear-gradient(
//     58deg,
//     #5046e5 20%,
//     #5046e5 100%
//   );

//   &:hover {
//     filter: brightness(1.03);
//   }
// `;