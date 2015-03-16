//#define DHT 1

double temperature = 0.0;
int light = 0;

int humidity = 0;
int temperatureFromDht = 0;
int ms = 0;

const int RED_LED_PIN = A1;
const int GREEN_LED_PIN = A0;
const int BLUE_LED_PIN = A4;

const int TEMPERATURE = A3;
const int PHOTORESISTOR = A5;
const int DHT11 = D0;

char chordRegister[2048] = "";
char getData[2048] = "";

void setup() {
#ifdef DHT
  Spark.variable("humidity", &humidity, INT);
  Spark.variable("temperature2", &temperatureFromDht, INT);
  pinMode(DHT11, INPUT_PULLUP);
#endif

  Spark.variable("temperature", &temperature, DOUBLE);
  Spark.variable("light", &light, INT);

  Spark.variable("register", &chordRegister, STRING);
  Spark.variable("getData", &getData, STRING);

  pinMode(TEMPERATURE, INPUT);
  pinMode(PHOTORESISTOR, INPUT);

  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(GREEN_LED_PIN, OUTPUT);
  pinMode(BLUE_LED_PIN, OUTPUT);

  updateChordRegister();
  updateGetData();
}

double getTemperature() {
  int temperatureReading = 0;
  double voltage = 0.0;

  // Keep reading the sensor value so when we make an API
  // call to read its value, we have the latest one
  temperatureReading = analogRead(TEMPERATURE);

  // The returned value from the Core is going to be in the range from 0 to 4095
  // Calculate the voltage from the sensor reading
  voltage = (temperatureReading * 3.3) / 4095;

  // Calculate the temperature and update our static variable
  return (voltage - 0.5) * 100;
}

int getLight() {
  int lightReading = analogRead(PHOTORESISTOR);
  // Conversion from 0-4095 to 0-255 scale
  lightReading = lightReading/16;
  return lightReading;
}

void setDiodeColor(int diode, int value) {
  if (value < 0) value = 0;
  if (value > 255) value = 255;

  analogWrite(diode, value);
}

void loop() {
#ifdef DHT
  if (millis()-ms > 10000) {
    readDht11(DHT11, &humidity, &temperatureFromDht);
    ms = millis();
  }
#endif

  temperature = getTemperature();

  int redAdj = (temperature*9);
  setDiodeColor(RED_LED_PIN, redAdj);

  light = getLight();
  // -210 is to make the changes more aparant, will be multiplicated
  int greenAdj = light-210;
  greenAdj = greenAdj*6.7;
  setDiodeColor(GREEN_LED_PIN, greenAdj);

  updateGetData();
  delay(250);
}

#ifdef DHT
int readDht11(int pin, int *humidityI, int *temperatureI) {
  uint8_t data[] = {0, 0, 0, 0, 0};
  noInterrupts();

//   // Initial protocol, rules are:
//   // Go to LOW >= 18 ms then HIGH, tells DHT11 we want data
//   // DHT11 responds low, high, low in 80 microsecond intervals
//   // if we don't read that, we return with an error.
  pinMode(pin, OUTPUT);
  digitalWrite(pin, LOW);
  delay(20);
  pinMode(pin, INPUT_PULLUP);
  if (detect_edge(pin, HIGH, 10, 200) == -1) {
    return -1;
  }
  if (detect_edge(pin, LOW, 10, 200) == -1) {
    return -1;
  }
  if (detect_edge(pin, HIGH, 10, 200) == -1) {
    return -1;
  }

//   // Getting the data, whoa need to check the protocol here
  for (uint8_t i = 0; i < 40; i++) {
    if (detect_edge(pin, LOW, 10, 200) == -1) {
      return -1;
    }

    int counter = detect_edge(pin, HIGH, 10, 200);
    if (counter == -1)
      return -1;

    data[i/8] <<= 1;

    if (counter > 4) {
      data[i/8] |= 1;
    }
  }
  interrupts();

//   // Validate the data, last part is a checksum
  if (data[4] != ((data[0]+data[1]+data[2]) & 0xFF))
      return -1;

  *humidityI = data[0];
  *temperatureI = data[2];

   return 0;
}

int detect_edge(int pin, int val, int interval, int timeout) {
  int counter = 0;
  while (digitalRead(pin) == val && counter < timeout) {
    delayMicroseconds(interval);
    ++counter;
  }

  if (counter > timeout) {
    return -1;
  }

  return counter;
}
#endif

void updateChordRegister() {
  int key;
  String name;

  String accessToken = "fca18535974a364f88989f51ac2ef84dd91a8285";
  String deviceId;
  #ifdef DHT
  deviceId = "54ff6f066678574950300667";
  key = 13;
  name = "laser_penguin";
  #else
  deviceId = "53ff6f066667574830460967";
  key = 42;
  name = "SparkleParty";
  #endif
  char contentUrl[256];
  sprintf(contentUrl, "https://api.spark.io/v1/devices/%s/getData?access_token=%s", deviceId.c_str(), accessToken.c_str());

  String str = "{\"key\": \"%d\", \"name\": \"%s\", \"contentUrl\": \"%s\"}";

  sprintf(chordRegister, str.c_str(), key, name.c_str(), contentUrl);
}

void updateGetData() {
  // Return json
  #ifdef DHT
  String str = "{\"ponystring\": \"моя маленькая пони\", \"temperature\": \"%f\", \"light\": \"%d\", \"temperature2\": \"%d\", \"humidity\": \"%d\"}";
  sprintf(getData, str.c_str(), temperature, light, temperatureFromDht, humidity);
  #else
  String str = "{\"ponystring\": \"моя маленькая пони\", \"temperature\": \"%f\", \"light\": \"%d\"}";
  sprintf(getData, str.c_str(), temperature, light);
  #endif
}
