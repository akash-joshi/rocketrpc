import { useEffect, useState } from "react";
import { Client } from "../../src";
import type { API } from "../../examples/prisma/server";

export const useClient = (endpoint: string) => {
  return Client<API>(endpoint);
};

export const useRocketRpc = (endpoint: string) => {
  const [client, setClient] = useState<ReturnType<typeof Client<API>> | null>(
    null
  );

  useEffect(() => {
    setClient(Client<API>(endpoint));

    return () => {
      client?._rocketRpcContext.closeConnection();
    };
  }, [endpoint]);

  console.log(client?._rocketRpcContext);

  if (!client?._rocketRpcContext?.socket.connected) {
    return null;
  }

  return client;
};
