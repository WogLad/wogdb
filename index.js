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

                currentDatabase.push(new Table(
                    cmds[2],
                    values.replace("(", "").replace(")", "").split(", ")
                ));
            }
        break;

        case "use":
            if (cmds[1] in databases) {
                currentDatabase = databases[cmds[1]];
            }
            else {
                console.log("No such database exists");
            }
        break;

        case "insert":
            if (cmds[1] == "into" && currentDatabase != null && cmds.length >= 4) {
                for (var i = 0; i < currentDatabase.length; i++) {
                    if (currentDatabase[i].name == cmds[2]) {
                        var values = cmd.replace(("insert into " + cmds[2] + " values"), "");
                        if (values.startsWith(" ")) {
                            values = values.replace(" ", "");
                        }
                        values = values.replace("(", "").replace(")", "").split(", ");

                        currentDatabase[i].entries.push(values);
                        break;
                    }
                }
            }
        break;

        case "select":
            if (cmds[1] == "*" && cmds[2] == "from") {
                for (var i = 0; i < currentDatabase.length; i++) {
                    if (currentDatabase[i].name == cmds[3]) {
                        console.log(currentDatabase[i]);
                        document.getElementById("tables-div").innerHTML += getHTMLTable(currentDatabase[i]);
                        break;
                    }
                }
            }
        break;
    }

    localStorage.setItem("saveData", JSON.stringify(databases));
}

document.getElementById("main-input").addEventListener("keydown", (e) => {
    if (e.key != "Enter") {return;}
    e.preventDefault();
    var cmd = e.target.innerText;
    e.target.innerText = "";
    parseCommand(cmd);
});

function getHTMLTable(tableObj) {
    var tableHTML = "<table>";
    
    tableObj.attributes.forEach((a) => {
        tableHTML += `<th>${a}</th>`
    });

    tableObj.entries.forEach((entry) => {
        tableHTML += "<tr>";
        entry.forEach((value) => {
            tableHTML += `<td>${value}</td>`;
        });
        tableHTML += "</tr>";
    });

    tableHTML += "</table>";
    return tableHTML;
}

function parseSaveData() {
    var saveData = JSON.parse(localStorage.getItem("saveData"));
    Object.keys(saveData).forEach((db) => {
        var tables = [];
        saveData[db].forEach((tb) => {
            var table = new Table(tb.name, tb.attributes);
            table.entries = tb.entries;
            tables.push(table);
        });
        databases[db] = tables;
    });
}

parseSaveData();