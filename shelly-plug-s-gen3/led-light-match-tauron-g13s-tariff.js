// Paleta Wysokiego Kontrastu (0-255)
let COLORS_255 = {
  RED: [255, 0, 0],         // 1. Najdrożej (Zima szczyt)
  MAGENTA: [255, 0, 255],   // 2. Bardzo drogo (Lato szczyt)
  YELLOW: [255, 200, 0],    // 3. Drogo (Zima środek/weekendy)
  WHITE: [255, 255, 255],   // 4. Stawka neutralna (Zima/Lato weekendy wybrane godziny)
  BLUE: [0, 0, 255],        // 5. Noce (codziennie)
  CYAN: [0, 255, 255],      // 6. Tanio (Lato robocze środek dnia)
  GREEN: [0, 255, 0]        // 7. Najtaniej (Lato weekendy środek dnia)
};

let lastHour = -1;

// Funkcja pomocnicza: przelicza RGB (0-255) na RGB (0-100) jako liczby całkowite
function getConvertedColor(colorName) {
  let c255 = COLORS_255[colorName];
  return [
    Math.round((c255[0] / 255) * 100),
    Math.round((c255[1] / 255) * 100),
    Math.round((c255[2] / 255) * 100)
  ];
}

function updateLed() {
  let now = new Date();
  let hour = now.getHours();

  if (hour !== lastHour) {
    let month = now.getMonth() + 1;
    let day = now.getDay();
    let isWeekend = (day === 0 || day === 6);
    let isSummer = (month >= 4 && month <= 9);

    let colorName = "BLUE"; // Domyślnie Niebieski dla najtańszych godzin nocnych

    if (!isSummer) {
      // ZIMA (1 października - 31 marca)
      if (!isWeekend) {
        if ((hour >= 7 && hour < 10) || (hour >= 15 && hour < 21)) colorName = "RED";
        else if (hour >= 10 && hour < 15) colorName = "YELLOW";
      } else {
        // Zimowe weekendy
        if (hour >= 8 && hour < 11) colorName = "YELLOW";
        else if (hour >= 11 && hour < 15) colorName = "WHITE";
        else if (hour >= 15 && hour < 22) colorName = "YELLOW";
      }
    } else {
      // LATO (1 kwietnia - 30 września)
      if (!isWeekend) {
        if ((hour >= 7 && hour < 9) || (hour >= 17 && hour < 21)) colorName = "MAGENTA";
        else if (hour >= 9 && hour < 17) colorName = "CYAN";
      } else {
        // Letnie weekendy
        if (hour >= 7 && hour < 9) colorName = "WHITE";
        else if (hour >= 9 && hour < 18) colorName = "GREEN";
        else if (hour >= 18 && hour < 22) colorName = "WHITE";
      }
    }

    // Pobranie przeliczonych wartości (0-100) oraz oryginalnych (0-255) dla logów
    let c100 = getConvertedColor(colorName);
    let c255 = COLORS_255[colorName];

    Shelly.call(
      "PLUGS_UI.SetConfig",
      {
        config: {
          leds: {
            mode: "switch", // Automatycznie wymusza tryb "Stan przełącznika" w aplikacji
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
          print("BŁĄD API Shelly:", error_message);
        } else {
          print("SUKCES: Zmieniono tryb na 'switch' i ustawiono kolor.");
        }
      }
    );

    // Szczegółowy log ułatwiający weryfikację
    print("Zmiana taryfy! Godzina:", hour, ":00 -> Kolor:", colorName);
    print("Wysłano RGB (0-255): [", c255[0], ",", c255[1], ",", c255[2], "] jako RGB (0-100): [", c100[0], ",", c100[1], ",", c100[2], "]");

    lastHour = hour;
  }
}

// Sprawdzaj co 30 sekund
Timer.set(30000, true, updateLed);

// Uruchom od razu przy zapisaniu/starcie
updateLed();
