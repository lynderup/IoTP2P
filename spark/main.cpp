#define DHT 1
#include "application.h"
#include "sensors.h"
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

void loop() {
#ifdef DHT
  if (millis()-ms > 10000) {
    readDht11(DHT11, &humidity, &temperatureFromDht);
    ms = millis();
  }
#endif

  temperature = getTemperature(TEMPERATURE);

  int redAdj = (temperature*9);
  setDiodeColor(RED_LED_PIN, redAdj);

  light = getLight(PHOTORESISTOR);
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
