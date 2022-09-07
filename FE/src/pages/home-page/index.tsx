import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as FilterIcon } from 'assets/images/icons/filter.svg';
import { ReactComponent as SearchIcon } from 'assets/images/icons/search.svg';
import { useData } from 'providers/DataProvider';
import { IAuction } from 'providers/interfaces';
import { toAuction } from 'routes/constant';
import { FungibleTokenContract, NonFungibleTokenContract } from 'services/contracts';
import Card from 'shared/components/Card';
import SmallSkeleton from 'shared/components/Placeholder/SmallSkeleton';
import Translate from 'shared/components/Translate';
import { initialFilter, numberPlaceholderCard } from 'shared/constant';
import { IFilter } from 'shared/interfaces';
import { EModals } from 'shared/providers/interfaces';
import { useModalStore } from 'shared/providers/ModalProvider';
import {
  getAuctionsByFilter,
  getFilteredAuctionArray,
  toArray,
} from 'shared/utils';

import styles from './styles';

export default function HomePage(): JSX.Element {
  const { showModal } = useModalStore();
  const {
    loading,
    auctions,
    nfts,
    tokens,
  } = useData();
  const auctionsArray = toArray(auctions);
  const navigate = useNavigate();
  const [filter, setFilter] = useState<IFilter>(initialFilter);
  const filteredAuctions = getFilteredAuctionArray(auctionsArray);
  const auctionsByFilter = getAuctionsByFilter(filteredAuctions, filter);

  const openSearchModal = (
    newAuctions: IAuction[],
    auctionNfts: { [key: string]: NonFungibleTokenContract },
    auctionTokens: { [key: string]: FungibleTokenContract },
    handleConfirm: (auctionId: number) => void,
  ) => {
    showModal(EModals.SEARCH_MODAL, {
      handleConfirm,
      newAuctions,
      auctionNfts,
      auctionTokens,
    });
  };

  const openFilterModal = (
    oldFilter: IFilter,
  ) => {
    showModal(EModals.FILTER_MODAL, {
      filter: oldFilter,
      handleConfirm: (
        newFilter: IFilter,
      ) => {
        setFilter(newFilter);
      },
    });
  };

  return (
    <>
      <styles.Header>
        <styles.LogoContainer>
          <SearchIcon onClick={() => openSearchModal(
            filteredAuctions,
            nfts,
            tokens,
            (auctionId: number) => navigate(toAuction(auctionId)),
          )}
          />
        </styles.LogoContainer>
        <Translate value="homePage.title" />
        <styles.LogoContainer>
          <FilterIcon onClick={() => openFilterModal(filter)} />
        </styles.LogoContainer>
      </styles.Header>
      <styles.WrapperCards>
        {
          loading
            ? numberPlaceholderCard.map((card) => <SmallSkeleton key={card} />)
            : auctionsByFilter.map((auction) => (
              <Card key={auction.id} auction={auction} />
            ))
        }
      </styles.WrapperCards>
    </>
  );
}
