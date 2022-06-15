import {FunctionComponent} from 'react';
import LendexeChart, {lendexeCollectionIds} from './LendexeChart';
import GensoChart, {gensoCollectionIds} from './GensoChart';
import {Nft} from 'soonaverse/dist/interfaces/models/nft';

const GenericComponent: FunctionComponent = () => null;

export type GenericComponentProps = {
  nfts: Nft[],
  collectionId: string,
}

const getMappedComponent = (collectionId: string): FunctionComponent<GenericComponentProps> => {
  if (lendexeCollectionIds.includes(collectionId)) {
    return LendexeChart;
  }
  if (gensoCollectionIds.includes(collectionId)) {
    return GensoChart;
  }
  return GenericComponent;
};

export default getMappedComponent;
