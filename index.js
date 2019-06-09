const express = require("express");
const http = require("http");
const PORT = process.env.PORT || 5355;
const app = express();
app.use(express.static("src"));
const server = http.createServer(app);
const io = require("socket.io")(server);
var five = require("johnny-five");
const board = new five.Board();

const STOP_THRESHOLD = 0.2;

const main = () => {
  var configs = five.Motor.SHIELD_CONFIGS.SEEED_STUDIO;
  var leftMotor = new five.Motor(configs.B);
  var rightMotor = new five.Motor(configs.A);

  server.listen(PORT, () => {
    console.log("listening on PORT :", PORT);
  });

  const convert = x => {
    return parseInt(100 * Math.abs(x) + 100)
  }

  const moveLeftMotor = ly => {
    if(ly < STOP_THRESHOLD && ly > STOP_THRESHOLD * -1) {
      leftMotor.stop()
    } else if (ly > STOP_THRESHOLD) {
      leftMotor.forward(convert(ly));
    } else if (ly < STOP_THRESHOLD * -1) {
      leftMotor.reverse(convert(ly));
    }
  }

  const moveRightMotor = ry => {
    if(ry < STOP_THRESHOLD && ry > STOP_THRESHOLD * -1) {
      rightMotor.stop()
    } else if (ry > STOP_THRESHOLD) {
      rightMotor.forward(convert(ry));
    } else if (ry < STOP_THRESHOLD * -1) {
      rightMotor.reverse(convert(ry));
    }
  }

  const handleJoyStickLY = data => {
    moveLeftMotor(data)
  }

  const handleJoyStickRY = data => {
    moveRightMotor(data * -1)
  }

  io.on("connection", socket => {
    console.log('new user connected');

    socket.on("joystickLY", data => handleJoyStickLY(data))
    socket.on("joystickRY", data => handleJoyStickRY(data))
  });
}

board.on("ready", () => {
  main();
});