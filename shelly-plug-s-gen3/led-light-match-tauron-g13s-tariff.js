// Copyright: https://github.com/ArturT/shelly-scripts
// Docs: https://shelly-api-docs.shelly.cloud/gen2/Devices/Gen3/ShellyPlugSG3

// RGB (0-255)
let COLORS_255 = {
  BLUE: [0, 255, 255],
  RED: [255, 0, 0],
  ORANGE: [255, 50, 0],
  LIGHT_GREEN: [0, 255, 50],
  DARK_GREEN: [0, 255, 0]
};

// convert RGB (0-255) to RGB (0-100) that is expected by Shelly
function getConvertedColor(colorName) {
  let c255 = COLORS_255[colorName];
  return [
    Math.round((c255[0] / 255) * 100),
    Math.round((c255[1] / 255) * 100),
    Math.round((c255[2] / 255) * 100)
  ];
}

let lastHour = -1;

function updateLed() {
  let now = new Date();
  let hour = now.getHours();

  if (hour === lastHour) {
    return; // skip the led update if we already did it
  }
  print("---");

  let month = now.getMonth() + 1;
  let day = now.getDay();
  let isWeekend = (day === 0 || day === 6);
  let isSummer = (month >= 4 && month <= 9);

  let colorName = "BLUE"; // default for night tariff

  if (isSummer) {
    if (isWeekend) {
      print("Summer weekend.");
      if (hour >= 7 && hour < 9) colorName = "LIGHT_GREEN";
      else if (hour >= 9 && hour < 17) colorName = "DARK_GREEN";
      else if (hour >= 17 && hour < 21) colorName = "LIGHT_GREEN";
    } else {
      print("Summer workday.");
      if (hour >= 7 && hour < 9) colorName = "RED";
      else if (hour >= 9 && hour < 17) colorName = "LIGHT_GREEN";
      else if (hour >= 17 && hour < 21) colorName = "RED";
    }
  } else { // Winter
    if (isWeekend) {
      print("Winter weekend.");
      if (hour >= 7 && hour < 10) colorName = "ORANGE";
      else if (hour >= 10 && hour < 15) colorName = "DARK_GREEN";
      else if (hour >= 15 && hour < 21) colorName = "ORANGE";
    } else {
      print("Winter workday.");
      if (hour >= 7 && hour < 10) colorName = "RED";
      else if (hour >= 10 && hour < 15) colorName = "ORANGE";
      else if (hour >= 15 && hour < 21) colorName = "RED";
    }
  }

  let c100 = getConvertedColor(colorName);
  let c255 = COLORS_255[colorName];

  Shelly.call(
    "PLUGS_UI.SetConfig",
    {
      config: {
        leds: {
          mode: "switch", // allow custom LED colors
          colors: {
            "switch:0": {
              on: { rgb: c100, brightness: 100 },
              off: { rgb: c100, brightness: 100 }
            }
          }
        }
      }
    },
    function (result, error_code, error_message) {
      if (error_code !== 0) {
        print("Error:", error_message);
      } else {
        print("Success: LED light's color has been updated to: ", colorName, ' at ', now);
        print("RGB (0-255): [", c255[0], ",", c255[1], ",", c255[2], "] as RGB (0-100): [", c100[0], ",", c100[1], ",", c100[2], "]");
      }
    }
  );

  lastHour = hour;
}

// repeat every 30s
Timer.set(30000, true, updateLed);

// run on the script start
updateLed();
