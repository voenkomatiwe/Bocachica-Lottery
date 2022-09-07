export default function getConfig(
  env: string | undefined = process.env.REACT_APP_NEAR_ENV,
) {
  switch (env) {
    case 'development':
    case 'testnet':
      return {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
        lotteryContractId: 'give.migration.testnet',
        wNearAddress: 'wrap.testnet',
        dexUrl: 'jumbo.exchange',
        usn: 'usdn.testnet',
        parasApiUrl: 'https://api-v3-marketplace-testnet.paras.id',
        parasContractId: 'paras-token-v2.testnet',
      };
    default:
      return {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org',
        lotteryContractId: '',
        wNearAddress: 'wrap.near',
        dexUrl: 'jumbo.exchange',
        usn: 'usn',
        parasApiUrl: 'https://api-v2-mainnet.paras.id',
        parasContractId: 'x.paras.near',
      };
  }
}
