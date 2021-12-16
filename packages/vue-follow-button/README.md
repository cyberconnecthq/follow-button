# Vue Follow Button

> A Vue Component for CyberConncet Follow/Unfollow

# Getting Started

- `yarn add @cyberconnect/vue-follow-button` or `npm install @cyberconnect/vue-follow-button`

# Dependencies
The following dependencies are required
- @cyberlab/cyberconnect
- vue

## Basic button

---

See demo [here]('https://github.com/cyberconnecthq/follow-button/tree/main/packages/vue-follow-button/example').

```html
<template>
  <VueFollowButton
    v-if=""
    namespace="CyberConnect"
    toAddr="0xe6aab1f16ff560d309ed7ce8e08d290306a0906c"
    :provider="provider"
    :env="env"
    :chain="chain"
    @success="handleSuccess"
    @failure="handleFailure"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Web3 from 'web3';
import {
  Env,
  Blockchain,
} from '@cyberlab/cyberconnect';
import { Config } from '@cyberlab/cyberconnect/lib/types';
import VueFollowButton from '@cyberconnect/vue-follow-button';

type Data = {
  account: Object | null,
  env: Config['env'],
  chain: Config['chain'],
  isConnected: boolean,
}

export default defineComponent({
  name: 'App',
  components: {
    VueFollowButton,
  },
  data(): Data {
    return {
      account: null,
      env: Env.PRODUCTION,
      chain: Blockchain.ETH,
      isConnected: false,
    };
  },
  computed: {
    provider() {
      return Web3.givenProvider;
    },
  },
  async mounted() {
    await this.connectWallet();
  },
  methods: {
    handleSuccess(e: any) {
      console.log(e);
    },
    handleFailure(e: any) {
      console.log(e);
    },
    async connectWallet() {
      if (typeof window.ethereum === 'undefined' || typeof window.ethereum.request === 'undefined') {
        console.error('MetaMask is not installed!');

        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      this.account = accounts[0];
      this.isConnected = true;
    }
  }
});
</script>

```

See [API]('https://docs.cyberconncet.me/connect-and-disconnect#basic-usage') for more details of those props.

When the button triggered, the events will be emitted with the following event object:

```jsx
@success:
{
    code: EVENT_NAME,
    toAddr: "xxx"
}

@failure:
{
    code: ERROR_CODE,
    message: "error message"
}
```
