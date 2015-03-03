double temperature = 0.0;
int out = 0.0;

const int RED_LED_PIN = A1;
const int GREEN_LED_PIN = A0;
const int BLUE_LED_PIN = A4;

const int TEMPERATURE = A3;
const int PHOTORESISTOR = A5;

void setup() {
  Spark.variable("temperature", &temperature, DOUBLE);
  Spark.variable("out", &out, INT);

  pinMode(TEMPERATURE, INPUT);
  pinMode(PHOTORESISTOR, INPUT);

  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(GREEN_LED_PIN, OUTPUT);
  pinMode(BLUE_LED_PIN, OUTPUT);
}

void loop()
{
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
  int greenAdj = (lightReading/16)-200;
  if (greenAdj <= 0) greenAdj = 0;
  greenAdj = greenAdj*6.7;

  // Log before normalizing on the cap, to see how close we actually are :)
  out = greenAdj;

  if (greenAdj >= 255) greenAdj = 255;
  analogWrite(GREEN_LED_PIN, greenAdj);

  delay(250);
}