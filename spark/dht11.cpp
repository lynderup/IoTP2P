#include "application.h"

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

int readDht11(int pin, int *humidity, int *temperature) {
  uint8_t data[] = {0, 0, 0, 0, 0};
  noInterrupts();

  // Initial protocol, rules are:
  // Go to LOW >= 18 ms then HIGH, tells DHT11 we want data
  // DHT11 responds low, high, low in 80 microsecond intervals
  // if we don't read that, we return with an error.
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

  // Getting the data, whoa need to check the protocol here
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

  *humidity = data[0];
  *temperature = data[2];

  return 0;
}
