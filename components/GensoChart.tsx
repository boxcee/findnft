import {FunctionComponent, useMemo} from 'react';
import {GenericComponentProps} from './mapper';

const GensoChart: FunctionComponent<GenericComponentProps> = ({nfts, collectionId}) => {
  const component = useMemo(() => {
    const mapped = nfts.filter(nft => !nft.placeholderNft).reduce((red, nft) => {
      if (!red[nft.owner!]) {
        red[nft.owner!] = {air: 0, fire: 0, earth: 0, water: 0, chaos: 0, set: 0};
      }
      red[nft.owner!][nft.properties.element.value.toLowerCase()] += 1;
      red[nft.owner!]['set'] = Object.keys(red[nft.owner!])
        .reduce((red2, key) => {
          if (key === 'set') return red2;
          return red[nft.owner!][key] > 0 ? red2 : 0;
        }, 1);
      return red;
    }, {} as { [key: string]: { [key: string]: number } });
    const set = Object.values(mapped).filter(values => values.set);
    return (
      <>Set holders: {set.length}</>
    );
  }, [nfts]);

  return <div style={{marginBottom: 10}}>{component}</div>;
};

export const gensoCollectionIds = [
  '0x26f5cb9980b9e1b7a84aaf7c0b8188bb9774bd99',
];

export default GensoChart;
