import styled from 'styled-components';

const Primary = styled.button<{ isActive?: boolean }>`
  cursor: pointer;
  outline: none;
  border: none;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  padding: 0 .5rem;

  font-weight: 600;
  font-size: 1rem;
  line-height: 1.188rem;

  max-height: 48px;
  min-height: 36px;
  color: ${({ theme, isActive }) => (isActive ? theme.pink : theme.white)};
  background-color: ${({ theme, isActive }) => (isActive ? theme.lightPink : theme.pink)};

  :hover {
    background-color: ${({ theme, isActive }) => (isActive ? theme.lightPinkHover : theme.pinkHover)};
  }
  :active {
    background-color: ${({ theme, isActive }) => (isActive ? theme.lightPinkActive : theme.pinkActive)};
  }
  :disabled{
    cursor: default;
    background-color: ${({ theme }) => theme.grayOp04};
  }
`;

const ConnectedButton = styled(Primary)<{ isSignedIn?: boolean }>`
  background-color: ${({ theme, isSignedIn }) => (isSignedIn ? theme.darkPink : theme.pink)};
  :hover {
    background-color: ${({ theme, isSignedIn }) => (isSignedIn ? theme.darkPinkHv : theme.pinkHover)};
  }
  :active {
    background-color: ${({ theme, isSignedIn }) => (isSignedIn ? theme.darkPinkActive : theme.pinkActive)};
  }
  :disabled{
    cursor: default;
    background: ${({ theme }) => theme.grayOp04};
  }
`;

const Secondary = styled(Primary)`
  color: ${({ theme }) => theme.pink};
  background-color: ${({ theme }) => theme.lightPink};

  :hover {
    background-color: ${({ theme }) => theme.lightPinkHover};
  }
  :active {
    background-color: ${({ theme }) => theme.lightPinkActive};
  }
  :disabled{
    cursor: default;
    background-color: ${({ theme }) => theme.grayOp04};
  }
`;

export default {
  Primary,
  Secondary,
  ConnectedButton,
};
