import styled from 'styled-components';

import { ReactComponent as WalletImage } from 'assets/images/icons/wallet.svg';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 3.25rem .5rem;
`;

const WalletInformation = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 400;
  font-size: 0.75rem;
  line-height: .875rem;
`;

const LogoWallet = styled(WalletImage)`
  margin-right: 0.438rem;
  width: 16px;
  height: 12px;
  fill: ${({ theme }) => theme.gray}
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: .75rem;
  border: 1px solid ${({ theme }) => theme.lightPink};
  border-radius: 8px;
  max-width: 232px;
  margin: 0 1rem;
  transition: box-shadow .2s, border .2s;
  :focus-within, hover {
    border: 1px solid ${({ theme }) => theme.pink};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.boxShadowInput};
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 100%;
  `}
`;

const LogoToken = styled.img`
  height: 1.5rem;
  width: 1.5rem;
  margin-right: .75rem;
  border-radius: 50%;
  box-shadow: 0px 2px 4px ${({ theme }) => theme.blackOp015};
`;

const TokenContainer = styled.div`
  flex: 1;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.188rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: .6rem;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Minus = styled.div`
  cursor: pointer;
  display: flex;
  width: 24px;
  height: 24px;
  background-color: ${({ theme }) => theme.lightPink};
  border-radius: 50%;
  position: relative;
  ::after{
    content: '';
    position: absolute;
    width: 14px;
    height: 2px;
    background-color: ${({ theme }) => theme.pink};
    border-radius: 12px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  :hover {
    background: ${({ theme }) => theme.lightPinkHover};
  }
  :active {
    background: ${({ theme }) => theme.lightPinkActive};
  }
`;

const Plus = styled.div`
  cursor: pointer;
  display: flex;
  width: 24px;
  height: 24px;
  background-color: ${({ theme }) => theme.lightPink};
  border-radius: 50%;
  position: relative;
  ::before{
    content: '';
    position: absolute;
    width: 14px;
    height: 2px;
    background-color: ${({ theme }) => theme.pink};
    border-radius: 12px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    transform: rotate(90deg);
  }
  ::after{
    content: '';
    position: absolute;
    width: 14px;
    height: 2px;
    background-color: ${({ theme }) => theme.pink};
    border-radius: 12px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  :hover {
    background: ${({ theme }) => theme.lightPinkHover};
  }
  :active {
    background: ${({ theme }) => theme.lightPinkActive};
  }
`;

export default {
  Container,
  InputLabel,
  WalletInformation,
  LogoWallet,
  InputContainer,
  LogoToken,
  TokenContainer,
  InputWrapper,
  Minus,
  Plus,
};
