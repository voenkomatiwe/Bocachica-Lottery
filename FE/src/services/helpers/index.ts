import BN from 'bn.js';
import { baseDecode } from 'borsh';
import { Near, utils, WalletConnection } from 'near-api-js';
import * as nearAPI from 'near-api-js';
import { createTransaction, functionCall } from 'near-api-js/lib/transaction';
import { PublicKey } from 'near-api-js/lib/utils';

import { Action } from 'services/interfaces';

export const getGas = (gas?: string) => (gas ? new BN(gas) : new BN('100000000000000'));
export const getAmount = (amount?: string) => (amount
  ? new BN(utils.format.parseNearAmount(amount) ?? 0)
  : new BN('0'));

export const fromNear = (amount: string): number => parseFloat(utils.format.formatNearAmount(amount || '0'));
export const toYoctoNear = (amount: number): string => utils.format.parseNearAmount(String(amount)) || '0';

export function createContract(
  wallet: WalletConnection,
  contractId: string,
  viewMethods : string[] = [],
  changeMethods: string[] = [],
) {
  return new nearAPI.Contract(
    wallet.account(),
    contractId,
    {
      viewMethods,
      changeMethods,
    },
  );
}

export function createNearTransaction(
  near: Near,
  wallet: WalletConnection,
  accountId: string,
  action: Action[],
) {
  return action.map(async (t, i) => {
    const actions = t.functionCalls.map((fc: any) => functionCall(
      fc.methodName,
      fc.args,
      getGas(fc.gas),
      getAmount(fc.amount),
    ));
    const localKey = await near.connection.signer.getPublicKey(accountId, near.connection.networkId);
    const accessKey = await wallet.account().accessKeyForTransaction(
      t.receiverId,
      actions,
      localKey,
    );
    const block = await near.connection.provider.block({ finality: 'final' });
    const blockHash = baseDecode(block.header.hash);
    const publicKey = PublicKey.from(accessKey.public_key);
    const nonce = accessKey.access_key.nonce + i;
    return createTransaction(
      accountId,
      publicKey,
      t.receiverId,
      nonce,
      actions,
      blockHash,
    );
  });
}
