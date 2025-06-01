import parseArgs from "argv";

const { time } = parseArgs.option(process.argv);

if (!time) {
  console.error("Please provide a time argument.");
  process.exit(1);
}

if (isNaN(time)) {
  console.error("The time argument must be a number.");
  process.exit(1);
}

console.log("time", time);
