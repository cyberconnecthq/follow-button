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

const followStatusQuerySchema = ({
  fromAddr,
  toAddr,
  namespace,
}: {
  fromAddr: string;
  toAddr: string;
  namespace: string;
}) => {
  return `query {\n  followStatus(fromAddr: \"${fromAddr}\", toAddr: \"${toAddr}\", namespace: \"${namespace}\") {\n    isFollowing\n  }\n}\n`;
};

const handleQuery = (query: string, url: string, variables: object = {}) => {
  return request(url, {
    query,
    variables,
    operationName: null,
  });
};

export const followStatus = ({
  fromAddr,
  toAddr,
  namespace,
  url,
}: {
  fromAddr: string;
  toAddr: string;
  namespace: string;
  url: string;
}) => {
  const schema = followStatusQuerySchema({
    fromAddr,
    toAddr,
    namespace,
  });

  return handleQuery(schema, url);
};
