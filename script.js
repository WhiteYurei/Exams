function displayLoad() {
    var pass = prompt("Enter [password]");
    if (pass == "password" || pass == "a") { 
        showTasks();
    } else {
        alert("Wrong pass !!!");
    }
}

window.onload = displayLoad;


$taskID = 0

var db = openDatabase('mydb', '1.0', 'myDB', 2 * 1024 * 1024);
db.transaction(function (tx) {   
    tx.executeSql('CREATE TABLE IF NOT EXISTS TASKS (id unique, task)'); 
});

function showTasks(){
    db.transaction(function (tx) { 
        tx.executeSql('SELECT rowid, * FROM TASKS', [], function (tx, $results) {
           var len = $results.rows.length, i; 
           for (i = 0; i < len; i++) { 
                showTask($results.rows.item(i).task, $results.rows.item(i).rowid);
           }
        }, null); 
     });
}



function showTask($taskText, $id){
    var $task = document.createElement("li");
    $task.innerHTML = $taskText;
    document.getElementById("myUL").appendChild($task);

    document.getElementById("myInput").value = "";

    var $delete = document.createElement("SPAN");
    $delete.className = "close";
    $delete.innerHTML = "\u00D7"
    $delete.onclick = function(){
        if (confirm("Sure ?")){
            db.transaction(function (tx) {
                tx.executeSql('DELETE FROM TASKS WHERE rowid = '+$id); 
             });
            this.parentNode.style.display = "none";
        }
    }
    $task.appendChild($delete);

}



function newElement() 
{
    let $value = document.getElementById("myInput").value;
    if ($value == ""){
        alert("It doesn't work like that! >:(");
        return;
    }   

    $taskID ++;

    showTask($value, $taskID);
    
    db.transaction(function (tx) {
        tx.executeSql('INSERT INTO TASKS (task) VALUES (?)', [$value]); 
     });

    //document.cookie = "task"+$taskID+"="+$value;

}
