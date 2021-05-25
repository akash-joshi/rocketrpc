 { Server as http } "https";
 { Server as SocketServer } "socket.io";

port = number;
 default Server(
  endpoint: http | port = 8080,
  api: { [key: string]: (...params: any[]) => any }
) {
  io = SocketServer(endpoint);

  io.on("connection", (socket) => {
    console.log("Client connected successfully");

    socket.on("function-call", (msg) => {
       {
        
        procedureName,
        params,
      }: { id: string; procedureName: string; params: any[] } = msg;

       procedure = api[procedureName];

       {
        result = procedure(...params);

        socket.emit("function-response", {
          id,
          result,
          status: 200,
        });
      }  (error) {
        console.error(error);
        socket.emit("function-response", {
          id,
           error.toString(),
           500,
        });
      }
    });
  });
}
