#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <sstream>

using namespace std;

struct Criminal {
    string id;
    string name;
    string age;
    string crimeType;
    string status;
};

const string FILE_NAME = "criminals.txt";

void addCriminal(string id, string name, string age, string crimeType, string status) {
    ofstream file(FILE_NAME, ios::app);
    file << id << "," << name << "," << age << "," << crimeType << "," << status << "\n";
    file.close();
    cout << "Success: Criminal added successfully.\n";
}

void displayCriminals() {
    ifstream file(FILE_NAME);
    if (!file) {
        cout << "Error: No records found.\n";
        return;
    }
    string line;
    while (getline(file, line)) {
        cout << line << "\n";
    }
    file.close();
}

void searchCriminal(string searchTerm) {
    ifstream file(FILE_NAME);
    if (!file) {
        cout << "Error: No records found.\n";
        return;
    }
    string line;
    bool found = false;
    while (getline(file, line)) {
        stringstream ss(line);
        string id, name, age, crime, status;
        getline(ss, id, ',');
        getline(ss, name, ',');
        getline(ss, age, ',');
        getline(ss, crime, ',');
        getline(ss, status, ',');
        
        if (id == searchTerm || name == searchTerm) {
            cout << line << "\n";
            found = true;
        }
    }
    file.close();
    if (!found) {
        cout << "Error: Criminal not found.\n";
    }
}

void deleteCriminal(string id) {
    ifstream file(FILE_NAME);
    if (!file) {
        cout << "Error: No records found.\n";
        return;
    }
    vector<string> lines;
    string line;
    bool found = false;
    while (getline(file, line)) {
        stringstream ss(line);
        string currentId;
        getline(ss, currentId, ',');
        if (currentId != id) {
            lines.push_back(line);
        } else {
            found = true;
        }
    }
    file.close();
    
    if (found) {
        ofstream outFile(FILE_NAME);
        for (const string& l : lines) {
            outFile << l << "\n";
        }
        outFile.close();
        cout << "Success: Criminal deleted successfully.\n";
    } else {
        cout << "Error: Criminal not found.\n";
    }
}

void showMenu() {
    int choice;
    do {
        cout << "\n--- Digital Crime Investigation System ---\n";
        cout << "1. Add Criminal\n";
        cout << "2. Search Criminal\n";
        cout << "3. Display All Records\n";
        cout << "4. Delete Criminal\n";
        cout << "5. Exit\n";
        cout << "Enter your choice: ";
        cin >> choice;
        cin.ignore();
        
        if (choice == 1) {
            string id, name, age, crime, status;
            cout << "Enter ID: "; getline(cin, id);
            cout << "Enter Name: "; getline(cin, name);
            cout << "Enter Age: "; getline(cin, age);
            cout << "Enter Crime Type: "; getline(cin, crime);
            cout << "Enter Status: "; getline(cin, status);
            addCriminal(id, name, age, crime, status);
        } else if (choice == 2) {
            string term;
            cout << "Enter ID or Name to search: "; getline(cin, term);
            searchCriminal(term);
        } else if (choice == 3) {
            cout << "\n--- Criminal Records ---\n";
            displayCriminals();
        } else if (choice == 4) {
            string id;
            cout << "Enter ID to delete: "; getline(cin, id);
            deleteCriminal(id);
        }
    } while (choice != 5);
}

int main(int argc, char* argv[]) {
    // If command line arguments are provided, use them (for Flask backend)
    if (argc > 1) {
        string command = argv[1];
        if (command == "add" && argc == 7) {
            addCriminal(argv[2], argv[3], argv[4], argv[5], argv[6]);
        } else if (command == "display") {
            displayCriminals();
        } else if (command == "search" && argc == 3) {
            searchCriminal(argv[2]);
        } else if (command == "delete" && argc == 3) {
            deleteCriminal(argv[2]);
        } else {
            cout << "Invalid command line arguments.\n";
        }
        return 0;
    }
    
    // Otherwise, show interactive menu for standard terminal use
    showMenu();
    return 0;
}
