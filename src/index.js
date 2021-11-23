import CyberConnect from '@cyberlab/cyberconnect';
import { followStatus } from './query.js';
// import logoLeftIconSvg from './icon/logo-left.svg';
// import logoRightIconSvg from './icon/logo-right.svg';
import './index.css';

function initApi() {
  window.capi = window.capi || {
    follow: {
      render: cyberConnectFollowButtonRender,
      relations: {},
    },
  };

  capi = window.capi;
}

initApi();

function initCyberConnect({ ethProvider, namespace, env }) {
  if (capi.follow.connectInstance) {
    return;
  }

  console.log(CyberConnect);

  capi.follow.connectInstance = new CyberConnect({
    ethProvider,
    namespace,
    env,
  });
}

async function handleButtonClick(relation, toAddr, buttonWrapper) {
  console.log('click');
  const following = capi.follow.relations[relation]?.following;
  buttonWrapper.classList.add('loading');

  try {
    if (following) {
      await unfollow(toAddr);
    } else {
      await follow(toAddr);
    }
    updateElementStatus(relation, !following);
  } catch (e) {
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
    console.log('already has the relation: ', relation);
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
  { fromAddr, toAddr, namespace, ethProvider, env }
) {
  const buttonWrapper = document.getElementById(id);
  if (!buttonWrapper) {
    console.error('Can not find the target id');
    return;
  }

  if (buttonWrapper.children.length > 0) {
    console.error('Already render the button');
    return;
  }

  initCyberConnect({ ethProvider, namespace, env });

  const relation = fromAddr + toAddr + namespace;
  const relations = capi.follow.relations;
  let following = false;

  if (!relations[relation]) {
    following = await getFollowStatus({
      fromAddr,
      toAddr,
      namespace,
      env,
    });
  }

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
  // logoLeftIcon.src = logoLeftIconSvg;
  logoLeftIcon.src = '';

  const logoRightIcon = document.createElement('img');
  logoRightIcon.classList.add('connectLogoPart', 'connectLogoPartRight');
  // logoRightIcon.src = logoRightIconSvg;
  logoRightIcon.src = '';

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
    handleButtonClick(relation, toAddr, buttonWrapper, buttonTextFollowStatus);
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
      const followStatus = button.querySelector('.followStatus')[0];
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
    throw 'Can not find the connect instance';
  }

  try {
    const resutl = await connectInstance.connect(toAddr);
  } catch (e) {
    throw ('follow error: ', e);
  }
}

async function unfollow(toAddr) {
  const connectInstance = capi.follow.connectInstance;
  if (!connectInstance) {
    throw 'Can not find the connect instance';
  }

  try {
    const resutl = await connectInstance.disconnect(toAddr);
  } catch (e) {
    throw ('unfollow error: ', e);
  }
}
