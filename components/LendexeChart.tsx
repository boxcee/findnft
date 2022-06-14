import {FunctionComponent, useEffect, useMemo, useState} from 'react';
import {Soon} from 'soonaverse';
import {Nft} from 'soonaverse/dist/interfaces/models/nft';

const soon = new Soon();

const getPoints = (collectionId: string): number => {
  if (collectionId === '0x021b5b27ead6ec003ba8f1b605f853a5baf9a803') return 1;
  if (collectionId === '0x18b1de447289c85754b9b0de1e5acdbac49597be') return 2;
  if (collectionId === '0x7ce279815e2910a6341d6ff04d9dd7990f8252be') return 4;
  return 0;
};

const getCategory = (points: number): string => {
  if (points <= 4) return 'Category 1';
  if (points <= 7) return 'Category 2';
  if (points <= 15) return 'Category 3';
  if (points >= 16) return 'Category 4';
  return '';
};

const LendexeChart: FunctionComponent = () => {
  const [nfts, setNfts] = useState<Nft[]>([]);

  useEffect(() => {
    soon.getNftsByCollections(collectionIds).then(nfts => {
      setNfts(nfts);
    });
  }, []);

  const component = useMemo(() => {
    const pointsByAddress = nfts.reduce((red, nft) => {
      if (!red[nft.owner!]) {
        red[nft.owner!] = {points: 0, category: ''};
      }
      red[nft.owner!]['points'] += getPoints(nft.collection);
      red[nft.owner!]['category'] = getCategory(red[nft.owner!]['points']);
      return red;
    }, {} as { [key: string]: { points: number, category: string } });
    const categories = Object.keys(pointsByAddress).reduce((red, address) => {
      const {category} = pointsByAddress[address];
      if (!red[category]) {
        red[category] = 0;
      }
      red[category] += 1;
      return red;
    }, {} as { [key: string]: number });
    return Object.keys(categories).map((category: string) => (
      <div key={category}>{category}: {categories[category]}</div>
    ));
  }, [nfts]);

  if (nfts.length === 0) {
    return <div style={{marginBottom: 10}}>Loading custom content...</div>;
  }

  return <div style={{marginBottom: 10}}>{component}</div>;
};

export const collectionIds = [
  '0x18b1de447289c85754b9b0de1e5acdbac49597be',
  '0x021b5b27ead6ec003ba8f1b605f853a5baf9a803',
  '0x7ce279815e2910a6341d6ff04d9dd7990f8252be',
];

export default LendexeChart;
