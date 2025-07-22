#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <string>
#include<BluetoothSerial.h>

// put function declarations here:
void setupWifi();
void setupMqtt();
void reconnect();
void callback(char* topic, byte* payload, unsigned int length);
void setupELM();
String getVin();
String parseVinFromResponse(const String& rawResponse);

const char* ssid = "Mreza";
const char* password = "anecespogoditstoposto";
const char* mqtt_server = "192.168.187.232";
const int mqtt_port = 1883;
BluetoothSerial SerialBT;
#define ELM_PORT SerialBT
bool elmConnected = false; 

unsigned long lastElmAttempt = 0;
const unsigned long elmRetryInterval = 5000;

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  setupWifi();
  setupMqtt();
  setupELM();
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }


  if (!elmConnected && millis() - lastElmAttempt > elmRetryInterval)
  {
    Serial.println("Trying to connect to ELM327");
    lastElmAttempt = millis();

    if (ELM_PORT.connect("OBDII")) {
      Serial.println("Connected to ELM327");
      elmConnected = true;
  } else {
    Serial.println("Unsuccesful connection, trying again in 5 seconds....");
  }
}

client.loop();
}

void setupWifi()
{
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
   while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void setupMqtt() {
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback); 
}

void setupELM()
{
  ELM_PORT.begin("ESP32test", true);
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      client.subscribe("esp32/request/vin"); 
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Poruka primljena na topic: ");
  Serial.println(topic);

  if (String(topic) == "esp32/request/vin") {
    String vin = getVin();
    client.publish("esp32/response/vin", vin.c_str());
  }
}

String getVin()
{
  ELM_PORT.println("09 02");
  delay(500); 
  String fullResponse;
  unsigned long timeout = millis() + 2000;

  while (millis() < timeout) {
    while (ELM_PORT.available()) {
      String line = ELM_PORT.readStringUntil('\r');
      line.trim();
      if (line.length() > 0) {
        Serial.println("Primljeno: " + line);
        fullResponse += line + "\n";
      }
    }
  }
  Serial.println(fullResponse);

  return parseVinFromResponse(fullResponse);
}

String parseVinFromResponse(const String& rawResponse) {
  String vin;
  int index = 0;

  while (index < rawResponse.length()) {
    int lineEnd = rawResponse.indexOf('\n', index);
    if (lineEnd == -1) lineEnd = rawResponse.length();

    String line = rawResponse.substring(index, lineEnd);
    index = lineEnd + 1;
    line.trim();

    if (line.length() == 0) continue;
    if (line == "09 02" || line == "014" || line == ">") continue;

    // Ukloni "0:", "1:", "2:" ako postoji
    int colonIndex = line.indexOf(':');
    if (colonIndex != -1) {
      line = line.substring(colonIndex + 1);
    }

    line.trim();
    if (line.length() == 0) continue;

    // Parsiraj HEX znakove
    int tokenCount = 0;
    int pos = 0;
    while (pos < line.length()) {
      // Preskoči razmake
      while (pos < line.length() && line[pos] == ' ') pos++;

      int next = line.indexOf(' ', pos);
      if (next == -1) next = line.length();

      String hexStr = line.substring(pos, next);
      pos = next;

      if (hexStr.length() == 0) continue;

      // Preskoči prva 3 bajta u prvom redu (49 02 01)
      if (vin.length() == 0 && tokenCount < 3) {
        tokenCount++;
        continue;
      }

      char c = strtol(hexStr.c_str(), NULL, 16);
      if (c > 0 && isAscii(c)) vin += c;
    }
  }

  vin.trim();
  Serial.println("Parsiran VIN: " + vin);
  return vin;
}

