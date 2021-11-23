const endpoints = {
  stg: {
    cyberConnectApi: 'https://api.stg.cybertino.io/connect/',
  },
  production: {
    cyberConnectApi: 'https://api.cybertino.io/connect/',
  },
};

const request = async (url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

const followStatusQuerySchema = ({ fromAddr, toAddr, namespace }) => {
  return `query {\n  followStatus(fromAddr: \"${fromAddr}\", toAddr: \"${toAddr}\", namespace: \"${namespace}\") {\n    isFollowing\n  }\n}\n`;
};

export const followStatus = ({ fromAddr, toAddr, namespace, env }) => {
  const schema = followStatusQuerySchema({
    fromAddr,
    toAddr,
    namespace,
    env,
  });

  const url = (endpoints[env] || endpoints['production']).cyberConnectApi;

  return request(url, {
    query: schema,
    variables: {},
    operationName: null,
  });
};
