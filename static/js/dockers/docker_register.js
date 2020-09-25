$(document).ready(function(){
    const editor_one = CodeMirror.fromTextArea(document.getElementById("id_dockerfile"), {
        lineNumbers: true,
        matchBrackets: true,
        styleActiveLine: true,
        theme: "ambiance"
    });

    let files = document.querySelector("#filePath").files;

    document.querySelector("#filePath").addEventListener("change", function() {
        files = document.querySelector("#filePath").files;
        let directories = {};
        for (const file of files) {
            directories[file.name] = file.webkitRelativePath
        }
        directories = JSON.stringify(directories);
        document.querySelector("#directories").value = directories


    });
});