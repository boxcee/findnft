import type {NextPage} from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {ChangeEvent, useState} from 'react';
import {Soon} from 'soonaverse';
import {Nft} from 'soonaverse/dist/interfaces/models/nft';

const soon = new Soon();

const buildPropertiesMap = (nfts: Nft[]) => {
  return nfts
    .filter(nft => !nft.placeholderNft)
    .map(nft => nft.properties)
    .reduce((red, properties) => {
      if (properties) {
        for (const key of Object.keys(properties)) {
          const {value} = properties[key];
          if (red[key] && !red[key].includes(value)) {
            red[key] = [...red[key], value];
          } else if (!red[key]) {
            red[key] = [value];
          }
        }
      }
      return red;
    }, {} as { [key: string]: string[] });
};

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [nfts, setNfts] = useState([] as Nft[]);
  const [select, setSelect] = useState({} as { [key: string]: string });
  const [loaded, setLoaded] = useState(false);

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const onClickButtonLoad = () => {
    setLoading(true);
    soon.getNftsByCollections([input])
      .then(nfts => {
        setNfts(nfts);
        setLoaded(true);
        setLoading(false);
      });
  };

  const onSelectProperty = (label: string) => (event: ChangeEvent<HTMLSelectElement>) => {
    setSelect((prevState) => ({
      ...prevState,
      [label]: event.target.value,
    }));
  };

  const onClickButtonClear = () => {
    setSelect({});
  };

  const properties = buildPropertiesMap(nfts);

  const getPropertiesFilter = () => (
    <div>
      {Object.keys(properties).map(key => (
        <select key={key} onChange={onSelectProperty(key)} value={select[key]}>
          {properties[key].map(property => (
            <option key={property}>{property}</option>
          ))}
        </select>
      ))}
      <button onClick={onClickButtonClear}>clear</button>
    </div>
  );

  const getFilteredItem = (item: Nft) => (
    <li key={item.name}><a
      href={item.wenUrl}>{item.name} @ {(item.available && item.availablePrice ? item.availablePrice : item.price) / 1000000} {item.available ? 'O' : 'X'}</a>
    </li>
  );

  const filtered = nfts
    .filter(nft => !nft.placeholderNft)
    .filter(nft => {
      for (const key of Object.keys(select)) {
        if (nft.properties[key].value !== select[key]) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => ((a.available && a.availablePrice ? a.availablePrice : a.price) - (b.available && b.availablePrice ? b.availablePrice : b.price)));

  const getFilteredItems = () => (
    <ul>
      {filtered.map(getFilteredItem)}
    </ul>
  );

  const propertiesLoaded = Object.keys(properties).length > 0;

  const filteredLoaded = filtered.length > 0 && Object.keys(select).length > 0;

  return (
    <div className={styles.container}>
      <Head>
        <title>Find NFTs</title>
        <meta name="description" content="Find NFTs on https://soonaverse.com" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {loading ?
          <p>Loading...</p> :
          <>
            <p>
              <input type="text" value={input} placeholder="paste collection address" onChange={onChangeInput} />
              <button onClick={onClickButtonLoad}>load</button>
            </p>
            {propertiesLoaded ? getPropertiesFilter() : null}
            {!propertiesLoaded && loaded ? <>NFTs have no properties</> : null}
            {filteredLoaded ? getFilteredItems() : null}
          </>
        }
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/boxcee/findnft"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
      </footer>
    </div>
  );
};

export default Home;
