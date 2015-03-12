TARGET  = firmware.bin
SOURCES = *.h *.cpp

all : $(TARGET)

$(TARGET): $(SOURCES)
	spark compile $(SOURCES) $(TARGET)

install: $(TARGET)
	spark flash $(SPARK_CORE_ID) $(TARGET)

clean:
	rm -f $(TARGET)

check-syntax:
	spark compile $(SOURCES) $(TARGET) | sed s/cpp/ino/
