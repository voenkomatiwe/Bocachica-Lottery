import React from 'react';
import styled from 'styled-components';

import { enforcer } from 'shared/utils';

interface IInputPanel {
  value: string;
  setValue: (value: string) => void;
}

const StyledInput = styled.input`
  width: 100%;
  outline: none;
  border: none;
  background: none;
  font-style: normal;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.188rem;
  color: ${({ theme }) => theme.black};
  transition: all 1s ease-out;
`;

export default function Input({ value, setValue }: IInputPanel) {
  return (
    <StyledInput
      value={value}
      onChange={(event) => enforcer(event.target, setValue)}
      inputMode="decimal"
      autoComplete="off"
      autoCorrect="off"
      type="text"
      pattern="^[0-9]*[.,]?[0-9]*$"
      placeholder="0.0"
      minLength={1}
      maxLength={79}
      spellCheck="false"
    />
  );
}
