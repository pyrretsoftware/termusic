#include <iostream>
#include <string>
#include <cstdlib>
#include <filesystem>

int main(int argc, char* argv[]) {
    std::string path = std::filesystem::current_path().parent_path().string();
    std::string command = "cmd.exe /c node " + path + "\\termusic.js " + (argc > 1 ? argv[1] : "");
    system(command.c_str());
    return 0;
}

