# React Follow Button

> A Component React for CyberConncet Follow/Unfollow

# Getting Started

- `yarn add @cyberconnect/react-follow-button` or `npm install @cyberconnect/react-follow-button`
- Your application will also need `react-dom` and `react` installed.

## Basic button

---

See demo [here]('https://github.com/cyberconnecthq/follow-button/tree/main/packages/react-follow-button/demo').

> Now for the first time users it will show two signs with their wallet when clicking button, and there may be 5-10 seconds between those two sign.

```tsx
import {
  FollowButton,
  Env,
  Blockchain,
} from '@cyberconnect/react-follow-button';

function App() {
  <div className="App">
    <FollowButton
      provider={ethProvider}
      namespace="CyberConnect"
      toAddr="0xe6aab1f16ff560d309ed7ce8e08d290306a0906c"
      env={Env.STAGING}
      chain={Blockchain.ETH}
      onSuccess={(e) => {
        console.log(e);
      }}
      onFailure={(e) => {
        console.log(e);
      }}
    />
  </div>;
}
```

See [API]('https://docs.cyberconncet.me/connect-and-disconnect#basic-usage') for more details of those props.

When the button triggered, the callbacks will be called with the following event object:

```jsx
onSuccess:
{
    code: EVENT_NAME,
    toAddr: "xxx"
}

onFailure:
{
    code: ERROR_CODE,
    message: "error message"
}
```
