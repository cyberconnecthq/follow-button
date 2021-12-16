<template>
  <div id="app">
    <button v-if="!isConnected" @click="connectWallet">Connect Wallet</button>
    <h2 v-if="!!account">My Address: {{ account }}</h2>
    <h2 v-if="!!account">Target Address: 0xe6aab1f16ff560d309ed7ce8e08d290306a0906c</h2>
    <vue-follow-button
      v-if="isConnected"
      namespace="CyberConnect"
      toAddr="0xe6aab1f16ff560d309ed7ce8e08d290306a0906c"
      :provider="provider"
      :env="env"
      :chain="chain"
      @success="handleSuccess"
      @failure="handleFailure"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Web3 from 'web3';
import {
  Env,
  Blockchain,
} from '@cyberlab/cyberconnect';
import { Config } from '@cyberlab/cyberconnect/lib/types';
import VueFollowButton from '@/components/vue-follow-button.vue';

type Data = {
  account: Object | null,
  isConnected: boolean 
  env: Config['env'],
  chain: Config['chain'],
}

export default defineComponent({
  name: 'ServeDev',
  components: {
    VueFollowButton
  },
  data(): Data {
    return {
      account: null,
      isConnected: false,
      env: Env.PRODUCTION,
      chain: Blockchain.ETH,
    };
  },
  computed: {
    provider() {
      return Web3.givenProvider;
    },
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
