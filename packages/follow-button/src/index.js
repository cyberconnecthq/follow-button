import CyberConnect from '@cyberlab/cyberconnect';
import { followStatus } from './query.js';
import logoLeftIconSvg from './icon/logo-left.svg';
import logoRightIconSvg from './icon/logo-right.svg';
import './index.css';

// Fix the `Buffer is not defined` error from rpc-utils
global.Buffer = global.Buffer || require('buffer').Buffer;

function init() {
  window.capi = window.capi || {
    follow: {
      init: initApi,
      render: cyberConnectFollowButtonRender,
      relations: {},
      connectInstance: null,
      namespace: '',
      ethProvider: '',
      env: 'PRODUCTION',
      fromAddr: '',
    },
  };

  capi = window.capi;
}

async function initApi({ namespace, ethProvider, env }) {
  if (capi.follow.connectInstance) {
    return;
  }

  if (!namespace) {
    throw {
      code: 'EmptyNamespace',
      message: 'Namespace can not be empty',
    };
  }

  if (!!env && env !== 'PRODUCTION' && env !== 'STAGING') {
    throw {
      code: 'WrongEnvValue',
      message: 'The value of env can only be either PRODUCTION or STAGING',
    };
  }

  capi.follow.connectInstance = new CyberConnect({
    ethProvider,
    namespace,
    env: env || 'PRODUCTION',
  });

  capi.follow = { ...capi.follow, namespace, ethProvider, env };

  const addresses = await ethProvider.request({ method: 'eth_accounts' });
  if (addresses && addresses[0]) {
    capi.follow.fromAddr = addresses[0];
  } else {
    throw {
      code: 'NoETHAccount',
      message: 'Can not find the wallet address by the given provider',
    };
  }
}

async function handleButtonClick({
  relation,
  toAddr,
  buttonWrapper,
  onSuccess,
  onFailure,
}) {
  const following = capi.follow.relations[relation]?.following;
  buttonWrapper.classList.add('loading');

  try {
    if (following) {
      await unfollow(toAddr);
    } else {
      await follow(toAddr);
    }
    updateElementStatus(relation, !following);
    if (onSuccess) {
      if (following) {
        onSuccess({
          code: 'UnfollowSuccess',
          toAddr,
        });
      } else {
        onSuccess({
          code: 'FollowSuccess',
          toAddr,
        });
      }
    }
  } catch (e) {
    if (onFailure) {
      onFailure(e);
    }
    console.error(e);
    buttonWrapper.classList.remove('loading');
  }
}

function handleButtonMouseEnter(relation, buttonWrapper, followStatus) {
  const following = capi.follow.relations[relation]?.following;

  if (following) {
    followStatus.innerHTML = 'Unfollow';
  } else {
    buttonWrapper.classList.add('logoRotate');
  }
}

function handleButtonMouseLeave(relation, buttonWrapper, followStatus) {
  const following = capi.follow.relations[relation]?.following;
  buttonWrapper.classList.remove('logoRotate');

  if (following) {
    followStatus.innerHTML = 'Following';
  }
}

function createLoadingElement() {
  const circleProgress = document.createElement('div');
  circleProgress.classList.add('circleProgress');

  const svgns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgns, 'svg');
  svg.classList.add('circleProgress-svg');
  svg.setAttribute('viewBox', '22 22 44 44');

  const circle = document.createElementNS(svgns, 'circle');
  svg.classList.add('circleProgress-circle');
  circle.setAttributeNS(null, 'cx', '44');
  circle.setAttributeNS(null, 'cy', '44');
  circle.setAttributeNS(null, 'r', '19.5');
  circle.setAttributeNS(null, 'style', 'fill: none; stroke-width: 5;');

  svg.append(circle);
  circleProgress.append(svg);

  return circleProgress;
}

function addFollowElement({ button, fromAddr, toAddr, namespace, following }) {
  const relation = fromAddr + toAddr + namespace;
  const relations = capi.follow.relations;

  if (relations[relation]) {
    relations[relation].buttons.push(button);
  } else {
    relations[relation] = {
      buttons: [button],
      following,
    };
  }
}

async function cyberConnectFollowButtonRender(
  id,
  { toAddr, onSuccess, onFailure }
) {
  const buttonWrapper = document.getElementById(id);
  if (!buttonWrapper) {
    const event = {
      code: 'NoTargetElement',
      message: 'Can not find the element with the target id',
    };
    if (onFailure) {
      onFailure(event);
    }
    console.error(event);
    return;
  }

  buttonWrapper.innerHTML = '';

  const fromAddr = capi.follow.fromAddr;
  const env = capi.follow.env;
  const namespace = capi.follow.namespace;
  const relation = fromAddr + toAddr + namespace;
  const relations = capi.follow.relations;
  let following = false;

  // Query follow status
  if (!relations[relation]) {
    following = await getFollowStatus({
      fromAddr,
      toAddr,
      namespace,
      env,
    });
  }

  // Group buttons with the same relation
  addFollowElement({
    button: buttonWrapper,
    fromAddr,
    toAddr,
    namespace,
    following,
  });

  buttonWrapper.classList.add('cyberConnectFollowButtonWrapper');

  // Create elements inside of button
  const button = document.createElement('div');
  button.classList.add('cyberConnectFollowButton');

  const logo = document.createElement('div');
  logo.classList.add('cyberConnectLogo');

  const logoLeftIcon = document.createElement('img');
  logoLeftIcon.classList.add('connectLogoPart', 'connectLogoPartLeft');
  logoLeftIcon.src = logoLeftIconSvg;

  const logoRightIcon = document.createElement('img');
  logoRightIcon.classList.add('connectLogoPart', 'connectLogoPartRight');
  logoRightIcon.src = logoRightIconSvg;

  const buttonTextFollowStatus = document.createElement('div');
  buttonTextFollowStatus.classList.add('buttonText', 'followStatus');
  if (following) {
    buttonTextFollowStatus.innerHTML = 'Following';
  } else {
    buttonTextFollowStatus.innerHTML = 'Follow';
  }

  // Create loading
  const circleProgress = createLoadingElement();

  // Add listener
  buttonWrapper.addEventListener('mouseenter', () =>
    handleButtonMouseEnter(relation, buttonWrapper, buttonTextFollowStatus)
  );
  buttonWrapper.addEventListener('mouseleave', () =>
    handleButtonMouseLeave(relation, buttonWrapper, buttonTextFollowStatus)
  );
  button.addEventListener('click', () => {
    handleButtonClick({
      relation,
      toAddr,
      buttonWrapper,
      onSuccess,
      onFailure,
    });
  });

  // Assmble button
  logo.append(logoLeftIcon, logoRightIcon);
  button.append(logo, buttonTextFollowStatus);
  buttonWrapper.append(button, circleProgress);
}

async function getFollowStatus({ fromAddr, toAddr, namespace, env }) {
  const result = await followStatus({ fromAddr, toAddr, namespace, env });
  return !!result?.data?.followStatus?.isFollowing;
}

function updateElementStatus(relation, following) {
  const relations = capi.follow.relations;
  relations[relation].following = following;

  relations[relation].buttons.forEach((button) => {
    if (button) {
      const followStatus = button.querySelector('.followStatus');
      if (following) {
        if (followStatus) {
          followStatus.innerHTML = 'Following';
        }
        button.classList.add('logoRotate');
      } else {
        if (followStatus) {
          followStatus.innerHTML = 'Follow';
        }
      }
      button.classList.remove('loading');
    }
  });
}

async function follow(toAddr) {
  const connectInstance = capi.follow.connectInstance;
  if (!connectInstance) {
    throw {
      code: 'FollowError',
      message: 'Can not find the connect instance',
    };
  }

  try {
    await connectInstance.connect(toAddr);
  } catch (e) {
    throw {
      code: 'FollowError',
      message: e.message || e,
    };
  }
}

async function unfollow(toAddr) {
  const connectInstance = capi.follow.connectInstance;
  if (!connectInstance) {
    throw {
      code: 'UnfollowError',
      message: 'Can not find the connect instance',
    };
  }

  try {
    await connectInstance.disconnect(toAddr);
  } catch (e) {
    console.log(e);
    throw {
      code: 'UnfollowError',
      message: e.message || e,
    };
  }
}

init();
