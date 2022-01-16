var databases = {};

class Table {
    constructor(name, attributes) {
        this.name = name;
        this.attributes = attributes;
        this.entries = [];
    }

    insertEntry(entry) {
        this.entries.push(entry);
    }
}

function parseCommand(cmd) {
    if (cmd.endsWith(";") == false) {
        console.log("All commands must end with a ';'");
        return;
    }

    cmd = cmd.slice(0, -1);
    cmd = cmd.toLower();

    var cmds = cmd.split(" ");
    switch(cmds[0]) {
        case "create":
            if (cmds[1] == "database" && cmds.length == 3) {
                databases[cmds[2]] = []; // Creates a database and assigns it an empty list of tables
            }
            else if (cmds[1] == "table" && cmds.length == 3) {
                databases[cmds[2]] = []; // Creates a database and assigns it an empty list of tables
            }
    }
}