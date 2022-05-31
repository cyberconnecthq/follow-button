import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  FC,
} from "react";
import useStyles from "./button.style";
import LogoLeftIcon from "./LogoLeft";
import LogoRightIcon from "./LogoRight";
import { LoadingIcon } from "./Loading";
import { endpoints } from "@cyberlab/cyberconnect/lib/network";
import { followStatus } from "./../utils/queries";
import CyberConnect, {
  Env,
  Blockchain,
  getAddressByProvider,
} from "@cyberlab/cyberconnect";
import { Config } from "@cyberlab/cyberconnect/lib/types";
import { useIsMountedRef } from "./../hooks/useIsMountedRef";

interface SuccessEvent {
  code: string;
  toAddr: string;
}

interface FailureEvent {
  code: string;
  message: string;
}

interface StaticProperty {
  cyberConnect: CyberConnect | null;
}

export type FollowButtonProps = Config & {
  toAddr: string;
  onSuccess?: (event: SuccessEvent) => void;
  onFailure?: (event: FailureEvent) => void;
};

export const FollowButton: FC<FollowButtonProps> & StaticProperty = ({
  provider,
  namespace,
  env = Env.PRODUCTION,
  chain = Blockchain.ETH,
  chainRef,
  toAddr = "",
  onSuccess,
  onFailure,
}) => {
  const [following, setFollowing] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>("Follow");
  const [loading, setLoading] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showButton, setShowButton] = useState<boolean>(false);
  const [fromAddr, setFromAddr] = useState<string>("");
  const classes = useStyles();
  //Only update state when the button is mounted. See: https://www.debuggr.io/react-update-unmounted-component/
  const isMountedRef = useIsMountedRef();

  const apiURL = useMemo(() => {
    return endpoints[env].cyberConnectApi;
  }, [env]);

  const handleButtonMouseEnter = useCallback(() => {
    if (following) {
      setButtonText("Unfollow");
    } else {
      if (wrapperRef.current) {
        wrapperRef.current.classList.add("logoRotate");
      }
    }
  }, [following, wrapperRef]);

  const handleButtonMouseLeave = useCallback(() => {
    if (following) {
      setButtonText("Following");
    }
    if (wrapperRef.current) {
      wrapperRef.current.classList.remove("logoRotate");
    }
  }, [following, wrapperRef]);

  const updateElementStatus = useCallback(
    (following: boolean) => {
      setFollowing(following);
      if (following) {
        setButtonText("Following");
        if (wrapperRef.current) {
          wrapperRef.current.classList.remove("logoRotate");
        }
      } else {
        setButtonText("Follow");
      }
    },
    [wrapperRef]
  );

  const follow = useCallback(async (toAddr) => {
    const connectInstance = FollowButton.cyberConnect;
    if (!connectInstance) {
      throw {
        code: "FollowError",
        message: "Can not find the connect instance",
      };
    }

    try {
      await connectInstance.connect(toAddr);
    } catch (e: any) {
      throw {
        code: "FollowError",
        message: e.message || e,
      };
    }
  }, []);

  const unfollow = useCallback(async (toAddr) => {
    const connectInstance = FollowButton.cyberConnect;
    if (!connectInstance) {
      throw {
        code: "UnfollowError",
        message: "Can not find the connect instance",
      };
    }

    try {
      await connectInstance.disconnect(toAddr);
    } catch (e: any) {
      throw {
        code: "UnfollowError",
        message: e.message || e,
      };
    }
  }, []);

  const handleButtonClick = useCallback(async () => {
    if (!FollowButton.cyberConnect) {
      return;
    }

    setLoading(true);

    try {
      if (following) {
        await unfollow(toAddr);
      } else {
        await follow(toAddr);
      }

      updateElementStatus(!following);

      if (onSuccess) {
        onSuccess({
          code: following ? "UnfollowSuccess" : "FollowSuccess",
          toAddr,
        });
      }
    } catch (e: any) {
      if (onFailure) {
        onFailure(e);
      }
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [
    toAddr,
    following,
    updateElementStatus,
    follow,
    unfollow,
    onSuccess,
    onFailure,
  ]);

  const getFollowStatus = useCallback(async () => {
    if (showButton) {
      return;
    }

    if (!fromAddr || !toAddr || !namespace) {
      return;
    }

    const result = await followStatus({
      fromAddr,
      toAddr,
      namespace,
      url: apiURL,
    });

    if (!isMountedRef) return;

    if (result?.data?.followStatus?.isFollowing) {
      setFollowing(true);
      setButtonText("Following");
    }

    if (!showButton) {
      setShowButton(true);
    }
  }, [fromAddr, toAddr, namespace, apiURL, showButton]);

  const initCyberConnect = useCallback(() => {
    if (FollowButton.cyberConnect) {
      return;
    }

    if (!namespace) {
      console.error("Namespace can not be empty");
      throw {
        code: "EmptyNamespace",
        message: "Namespace can not be empty",
      };
    }

    // @ts-ignore
    FollowButton.cyberConnect = new CyberConnect({
      provider,
      namespace,
      chain,
      chainRef,
      env,
    });
  }, [namespace, provider, env]);

  const getUserAddress = useCallback(async () => {
    const address = await getAddressByProvider(provider, chain);
    if (isMountedRef) {
      if (address) {
        setFromAddr(address);
      } else {
        throw {
          code: "NoETHAccount",
          message: "Can not find the wallet address by the given provider",
        };
      }
    }
  }, [provider, chain]);

  useEffect(() => {
    try {
      initCyberConnect();
    } catch (e) {
      console.error(e);
      if (onFailure) {
        onFailure(e);
      }
    }
  }, [initCyberConnect, onFailure]);

  useEffect(() => {
    getUserAddress();
  }, [getUserAddress]);

  useEffect(() => {
    getFollowStatus();
  }, [fromAddr]);

  if (!showButton) {
    return null;
  }

  return (
    <div
      className={classes.cyberConnectFollowButtonWrapper}
      onMouseEnter={handleButtonMouseEnter}
      onMouseLeave={handleButtonMouseLeave}
      ref={wrapperRef}
    >
      {loading ? (
        <LoadingIcon />
      ) : (
        <div
          className={classes.cyberConnectFollowButton}
          onClick={handleButtonClick}
        >
          <div className={classes.cyberConnectLogo}>
            <LogoLeftIcon
              className={`${classes.connectLogoPart} ${classes.connectLogoPartLeft}`}
            />
            <LogoRightIcon
              className={`${classes.connectLogoPart} ${classes.connectLogoPartRight}`}
            />
          </div>
          <div className={classes.buttonText}>{buttonText}</div>
        </div>
      )}
    </div>
  );
};

FollowButton.cyberConnect = null;
