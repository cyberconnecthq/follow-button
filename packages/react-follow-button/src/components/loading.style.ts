import { createUseStyles } from 'react-jss';

export default createUseStyles({
  '@keyframes progressLoading': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },

  '@keyframes circleLoading': {
    '0%': {
      'stroke-dasharray': '1px, 200px',
      'stroke-dashoffset': 0,
    },
    '50%': {
      'stroke-dasharray': '100px, 200px',
      'stroke-dashoffset': '-15px',
    },
    '100%': {
      'stroke-dasharray': '100px, 200px',
      'stroke-dashoffset': '-125px',
    },
  },

  circleProgress: {
    width: '20px',
    height: '20px',
    display: 'inline-block',
    color: '#000',
    '-webkit-animation': '$progressLoading 1.4s linear infinite',
    animation: '$progressLoading 1.4s linear infinite',
    boxSizing: 'border-box',
  },
  circleProgressSvg: {
    display: 'block',
    boxSizing: 'border-box',
    color: '#fff',
  },
  circleProgressCircle: {
    stroke: 'currentColor',
    'stroke-dasharray': '80 px, 200 px',
    'stroke-dashoffset': 0,
    '-webkit-animation': '$circleLoading 1.4s ease-in-out infinite',
    animation: '$circleLoading 1.4s ease-in-out infinite',
  },
});
