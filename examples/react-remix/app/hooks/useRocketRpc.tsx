import { useEffect, useRef } from "react";
import { Client } from "../../../../src";
import type { API } from "../../../prisma/server";

export const useRocketRpc = () => {
  const clientRef = useRef<ReturnType<typeof Client<API>> | null>(null);

  useEffect(() => {
    if (!clientRef.current) {
      clientRef.current = Client<API>("http://localhost:8080");
    }

    return () => {
      clientRef.current?._rocketRpcContext.closeConnection();
    };
  }, []);

  return clientRef.current;
};
