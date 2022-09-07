import styled from 'styled-components';

import { EStatus } from 'shared/utils/statusLocales';

const StatusWrapper = styled.div<{ type?: EStatus }>`
  display: flex;
  align-items: center;
  padding: .281rem .375rem;
  border-radius: 4px;
  max-width: 50px;
  max-height: 24px;
  background-color: ${({ theme, type }) => {
    if (type === EStatus.Open) return theme.statusOpenBg;
    if (type === EStatus.Soon) return theme.statusSoonBg;
    return theme.statusEndedBg;
  }};

  color: ${({ theme, type }) => {
    if (type === EStatus.Open) return theme.statusOpenText;
    if (type === EStatus.Soon) return theme.statusSoonText;
    return theme.statusEndedText;
  }};
`;

const StatusText = styled.p`
  margin: 0;

  font-weight: 600;
  font-size: .75rem;
  line-height: .938rem;
`;

export default {
  StatusWrapper,
  StatusText,
};
