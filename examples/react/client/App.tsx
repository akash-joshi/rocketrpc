import React, { useEffect, useState } from "react";
import Client from "../../../src/client";
import { API } from "../server";
import { User } from "@prisma/client";

const client = Client<API>("http://localhost:8080");

export function App() {
  const [methodResult, setMethodResult] = useState("loading...");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    client.ping("World!").then(setMethodResult);
    client.prisma.user.findMany().then(setUsers);
  }, []);

  return (
    <main>
      <h1>Hello world!</h1>
      <h2>Ping Result: {methodResult}</h2>

      <h2>Users</h2>
      <ol>
        {users.map(user => <li>{user.name} - {user.username} at {user.email}</li>)}
      </ol>
    </main>
  );
}
