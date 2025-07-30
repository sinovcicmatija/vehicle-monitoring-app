#ifndef ELM327PARSER_H
#define ELM327PARSER_H

#include <Arduino.h>
#include<vector>

class Elm327Parser {
public:
    static int parseRpm(const String& response);
    static int parseSpeed(const String& response);
    static int parseEngineTemp(const String& response);
    static int parseIntakeTemp(const String& response);
    static int parseFuelLevel(const String& response);
    static std::vector<String> parseDtcCodes(const String& response);  
};

#endif