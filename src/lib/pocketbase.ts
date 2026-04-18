import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'https://mjwdesign-core.pockethost.io');

export default pb;
