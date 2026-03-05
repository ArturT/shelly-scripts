function checkTemperature() {
  Shelly.call("Switch.GetStatus", { id: 0 }, function (result) {
    if (result && result.temperature) {
      print("Switch Temp (C): " + result.temperature.tC);
    } else {
      print("Temperature not found in Switch status.");
    }
  });
}

print("Temperature check start");
checkTemperature();

Timer.set(
  10000, // Repeat every 10 seconds
  true, // Repeat: true
  checkTemperature
);
