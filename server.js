const express = require("express");
const app = express();
const http = require("http").createServer(app);

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.use(express.static(`${__dirname}/public`));

http.listen(3000, () => console.log("listen 3000"));

const io = require("socket.io")(http);
io.on("connection", (socket) => {
  socket.username = "Anonymous";

  socket.on("change__username", (data) => {
    socket.username = data.username;
  });

  socket.on("new_message", (data) => {
    io.sockets.emit("add_mess", {
      username: socket.username,
      message: data.message,
    });
  });
  console.log("New user connected");

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", { username: socket.username });
  });
});
