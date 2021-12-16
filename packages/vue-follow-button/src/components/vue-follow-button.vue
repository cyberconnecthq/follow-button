<template>
  <div
    class="cyber-connect-follow-button-wrapper"
    @mouseenter="handleButtonMouseEnter"
    @mouseleave="handleButtonMouseLeave"
  >
    <Loading v-if="loading > 0" />
    <div
      v-else
      class="cyber-connect-follow-button"
      @click="handleButtonClick"
    >
      <div class="cyber-connect-logo">
        <LogoLeft
          class="connect-logo-part connect-logo-part-left"
        />
        <LogoRight
          class="connect-logo-part connect-logo-part-right"
        />
      </div>
      <div class="button-text">{{buttonText}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue-demi';
import Loading from '@/components/loading.vue';
import LogoLeft from '@/components/logo-left.vue';
import LogoRight from '@/components/logo-right.vue';
import { endpoints } from '@cyberlab/cyberconnect/lib/network';
import { followStatus } from '../utils/queries';
import CyberConnect, {
  Env,
  Blockchain,
  getAddressByProvider,
} from '@cyberlab/cyberconnect';
import { Config, ConfigEth, ConfigBase, ConfigSolana } from '@cyberlab/cyberconnect/lib/types';

type Data = {
  buttonText: string,
  fromAddr: string,
  loading: number,
  following: boolean,
  isButtonVisible: boolean,
}

export default defineComponent({
  name: 'Button',
  components: {
    Loading,
    LogoLeft,
    LogoRight,
  },
  props: {
    toAddr: {
      type: String,
      required: true,
    },
    provider: {
      type: Object as PropType<Config['provider']>,
      required: true,
    },
    namespace: {
      type: String as PropType<Config['namespace']>,
      required: true,
    },
    env: {
      type: String as PropType<Config['env']>,
      default: Env.PRODUCTION,
    },
    chain: {
      type: String as PropType<Config['chain']>,
      default: Blockchain.ETH,
    },
    chainRef: {
      type: String as PropType<Config['chainRef']>,
    },
  },
  data(): Data {
    return {
      buttonText: 'Follow',
      fromAddr: '',
      loading: 0,
      following: false,
      isButtonVisible: false,
    };
  },
  computed: {
    apiUrl() {
      if (this.env) {
        return endpoints[this.env].cyberConnectApi;
      }

      return '';
    },
  },
  watch: {
    async fromAddr() {
      await this.setFollowStatus();
    },
    async chain() {
      await this.setUserAddress();
    },
    async provider() {
      await this.setUserAddress();
    },
  },
  async mounted() {
    if (!this.namespace) {
      console.error('Namespace can not be empty');
      this.$emit('failure', {
        code: 'EmptyNamespace',
        message: 'Namespace can not be empty',
      });

      return;
    }

    let options: Config;
    if (this.chain === Blockchain.ETH) {
      const opts: ConfigBase & ConfigEth = {
        provider: this.provider,
        namespace: this.namespace,
        chain: this.chain,
        env: this.env
      }

      options = opts;
    } else if (this.chain === Blockchain.SOLANA) {
      if (!this.chainRef) {
        this.$emit('failure', {
          code: 'WrongChainRef',
          message: 'chainRef is invalid',
        });

        return;
      }
      const opts: ConfigBase & ConfigSolana = {
        provider: this.provider,
        namespace: this.namespace,
        chain: this.chain,
        chainRef: this.chainRef,
        env: this.env
      }

      options = opts;
    } else {
      this.$emit('failure', {
        code: 'UnsupportedChain',
        message: 'chain is not supported',
      });

      return;
    }

    // @ts-ignore
    this.cyberConnect = new CyberConnect(options);
    await this.setUserAddress();
    await this.setFollowStatus();
  },
  methods: {
    getCyberConnect(): CyberConnect | null {
      // @ts-ignore
      return this.cyberConnect;
    },
    updateElementStatus(following: boolean) {
      this.following = following;
      if (this.following) {
        this.buttonText = 'Following';
        this.$el.classList.remove('logo-rotate');
      } else {
        this.buttonText = 'Follow';
      }
    },
    handleButtonMouseEnter() {
      if (this.following) {
        this.buttonText = 'Unfollow';
      } else {
        this.$el.classList.add('logo-rotate');
      }
    },
    handleButtonMouseLeave() {
      if (this.following) {
        this.buttonText = 'Following';
      }

      this.$el.classList.remove('logo-rotate');
    },
    async follow(toAddr: string) {
      const cyberConnect = this.getCyberConnect();
      if (!cyberConnect) {
        throw {
          code: 'FollowError',
          message: 'Can not find the connect instance',
        };
      }

      try {
        await cyberConnect.connect(toAddr);
      } catch (e: any) {
        throw {
          code: 'FollowError',
          message: e.message || e,
        };
      }
    },
    async unfollow(toAddr: string) {
      const cyberConnect = this.getCyberConnect();
      if (!cyberConnect) {
        throw {
          code: 'UnfollowError',
          message: 'Can not find the connect instance',
        };
      }

      try {
        await cyberConnect.disconnect(toAddr);
      } catch (e: any) {
        throw {
          code: 'UnfollowError',
          message: e.message || e,
        };
      }
    },
    async handleButtonClick() {
      this.activateLoading();

      try {
        if (this.following) {
          await this.unfollow(this.toAddr);
        } else {
          await this.follow(this.toAddr);
        }

        this.updateElementStatus(!this.following);

        if (this.following) {
          this.$emit('success', {
            code: 'UnfollowSuccess',
            toAddr: this.toAddr,
          });
        } else {
          this.$emit('success', {
            code: 'FollowSuccess',
            toAddr: this.toAddr,
          });
        }
      } catch (e: any) {
        this.$emit('failure', e);
        console.error(e);
      } finally {
        this.deactivateLoading();
      }
    },
    async setUserAddress() {
      if (!this.chain) {
        return;
      }

      this.activateLoading();

      try {
        this.fromAddr = await getAddressByProvider(this.provider, this.chain);
        if (!this.fromAddr) {
          this.$emit('failure', {
            code: 'NoETHAccount',
            message: 'Can not find the wallet address by the given provider',
          });
        }
      } finally {
        this.deactivateLoading();
      }
    },
    async setFollowStatus() {
      if (!this.fromAddr || !this.toAddr || !this.namespace || !this.apiUrl) {
        return;
      }

      this.activateLoading();

      try {
        const result = await followStatus({
          fromAddr: this.fromAddr,
          toAddr: this.toAddr,
          namespace: this.namespace,
          url: this.apiUrl,
        });

        if (result?.data?.followStatus?.isFollowing) {
          this.following = true;
          this.buttonText = 'Following';
        }
      } finally {
        this.deactivateLoading();
      }
    },
    activateLoading() {
      this.loading += 1;
    },
    deactivateLoading() {
      this.loading -= 1;
    },
  }
});
</script>

<style>
  .cyber-connect-follow-button-wrapper {
    position: relative;
    width: 141px;
    height: 44px;
    box-sizing: border-box;
    border-radius: 4px;
    background: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .cyber-connect-follow-button-wrapper.logo-rotate .cyber-connect-logo {
    transform: rotate(-45deg);
  }

  .cyber-connect-follow-button-wrapper.logo-rotate .connect-logo-part-left {
    left: 1.115px;
  }

  .cyber-connect-follow-button-wrapper.logo-rotate .connect-logo-part-right {
    right: 1.115px;
  }

  .cyber-connect-follow-button {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0 20px;
    transition: background-color 0.3s;
    background: #000000;
    box-sizing: border-box;
    border-radius: 4px;
  }

  .cyber-connect-follow-button:hover {
    background: #000000cc;
  }

  .cyber-connect-logo {
    width: 17.84px;
    position: relative;
    display: flex;
    transition: all 0.3s;
  }

  .connect-logo-part {
    width: 8.92px;
    height: 15.99px;
    position: relative;
    transition: all 0.3s;
  }

  .connect-logo-part-left {
    left: -1.115px;
  }

  .connect-logo-part-right {
    right: -1.115px;
  }

  .button-text {
    font-family: 'Poppins', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 19px;
    color: #ffffff;
    margin-left: 19.735px;
    user-select: none;
  }
</style>