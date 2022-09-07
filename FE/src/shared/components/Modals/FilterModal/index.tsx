import { useState } from 'react';

import Buttons from 'shared/components/Buttons';
import ModalWrapper from 'shared/components/Modals/ModalWrapper';
import Translate from 'shared/components/Translate';
import { EDimensions } from 'shared/constant';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';
import { IFilter } from 'shared/interfaces';
import { toArray, lowerCaseExceptFirst } from 'shared/utils';
import { EFilterByStatus, EFilterByParticipation, EFilterByResult } from 'shared/utils/filterAuctions';

import styles from './styles';

export interface IFilterModal {
  handleConfirm: (
    newFilter: IFilter,
  ) => void;
  closeModal: () => void;
  filter: IFilter,
}

export default function FilterModal({
  closeModal,
  handleConfirm,
  filter,
}: IFilterModal): JSX.Element{
  const dimension = useWindowDimensions();
  const { filterByStatus, filterByParticipation, filterByResult } = filter;
  const [newFilterByStatus, setNewFilterByStatus] = useState<EFilterByStatus>(filterByStatus);
  const [newFilterByParticipation, setNewFilterByParticipation] = useState<EFilterByParticipation>(
    filterByParticipation,
  );
  const [newFilterByResult, setNewFilterByResult] = useState<EFilterByResult>(filterByResult);

  const confirmHandler = () => {
    handleConfirm({
      filterByStatus: newFilterByStatus,
      filterByParticipation: newFilterByParticipation,
      filterByResult: newFilterByResult,
    });
    closeModal();
  };

  return (
    <ModalWrapper
      closeModal={closeModal}
      isCentered={dimension !== EDimensions.SMALL}
      isFullWidth={dimension === EDimensions.SMALL}
    >
      <styles.Header>
        <p><Translate value="modals.filters" /></p>
        <styles.Close onClick={closeModal}>
          <styles.CloseIcon />
        </styles.Close>
      </styles.Header>

      <styles.Body>
        <styles.Wrapper>
          <styles.TitleWrapper>
            <Translate value="filter.status" />
          </styles.TitleWrapper>
          <styles.WrapperBtn>
            {toArray(EFilterByStatus).map((status) => (
              <styles.FilterBtn
                key={status}
                isActive={status !== newFilterByStatus}
                onClick={() => setNewFilterByStatus(status)}
              >
                {lowerCaseExceptFirst(status)}
              </styles.FilterBtn>
            ))}
          </styles.WrapperBtn>
        </styles.Wrapper>
        <styles.Wrapper>
          <styles.TitleWrapper>
            <Translate value="filter.poolParticipation" />
          </styles.TitleWrapper>
          <styles.WrapperBtn>
            {toArray(EFilterByParticipation).map((status) => (
              <styles.FilterBtn
                key={status}
                isActive={status !== newFilterByParticipation}
                onClick={() => setNewFilterByParticipation(status)}
              >
                {lowerCaseExceptFirst(status)}
              </styles.FilterBtn>
            ))}
          </styles.WrapperBtn>
        </styles.Wrapper>
        <styles.Wrapper>
          <styles.TitleWrapper>
            <Translate value="filter.result" />
          </styles.TitleWrapper>
          <styles.WrapperBtn>
            {toArray(EFilterByResult).map((status) => (
              <styles.FilterBtn
                key={status}
                isActive={status !== newFilterByResult}
                onClick={() => setNewFilterByResult(status)}
              >
                {lowerCaseExceptFirst(status)}
              </styles.FilterBtn>
            ))}
          </styles.WrapperBtn>
        </styles.Wrapper>
      </styles.Body>
      <styles.Footer>
        <Buttons.Primary
          onClick={confirmHandler}
        >
          <Translate value="action.apply" />
        </Buttons.Primary>
      </styles.Footer>
    </ModalWrapper>
  );
}
