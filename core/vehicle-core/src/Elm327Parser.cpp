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

static String parseDtcCode(uint8_t A, uint8_t B) {
    char systemLetter;

    switch (A >> 6) {
        case 0b00: systemLetter = 'P'; break;
        case 0b01: systemLetter = 'C'; break;
        case 0b10: systemLetter = 'B'; break;
        case 0b11: systemLetter = 'U'; break;
    }

    int digit1 = (A >> 4) & 0x03;
    int digit2 = A & 0x0F;
    int digit3 = (B >> 4) & 0x0F;
    int digit4 = B & 0x0F;

    char code[6];
    snprintf(code, sizeof(code), "%c%d%X%X%X", systemLetter, digit1, digit2, digit3, digit4);
    return String(code);
}

std::vector<String> Elm327Parser::parseDtcCodes(const String& response) {
    std::vector<String> codes;

    String cleaned;
    for (int i = 0; i < response.length(); ++i) {
        char c = response[i];
        if (isHexadecimalDigit(c) || c == ' ') cleaned += c;
    }

    int start = cleaned.indexOf("43");
    if (start == -1) return codes;

    int pos = start + 2; 
    cleaned.trim();
    String tokens[64];
    int count = 0;
    int from = 0;
    while (from < cleaned.length()) {
        int space = cleaned.indexOf(' ', from);
        if (space == -1) space = cleaned.length();
        String token = cleaned.substring(from, space);
        if (token.length() == 2) tokens[count++] = token;
        from = space + 1;
    }

    for (int i = 1; i + 1 < count; i += 2) {
        if (tokens[i] == "00" && tokens[i+1] == "00") break;
        uint8_t A = strtol(tokens[i].c_str(), NULL, 16);
        uint8_t B = strtol(tokens[i+1].c_str(), NULL, 16);
        codes.push_back(parseDtcCode(A, B));
    }

    return codes;
}

