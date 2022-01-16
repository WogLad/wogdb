var databases = {};
var currentDatabase = null;

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
    cmd = cmd.toLowerCase();

    var cmds = cmd.split(" ");
    switch(cmds[0]) {
        case "create":
            if (cmds[1] == "database" && cmds.length == 3) {
                databases[cmds[2]] = []; // Creates a database and assigns it an empty list of tables
            }
            else if (cmds[1] == "table") {
                if (currentDatabase == null) {
                    console.log("Select a database first");
                }

                var values = cmd.replace(("create table " + cmds[2]), "");
                if (values.startsWith(" ")) {
                    values = values.replace(" ", "");
                }

                console.log(values);

                databases[currentDatabase].push(new Table(
                    cmds[2],
                    values.replace("(", "").replace(")", "").split(", ")
                ));
            }
        break;

        case "use":
            if (cmds[1] in currentDatabase) {
                currentDatabase = cmds[1];
            }
            else {
                console.log("No such database exists");
            }
        break;
    }
}