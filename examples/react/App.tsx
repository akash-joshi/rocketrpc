import React, { useEffect, useState } from "react";
import { Client } from "../../src";
import { User } from "@prisma/client";
import { API } from "../prisma/server";

const client = Client<API>("http://localhost:8080");

const { sum } = client;

export function App() {
  const [helloResult, setHelloResult] = useState("loading...");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    client.ping("World!").then(setHelloResult);
  }, []);

  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [sumResult, setSumResult] = useState(0);

  useEffect(() => {
    sum(num1, num2).then(setSumResult);
  }, [num1, num2]);

  useEffect(() => {
    client.prisma.user.findMany().then(setUsers);
  }, []);

  console.log({ users });

  return (
    <main>
      <h1>Hello world!</h1>
      <h2>Ping Result: {helloResult}</h2>
      <h2>
        Sum of{" "}
        <input
          value={num1}
          onChange={(e) => setNum1(parseInt(e.target.value))}
          type="number"
        />{" "}
        and{" "}
        <input
          value={num2}
          onChange={(e) => setNum2(parseInt(e.target.value))}
          type="number"
        />{" "}
        is {sumResult}
      </h2>
    </main>
  );
}
