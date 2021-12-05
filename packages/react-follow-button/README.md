# React Follow Button

> A Component React for CyberConncet Follow/Unfollow

# Getting Started

- `yarn add @cyberconnect/react-follow-button` or `npm install @cyberconnect/react-follow-button`
- Your application will also need `react-dom` and `react` installed.

## Basic button

---

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

See [API]('https://docs.cyberconncet.me/connect-and-disconnect#basic-usage') for more details.

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

See [demo]('https://github.com/cyberconnecthq/follow-button/tree/main/packages/react-follow-button/demo') for more details.

## Button Style

---

- Follow:
  - Normal:<br />
    ![image](https://user-images.githubusercontent.com/17503721/143494393-d397246e-0901-4026-aa8a-666515ad6cc5.png)
  - Hover:<br />
    ![image](https://user-images.githubusercontent.com/17503721/143494572-598b1e0a-9c76-4f61-83d0-f25e589ef66e.png)
- Following:
  - Normal:<br />
    ![image](https://user-images.githubusercontent.com/17503721/143494432-3206ef20-9e1f-49d9-a27c-104044d6cd52.png)
  - Hover:<br />
    ![image](https://user-images.githubusercontent.com/17503721/143494445-8ac2abdc-9725-4921-a236-52655f52a54a.png)
