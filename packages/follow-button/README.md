Embedding a follow button on your website is a quick and easy way to follow/unfollow other people on the given namespace. Let's start.

The Cyber Connect follow button SDK for JavaScript doesn't have any standalone files that need to be downloaded or installed, instead you simply need to include a short piece of regular JavaScript in your HTML that will asynchronously load the SDK into your pages. The async load means that it does not block loading other elements of your page.

**Create a follow button**

First you need to include the `cyberconnect.min.js` script and call `follow.init` after the script loaded.

```jsx
<script>
async function initCyberConnect() {
    await capi.follow.init({
        ethProvider: ethProvider // ethProvider is an Ethereum provider
				namespace: 'CyberConnect',
				env: 'PRODUCTION' // env decides the endpoints. Now we have STAGING and PRODUCTION. The default value is PRODUCTION
    });
</script>
<script src="cyberconnect.min.js" async defer onload="initCyberConnect"></script>
```

Then, to create a follow button, add an `div` element to contain a button `id` and call `follow.render` with the target wallet address

```jsx
<body>
	<div id="follow-button"></div>
	<script>
		capi.follow.render("follow-button", {
      toAddr: 'xxx',
      onSuccess: (event) => {
        console.log(event);
      },
      onFailure: (event) => {
        console.log(event);
      },
    });
	</script>
</body>
```

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

**Button Style:**

- Follow:
  - Normal:
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/72646928-51da-4e8b-9070-401ce52c64f4/Untitled.png)
  - Hover:
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8f00ab61-25b4-48bf-94ea-39ab842d4a7a/Untitled.png)
- Following:
  - Normal
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c5264de9-c6ff-4f12-b370-d5e17b42a440/Untitled.png)
  - Hover:
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2f2358e4-c159-40ff-9225-7965bfb23b61/Untitled.png)
