double temperature = 0.0;
int out = 0.0;

int humidity = 0;
int temperatureFromDht = 0;
int ms = millis();

const int RED_LED_PIN = A1;
const int GREEN_LED_PIN = A0;
const int BLUE_LED_PIN = A4;

const int TEMPERATURE = A3;
const int PHOTORESISTOR = A5;
const int DHT11 = D0;

void setup() {
  Spark.variable("temperature", &temperature, DOUBLE);
  Spark.variable("out", &out, INT);
  Spark.variable("humidity", &humidity, INT);
  Spark.variable("temperatureFromDht", &temperatureFromDht, INT);

  pinMode(TEMPERATURE, INPUT);
  pinMode(PHOTORESISTOR, INPUT);
  pinMode(DHT11, OUTPUT);
  digitalWrite(DHT11, HIGH);

  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(GREEN_LED_PIN, OUTPUT);
  pinMode(BLUE_LED_PIN, OUTPUT);
}

void loop() {
  if (millis()-ms > 10000) {
    int dht = readDht11();
    if (dht == -1) humidity = -1;
    ms = millis();
  }

  int temperatureReading = 0;
  double voltage = 0.0;

  // Keep reading the sensor value so when we make an API
  // call to read its value, we have the latest one
  temperatureReading = analogRead(TEMPERATURE);

  // The returned value from the Core is going to be in the range from 0 to 4095
  // Calculate the voltage from the sensor reading
  voltage = (temperatureReading * 3.3) / 4095;

  // Calculate the temperature and update our static variable
  temperature = (voltage - 0.5) * 100;

  int redAdj = (temperature*9)+50;
  if (redAdj < 0) redAdj = redAdj*-1;
  if (redAdj > 255) redAdj = 255;
  analogWrite(RED_LED_PIN, redAdj);

  int lightReading = analogRead(PHOTORESISTOR);
  // -200 is to make the changes more aparant, will be multiplicated
  int greenAdj = (lightReading/16)-230;
  if (greenAdj <= 0) greenAdj = 0;
  greenAdj = greenAdj*6.7;

  // Log before normalizing on the cap, to see how close we actually are :)
  out = greenAdj;

  if (greenAdj >= 255) greenAdj = 255;
  analogWrite(GREEN_LED_PIN, greenAdj);

  delay(500);
}

int readDht11() {
  uint8_t data[] = {0, 0, 0, 0, 0};
  noInterrupts();

  // Initial protocol, rules are:
  // Go to LOW >= 18 ms then HIGH, tells DHT11 we want data
  // DHT11 responds low, high, low in 80 microsecond intervals
  // if we don't read that, we return with an error.
  pinMode(DHT11, OUTPUT);
  digitalWrite(DHT11, LOW);
  delay(20);
  digitalWrite(DHT11, INPUT_PULLUP);
  if (detect_edge(DHT11, HIGH, 10, 200) == -1)
    return -1;
  if (detect_edge(DHT11, LOW, 10, 200) == -1)
    return -1;
  if (detect_edge(DHT11, HIGH, 10, 200) == -1)
    return -1;

  // Getting the data, whoa need to check the protocol here
  for (uint8_t i=0; i<40; i++) {
    if (detect_edge(DHT11, LOW, 10, 200))
      return -1;

    int counter = detect_edge(DHT11, HIGH, 10, 200);
    if (counter == -1)
      return -1;

    data[i/8] <<= 1;

    if (counter > 4) {
      data[i/8] |= 1;
    }
  }
  interrupts();

  // Validate the data, last part is a checksum
  if (data[4] != ((data[0]+data[1]+data[2]) & 0xFF))
      return -1;

  humidity = data[0];
  temperatureFromDht = data[2];

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
