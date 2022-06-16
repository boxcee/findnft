import {FunctionComponent, useMemo} from 'react';
import {GenericComponentProps} from './mapper';

const GensoChart: FunctionComponent<GenericComponentProps> = ({nfts, collectionId}) => {
  const component = useMemo(() => {
    const nftsPerAddress = nfts
      .filter(nft => !nft.placeholderNft)
      .reduce((red, nft) => {
        if (!red[nft.owner!]) {
          red[nft.owner!] = {air: 0, fire: 0, earth: 0, water: 0, chaos: 0, sets: 0};
        }
        red[nft.owner!][nft.properties.element.value.toLowerCase()] += 1;
        red[nft.owner!]['sets'] = Object.keys(red[nft.owner!])
          .reduce((red2, key) => {
            if (key === 'sets') return red2;
            return red[nft.owner!][key] < red2 ? red[nft.owner!][key] : red2;
          }, 1001);
        return red;
      }, {} as { [key: string]: { [key: string]: number } });
    const setHolders = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((n) => {
      const addresses = Object.values(nftsPerAddress).filter(item => item.sets === n);
      const sets = addresses.length;
      if (sets === 0) return null;
      return <div key={n}>Addresses with {n} sets: {sets}</div>;
    });
    const totalSets = Object.keys(nftsPerAddress)
      .reduce((red, address) => {
        return {
          air: (red.air || 0) + nftsPerAddress[address].air,
          fire: (red.fire || 0) + nftsPerAddress[address].fire,
          earth: (red.earth || 0) + nftsPerAddress[address].earth,
          water: (red.water || 0) + nftsPerAddress[address].water,
          chaos: (red.chaos || 0) + nftsPerAddress[address].chaos,
        };
      }, {} as { [key: string]: number });
    const possibleSets = Object.values(totalSets)
      .reduce((red, value) => value < red ? value : red, 1001);
    return (
      <div>
        <div>Possible sets: {possibleSets}</div>
        {setHolders}
      </div>
    );
  }, [nfts]);

  return <div style={{marginBottom: 10}}>{component}</div>;
};

export const gensoCollectionIds = [
  '0x26f5cb9980b9e1b7a84aaf7c0b8188bb9774bd99',
];

export default GensoChart;
