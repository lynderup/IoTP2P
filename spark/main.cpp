#define DHT 1
#include "application.h"
#include "dht11.h"

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

void updateChordRegister();
void updateGetData();

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

void updateChordRegister() {
  int key = 42;
  String name = "Rohde er gud";

  String accessToken = "fca18535974a364f88989f51ac2ef84dd91a8285";
  String deviceId = "54ff6f066678574950300667";
  char contentUrl[256];
  sprintf(contentUrl, "https://api.spark.io/v1/devices/%s/getData?access_token=%s", deviceId.c_str(), accessToken.c_str());

  String str = "{\"key\": \"%d\", \"name\": \"%s\", \"contentUrl\": \"%s\"}";

  sprintf(chordRegister, str.c_str(), key, name.c_str(), contentUrl);
}

void updateGetData() {
  // Return json
  String str = "{\"temperature\": \"%f\", \"light\": \"%d\"}";
  sprintf(getData, str.c_str(), temperature, light);
}
