#include "application.h"

double getTemperature(int pin) {
  int temperatureReading = 0;
  double voltage = 0.0;

  // Keep reading the sensor value so when we make an API
  // call to read its value, we have the latest one
  temperatureReading = analogRead(pin);

  // The returned value from the Core is going to be in the range from 0 to 4095
  // Calculate the voltage from the sensor reading
  voltage = (temperatureReading * 3.3) / 4095;

  // Calculate the temperature and update our static variable
  return (voltage - 0.5) * 100;
}

int getLight(int pin) {
  int lightReading = analogRead(pin);
  // Conversion from 0-4095 to 0-255 scale
  lightReading = lightReading/16;
  return lightReading;
}

void setDiodeColor(int diode, int value) {
  if (value < 0) value = 0;
  if (value > 255) value = 255;

  analogWrite(diode, value);
}
