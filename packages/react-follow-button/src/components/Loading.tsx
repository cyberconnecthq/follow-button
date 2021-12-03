import React from 'react';
import useStyles from './loading.style';

export const LoadingIcon = () => {
  const classes = useStyles();

  return (
    <div className={classes.circleProgress}>
      <svg className={classes.circleProgressSvg} viewBox="22 22 44 44">
        <circle
          className={classes.circleProgressCircle}
          cx={44}
          cy={44}
          r={19.5}
          style={{ fill: 'none', strokeWidth: 5 }}
        ></circle>
      </svg>
    </div>
  );
};
