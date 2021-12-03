import { createUseStyles } from 'react-jss';

export default createUseStyles({
  cyberConnectFollowButtonWrapper: {
    position: 'relative',
    width: '141px',
    height: '44px',
    boxSizing: 'border-box',
    borderRadius: '4px',
    background: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    '&.logoRotate $cyberConnectLogo': {
      transform: 'rotate(-45deg)',
    },
    '&.logoRotate $connectLogoPartLeft': {
      left: '1.115px',
    },
    '&.logoRotate $connectLogoPartRight': {
      right: '1.115px',
    },
  },
  logoRotate: {},
  cyberConnectFollowButton: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '0 20px',
    transition: 'background-color 0.3s',
    background: '#000000',
    boxSizing: 'border-box',
    borderRadius: '4px',
    '&:hover': {
      background: '#000000cc',
    },
  },
  cyberConnectLogo: {
    width: '17.84px',
    position: 'relative',
    display: 'flex',
    transition: 'all 0.3s',
  },
  connectLogoPart: {
    width: '8.92px',
    height: '15.99px',
    position: 'relative',
    transition: 'all 0.3s',
  },
  connectLogoPartLeft: {
    left: '-1.115px',
  },
  connectLogoPartRight: {
    right: '-1.115px',
  },
  buttonText: {
    fontFamily: "'Poppins', sans-serif",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '13px',
    lineHeight: '19px',
    color: '#ffffff',
    marginLeft: '19.735px',
    userSelect: 'none',
  },
});
