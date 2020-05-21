<?php

$data = trim(file_get_contents("php://input"));

if(isset($data) && is_string($data)) {
    $content = json_decode($data, true);
    $arrayKeys = array_keys($content);
    if(
        isset($arrayKeys[0]) &&
        $arrayKeys[0] === 'spy' &&
        isset($arrayKeys[1]) &&
        $arrayKeys[1] === 'playAreas' &&
        validate($content)
    ) {
        echo "akzeptiert ";
        if(file_put_contents('data/playArea.json', $content)) {
            echo "und gespeichert";
        } else {
            echo "aber ein fehler beim speichern :(";
        }
    } else {
        echo "nicht akzeptiert, validierungsfehler";
    }
}

function validate(array $data) {
    if($data !== null) {
        foreach ($data as $value) {
            if(is_array($value)) {
                if(!validate($value)) {
                    return false;
                }
            } else {
                if(!is_string($value) || preg_match('/[^0-9a-zA-Z.äöüÖÄÜ ß_-]+/u', $value, $treffer) === 1) {
                    return false;
                }
            }
        }
    }
    return true;
}

?>
