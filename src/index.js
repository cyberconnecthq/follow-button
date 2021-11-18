var capi = (window.capi = window.capi || {});
var cyberConnectCSSId = 'cyberConnectCSS';

if (document) {
  // Import CSS
  if (!document.getElementById(cyberConnectCSSId)) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.id = cyberConnectCSSId;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = './src/index.css';
    link.media = 'all';
    head.appendChild(link);
  }
}

async function handleButtonClick(relation, event, buttonWrapper, followStatus) {
  console.log('click');
  const following = capi.follow.relations[relation]?.following;
  buttonWrapper.classList.add('loading');

  if (following) {
    await unfollow();
    capi.follow.relations[relation].following = false;
    followStatus.innerHTML = 'Follow';
  } else {
    await follow();
    capi.follow.relations[relation].following = true;
    followStatus.innerHTML = 'Following';
    buttonWrapper.classList.remove('logoRotate');
  }

  buttonWrapper.classList.remove('loading');
  document.dispatchEvent(event);
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

function followEventHandler(e) {
  console.log(e);
}

function addFollowEventListener({
  element,
  fromAddr,
  toAddr,
  namespace,
  following,
}) {
  const relation = fromAddr + toAddr + namespace;
  const relations = capi.follow.relations;

  if (relations[relation]) {
    console.log('already has the relation: ', relation);
    relations[relation].elements.push(element);
    return relations[relation].event;
  } else {
    const event = new Event(relation, { bubbles: true });
    relations[relation] = {
      elements: [element],
      following,
      event,
    };
    document.addEventListener(relation, followEventHandler);
    return event;
  }
}

async function cyberConnectFollowButtonRender(
  id,
  { fromAddr, toAddr, namespace, network, provider }
) {
  const buttonWrapper = document.getElementById(id);
  if (!buttonWrapper) {
    console.error('Can not find the target id');
    return;
  }

  const following = await getFollowStatus();

  const event = addFollowEventListener({
    element: buttonWrapper,
    fromAddr,
    toAddr,
    namespace,
    following,
  });

  const relation = fromAddr + toAddr + namespace;

  buttonWrapper.classList.add('cyberConnectFollowButtonWrapper');

  // Create elements inside of button
  const button = document.createElement('div');
  button.classList.add('cyberConnectFollowButton');

  const logo = document.createElement('div');
  logo.classList.add('cyberConnectLogo');

  const logoLeftIcon = document.createElement('img');
  logoLeftIcon.classList.add('connectLogoPart', 'connectLogoPartLeft');
  logoLeftIcon.src = 'src/icon/logo-left.svg';

  const logoRightIcon = document.createElement('img');
  logoRightIcon.classList.add('connectLogoPart', 'connectLogoPartRight');
  logoRightIcon.src = 'src/icon/logo-right.svg';

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
    handleButtonClick(relation, event, buttonWrapper, buttonTextFollowStatus);
  });

  // Assmble button
  logo.append(logoLeftIcon, logoRightIcon);
  button.append(logo, buttonTextFollowStatus);
  buttonWrapper.append(button, circleProgress);
}

var capi = {
  follow: {
    render: cyberConnectFollowButtonRender,
    relations: {},
  },
};

function getFollowStatus() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(false);
    }, (Math.floor(Math.random() * 1) + 1) * 1000);
  });
}

function follow() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, (Math.floor(Math.random() * 1) + 1) * 1000);
  });
}

function unfollow() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, (Math.floor(Math.random() * 1) + 1) * 1000);
  });
}
