import { useCallback, useState } from 'react';

import { IAuction } from 'providers/interfaces';
import { FungibleTokenContract, NonFungibleTokenContract } from 'services/contracts';
import ModalWrapper from 'shared/components/Modals/ModalWrapper';
import Status from 'shared/components/Status';
import Translate from 'shared/components/Translate';
import { EDimensions, INITIAL_VALUE } from 'shared/constant';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';
import { getAuctionBySearch } from 'shared/utils';
import { EStatus } from 'shared/utils/statusLocales';

import styles from './styles';

export interface ISearchModal {
  closeModal: () => void;
  newAuctions: IAuction[];
  auctionNfts: { [key: string]: NonFungibleTokenContract };
  auctionTokens: { [key: string]: FungibleTokenContract };
  handleConfirm: (auctionId: number) => void;
}

export default function SearchModal({
  closeModal,
  newAuctions,
  auctionNfts,
  auctionTokens,
  handleConfirm,
}: ISearchModal): JSX.Element{
  const dimension = useWindowDimensions();
  const [searchValue, setSearchValue] = useState<string>(INITIAL_VALUE);
  const [filteredAuctions, setFilteredAuctions] = useState<IAuction[]>(newAuctions);

  const onChange = useCallback((search: string) => {
    setSearchValue(search);
    const auctionsBySearch = search !== INITIAL_VALUE
      ? newAuctions.filter((auction) => {
        const contractNft = auctionNfts[auction.nftContractId];
        const nft = contractNft.tokenMetadata[auction.nftTokenId];
        return nft.metadata.title.toLowerCase().includes(search.toLowerCase());
      })
      : newAuctions;
    setFilteredAuctions(auctionsBySearch);
  }, [auctionNfts, newAuctions]);

  const foundAuctions = getAuctionBySearch(filteredAuctions, auctionNfts, auctionTokens);

  return (
    <ModalWrapper
      closeModal={closeModal}
      isCentered={dimension !== EDimensions.SMALL}
      isFullWidth={dimension === EDimensions.SMALL}
      isFullHeight={dimension === EDimensions.SMALL}
    >
      <styles.Header>
        <styles.StyledInput>
          <styles.Search />
          <styles.Input
            value={searchValue}
            onChange={(value) => onChange(value.target.value)}
          />
          {searchValue && <styles.ClearSearch onClick={() => onChange(INITIAL_VALUE)} />}
        </styles.StyledInput>
        <styles.Close onClick={closeModal}>
          <styles.CloseIcon />
        </styles.Close>
      </styles.Header>
      <styles.Body>
        {
          foundAuctions.length === 0 && (
            <styles.NoResultsWrapper>
              <styles.NoResultsIcon />
              <styles.NoResultsTitle>
                <Translate
                  value="noResults.title"
                  dynamicValue={searchValue}
                />
              </styles.NoResultsTitle>
              <styles.NoResultsLabel>
                <Translate value="noResults.label" />
              </styles.NoResultsLabel>
            </styles.NoResultsWrapper>
          )
        }
        {
          foundAuctions.map((el) => (
            <styles.Row
              key={el.auctionId}
              onClick={() => {
                closeModal();
                handleConfirm(el.auctionId);
              }}
            >
              <styles.ImageContainer>
                <styles.Image src={el.media} alt="nft logo" />
              </styles.ImageContainer>
              <styles.WrapperDescription>
                <styles.Title>{el.title}</styles.Title>
                {
                    el.status !== EStatus.Soon && (
                      <styles.Label>
                        {el.label}
                        :
                        &nbsp;
                        {el.bid}
                      </styles.Label>
                    )
                  }

              </styles.WrapperDescription>
              <Status type={el.status} />
            </styles.Row>
          ))
        }
      </styles.Body>
    </ModalWrapper>
  );
}
