#include "Elm327Parser.h"

int Elm327Parser::parseRpm(const String& response) {
    int index = response.indexOf("41 0C");
    if (index != -1 && index + 9 < response.length()) {
        String aStr = response.substring(index + 6, index + 8);
        String bStr = response.substring(index + 9, index + 11);
        int A = strtol(aStr.c_str(), NULL, 16);
        int B = strtol(bStr.c_str(), NULL, 16);
        return ((A * 256) + B) / 4;
    }
    return -1;
}

int Elm327Parser::parseSpeed(const String& response) {
    int index = response.indexOf("41 0D");
    if (index != -1 && index + 6 < response.length()) {
        String aStr = response.substring(index + 6, index + 8);
        return strtol(aStr.c_str(), NULL, 16);
    }
    return -1;
}

int Elm327Parser::parseEngineTemp(const String& response) {
    int index = response.indexOf("41 05");
    if (index != -1 && index + 6 < response.length()) {
        String aStr = response.substring(index + 6, index + 8);
        return strtol(aStr.c_str(), NULL, 16) - 40;
    }
    return -1;
}

int Elm327Parser::parseIntakeTemp(const String& response) {
    int index = response.indexOf("41 0F");
    if (index != -1 && index + 6 < response.length()) {
        String aStr = response.substring(index + 6, index + 8);
        return strtol(aStr.c_str(), NULL, 16) - 40;
    }
    return -1;
}

int Elm327Parser::parseFuelLevel(const String& response) {
    int index = response.indexOf("41 2F");
    if (index != -1 && index + 6 < response.length()) {
        String aStr = response.substring(index + 6, index + 8);
        int A = strtol(aStr.c_str(), NULL, 16);
        return (A * 100) / 255;
    }
    return -1;
}

// Placeholder
std::vector<String> Elm327Parser::parseDtcCodes(const String& response) {
    std::vector<String> codes;
    return codes;
}
