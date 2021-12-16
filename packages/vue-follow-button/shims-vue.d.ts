declare module '*.vue' {
  import { DefineComponent } from 'vue-demi';

  const Component: DefineComponent<{}, {}, any>;
  export default Component;
}

interface Window {
  ethereum?: {
    isMetaMask?: true;
    request?: (...args: any[]) => Promise<Object[]>;
  };
}
