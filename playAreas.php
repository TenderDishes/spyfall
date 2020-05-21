<!DOCTYPE html>
<html>
    <head>
    	<meta charset="UTF-8">
    	<link href="css/index.css" rel="stylesheet">
    </head>
    <body>
    <?php
        if(($json = file_get_contents('data/playAreas.json')) !== false) {
            $playAreas = json_decode($json);
            echo '<table id="table">';
            foreach ($playAreas->playAreas as $playArea) {
                echo '<tr>';
                    echo '<td><input type="text" value="'.$playArea->name.'"/></td>';
                    echo '<td><input type="text" value="'.$playArea->picture.'"/></td>';
                    echo '<td>';
                    foreach ($playArea->roles as $role) {
                        echo '<div>
                            <input type="text" value="'.$role.'"/>
                            <a class="remove" href="#" onclick="removeRole(this); return false;">
                                <span>-</span>
                            </a>
                            <br/>
                        </div>';
                    }
                    echo '<a href="#" onclick="addRole(this); return false;">+</a>';
                    echo '</td>';
                    echo '<td>';
                        echo '<a href="#" onclick="removePlayArea(this); return false;">-</a>';
                    echo '</td>';
                echo '</tr>';
            }
            echo '</table>';
            echo '<a href="#" onclick="addPlayArea(); return false;">+</a>';
            echo '<br />';
            echo '<a href="#" onclick="savePlayAreas(); return false;">save</a>';
        }
    ?>
    <script type="text/javascript">
        var buttonTmp = document.createElement("a");
        buttonTmp.href = "#";
        var textTmp = document.createElement("span");
        var inputTmp = document.createElement("input");
        inputTmp.type = "text";
        var tdTmp = document.createElement("td");

        var removeTextTmp = textTmp.cloneNode(true);
        removeTextTmp.innerText = "-";
        var addTextTmp = textTmp.cloneNode(true);
        addTextTmp.innerText = "+";

        var removeTmp = buttonTmp.cloneNode(true);
        removeTmp.className = 'remove';
        removeTmp.appendChild(
            removeTextTmp.cloneNode(true)
        );
        var addTmp = buttonTmp.cloneNode(true);
        addTmp.className = 'add';
        addTmp.appendChild(
            addTextTmp.cloneNode(true)
        );

        var removeRoleTemplate = removeTmp.cloneNode(true);
        removeRoleTemplate.setAttribute('onclick', "removeRole(this); return false;");
        var removePlayAreaTemplate = removeTmp.cloneNode(true);
        removePlayAreaTemplate.setAttribute('onclick', "removePlayArea(this); return false;");

        var addRoleTemplate = addTmp.cloneNode(true);
        addRoleTemplate.setAttribute('onclick', "addRole(this); return false;");
        var addPlayAreaTemplate = addTmp.cloneNode(true);
        addPlayAreaTemplate.setAttribute('onclick', "addPlayArea(this); return false;");

        var roleTemplate = document.createElement("div");
        roleTemplate.appendChild(inputTmp.cloneNode(true));
        roleTemplate.appendChild(removeRoleTemplate.cloneNode(true));
        roleTemplate.appendChild(document.createElement("br"));

        var tableInputTmp = tdTmp.cloneNode(true);
        tableInputTmp.appendChild(inputTmp.cloneNode(true));
        var tableRoleTmp = tdTmp.cloneNode(true);
        tableRoleTmp.appendChild(roleTemplate.cloneNode(true));
        tableRoleTmp.appendChild(addRoleTemplate.cloneNode(true));
        var tableRemoveRoleTmp = tdTmp.cloneNode(true);
        tableRemoveRoleTmp.appendChild(removePlayAreaTemplate.cloneNode(true));

        var playAreaTemplate = document.createElement('tr');
        playAreaTemplate.appendChild(tableInputTmp.cloneNode(true));
        playAreaTemplate.appendChild(tableInputTmp.cloneNode(true));
        playAreaTemplate.appendChild(tableRoleTmp.cloneNode(true));
        playAreaTemplate.appendChild(tableRemoveRoleTmp.cloneNode(true));

        function addRole(element) {
            console.log("addRole");
            element.parentNode.insertBefore(roleTemplate.cloneNode(true), element);
        }

        function addPlayArea() {
            console.log("addPlayArea");
             document.getElementById('table').appendChild(playAreaTemplate.cloneNode(true));
        }

        function removeRole(element) {
            console.log("removeRole");
            element.parentNode.parentNode.removeChild(element.parentNode);
        }

        function removePlayArea(element) {
            console.log("removePlayArea");
            element.parentNode.parentNode.parentNode.removeChild(element.parentNode.parentNode);
        }

        function savePlayAreas() {
            console.log("savePlayAreas");
            let playAreas = [];
            let i = 0;
            Array.from(document.getElementsByTagName('tr')).forEach((element) => {
                playAreas[i] = {};
                let j = 0;
                Array.from(element.getElementsByTagName('input')).forEach((element) => {
                    if (j === 0) {
                        playAreas[i].name = element.value;
                    } else if (j === 1) {
                        playAreas[i].picture = element.value;
                        playAreas[i].text = "Additional Infos";
                    } else {
                        if(playAreas[i].roles === undefined) {
                            playAreas[i].roles = [];
                        }
                        playAreas[i].roles[j-2] = element.value;
                    }
                    j++;
                });
                i++;
            });

            let jsonStringPrep = {
                "spy": {
                    "picture": "homer_spy.jpeg"
                },
                "playAreas": playAreas
            };
            console.log(jsonStringPrep);

            fetch("savePlayAreas.php", {
                method: "POST",
                mode: "same-origin",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonStringPrep)
            }).then(response => response.text())
            .then(
                response => alert(response)
            );
        }
    </script>
    </body>
</html>
