import { ETypeClaim } from 'providers/interfaces';
import { IClaimProps } from 'shared/interfaces';

const getClaimProps = (typeClaim: ETypeClaim, refundTokenName: string): IClaimProps | null => {
  if (typeClaim === ETypeClaim.CLAIM) {
    return {
      title: 'claim.congratulations',
      additionalTitle: 'claim.claimNFT',
      label: 'claim.finalBid',
      titleButton: 'action.claimNFT',
    };
  }
  if (typeClaim === ETypeClaim.REFUND) {
    return {
      title: 'claim.refund',
      label: 'claim.locked',
      titleButton: refundTokenName,
    };
  }
  return null;
};

export default getClaimProps;
