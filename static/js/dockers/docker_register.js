$(document).ready(function(){
    var editor_one = CodeMirror.fromTextArea(document.getElementById("id_dockerfile"), {
        lineNumbers: true,
        matchBrackets: true,
        styleActiveLine: true,
        theme:"ambiance"
    });
});