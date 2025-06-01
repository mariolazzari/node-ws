import parseArgs from "argv";
import Timer from "tiny-timer";

const { time } = parseArgs.option(process.argv);

if (!time) {
  console.error("Please provide a time argument.");
  process.exit(1);
}

if (isNaN(time)) {
  console.error("The time argument must be a number.");
  process.exit(1);
}

const timer = new Timer();

timer.on("tick", ms => {
  console.log(`Tick: ${ms} ms`);
});

timer.on("done", () => {
  console.log("Timer finished!");
});

timer.start(time * 1000);
