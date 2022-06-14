import {FunctionComponent} from 'react';
import LendexeChart, {collectionIds} from './LendexeChart';

const GenericComponent: FunctionComponent = () => null;

const getMappedComponent = (collectionId: string): FunctionComponent => {
  if (collectionIds.includes(collectionId)) {
    return LendexeChart;
  }
  return GenericComponent;
};

export default getMappedComponent;
