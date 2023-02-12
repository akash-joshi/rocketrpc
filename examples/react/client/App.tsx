import React, { useEffect, useState } from "react";
import Client from "../../../src/client";
import { API } from "../server";

const client = Client<API>("http://localhost:8080");

export function App() {
  const [methodResult, setMethodResult] = useState("loading...");

  useEffect(() => {
    client.myFunction("thisfunc").then(setMethodResult);
  }, []);

  return (
    <main>
      <h1>Hello world!</h1>
      <h2>Method Result: {methodResult}</h2>
    </main>
  );
}
