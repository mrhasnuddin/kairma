export const networks = [
  { id: 'sepolia', name: 'Ethereum Sepolia', icon: 'sepolia.svg' },
  { id: 'base', name: 'Base', icon: 'base.svg' },
  { id: 'arbitrum', name: 'Arbitrum One', icon: 'arbitrum.svg' },
  { id: 'optimism', name: 'Optimism', icon: 'optimism.svg' },
  { id: 'fuji', name: 'Avalanche Fuji', icon: 'fuji.svg' }
];

export const protocols = [
  { id: 'aave', name: 'Aave V3', icon: 'aave.svg' },
  { id: 'compound', name: 'Compound V3', icon: 'compound.svg' },
  { id: 'venus', name: 'Venus Protocol', icon: 'venus.svg' }
];

export const assets = [
  { id: 'eth', name: 'Ethereum', icon: 'eth.svg' },
  { id: 'btc', name: 'Bitcoin', icon: 'btc.svg' },
  { id: 'usdc', name: 'USD Coin', icon: 'usdc.svg' },
  { id: 'usdt', name: 'Tether USD', icon: 'usdt.svg' },
  { id: 'soul', name: 'Soul Token', icon: 'soul.svg' }
];

export const gauges = [
  { id: 1, name: 'Aave V3 USDC Sepolia', network: 'sepolia', protocol: 'aave', asset: 'usdc', emissions: '45,210', apy: '12.4%', votes: '1,240,500', status: 'Active' },
  { id: 2, name: 'Compound V3 ETH Base', network: 'base', protocol: 'compound', asset: 'eth', emissions: '32,150', apy: '9.8%', votes: '890,200', status: 'Active' },
  { id: 3, name: 'Aave V3 BTC Arbitrum', network: 'arbitrum', protocol: 'aave', asset: 'btc', emissions: '18,740', apy: '7.2%', votes: '512,100', status: 'Active' },
  { id: 4, name: 'Venus USDT Fuji', network: 'fuji', protocol: 'venus', asset: 'usdt', emissions: '28,900', apy: '14.1%', votes: '725,400', status: 'Active' },
  { id: 5, name: 'Compound V3 USDC Optimism', network: 'optimism', protocol: 'compound', asset: 'usdc', emissions: '21,450', apy: '11.2%', votes: '630,800', status: 'Active' },
  { id: 6, name: 'Aave V3 ETH Sepolia', network: 'sepolia', protocol: 'aave', asset: 'eth', emissions: '52,180', apy: '10.5%', votes: '1,450,000', status: 'Active' },
  { id: 7, name: 'Venus SOUL Sepolia', network: 'sepolia', protocol: 'venus', asset: 'soul', emissions: '95,000', apy: '32.6%', votes: '3,120,000', status: 'Active' },
  { id: 8, name: 'Aave V3 SOUL Base', network: 'base', protocol: 'aave', asset: 'soul', emissions: '62,400', apy: '28.4%', votes: '2,150,000', status: 'Active' },
  { id: 9, name: 'Compound V3 BTC Base', network: 'base', protocol: 'compound', asset: 'btc', emissions: '12,900', apy: '6.5%', votes: '310,000', status: 'Active' },
  { id: 10, name: 'Venus ETH Arbitrum', network: 'arbitrum', protocol: 'venus', asset: 'eth', emissions: '22,500', apy: '8.4%', votes: '480,000', status: 'Active' }
];
