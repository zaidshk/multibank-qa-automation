// Symbols map to the /en/price/{symbol} route
// Kept to a representative set — enough to prove parameterization without hammering the site

export interface CryptoAsset {
  symbol: string;
  displayName: string;
}

export const CRYPTO_ASSETS: CryptoAsset[] = [
  { symbol: 'btc',  displayName: 'Bitcoin'         },
  { symbol: 'eth',  displayName: 'Ethereum'        },
  { symbol: 'sol',  displayName: 'Solana'          },
  { symbol: 'xrp',  displayName: 'XRP'             },
  { symbol: 'doge', displayName: 'Dogecoin'        },
  { symbol: 'mbg',  displayName: 'MultiBank Group' },
];

// The price heading contains only the numeric value — the $ symbol is a separate inline element
// Matches both large prices (e.g. 79,239.10) and sub-dollar prices (e.g. 0.26)
// Assert format only — the exact value changes every tick
export const PRICE_FORMAT_REGEX = /\d+[.,]\d+/;

// 24h change can be positive or negative on any given day
export const CHANGE_FORMAT_REGEX = /[+-]?[\d.]+%/;
