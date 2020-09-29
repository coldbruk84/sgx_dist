$(document).ready(function(){
    let textarea = document.getElementById("id_dockerfile");
    const editor = CodeMirror.fromTextArea(textarea, {
        lineNumbers: true,
        matchBrackets: true,
        styleActiveLine: true,
        theme: "ambiance",
        val: textarea.value
    });

    let files = document.querySelector("#filePath").files;

    document.querySelector("#filePath").addEventListener("change", function() {
        files = document.querySelector("#filePath").files;
        let directories = {};
        let output = document.getElementById("listing");
        for (let i=0; i<files.length; i++) {
            directories[files[i].name] = files[i].webkitRelativePath

            let item = document.createElement("li");
            item.innerHTML =  files[i].webkitRelativePath;
            output.appendChild(item);
        }
        directories = JSON.stringify(directories);
        document.querySelector("#directories").value = directories
    });

    $('#id_category').change(function (){
        let category = $(this).val()
        let sampleDockerfile = returnSampleDockerfile(category)
        editor.setValue(sampleDockerfile)
    });

    $('#id_version').change(function (){
        let category = $("#id_category").val()
        let sampleDockerfile = returnSampleDockerfile(category)
        editor.setValue(sampleDockerfile)
    });

    $('#id_sourcePath').keyup(function (){
        let category = $("#id_category").val()
        let sampleDockerfile = returnSampleDockerfile(category)
        editor.setValue(sampleDockerfile)
    });

    function returnSampleDockerfile(category){
        let alpineVersion = $("#id_version").val()
        let sourcePath = $("#id_sourcePath").val()
        let sampleDockerfile = '';
        if(category == 'python'){
            sampleDockerfile = 'FROM python:3.6-alpine'+alpineVersion+'\n' +
                'MAINTAINER admin\n' +
                '\n' +
                'RUN mkdir -p '+sourcePath+'\n' +
                'WORKDIR '+sourcePath+'\n' +
                '\n' +
                'RUN pip install --no-cache-dir flask\n' +
                'COPY . '+sourcePath+'\n' +
                '\n' +
                '# Expose the Flask port\n' +
                'EXPOSE 5000\n' +
                '\n' +
                'CMD [ "python", "./app/app.py" ]'+
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n';            ;
        }else if(category == 'nodejs'){
            sampleDockerfile = 'FROM alpine:'+alpineVersion+'\n' +
                '\n' +
                'RUN apk add --no-cache \\\n' +
                '    nodejs npm\n' +
                '\n' +
                'RUN npm i cpu-benchmark\n' +
                '\n' +
                'ADD app /app'+
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n';
        }else if(category == 'java'){
            sampleDockerfile = 'FROM openjdk:8-alpine'+alpineVersion+'\n' +
                '\n' +
                'COPY ./app /app\n' +
                '\n' +
                'WORKDIR /app\n' +
                '\n' +
                'RUN javac -source 1.8 -target 1.8 *.java'+
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n';
        }else if(category == 'C'){
            sampleDockerfile = 'FROM alpine:'+alpineVersion+' AS builder\n' +
                'RUN apk add --no-cache gcc musl-dev\n' +
                '\n' +
                'ADD *.c /\n' +
                'RUN gcc -g -o helloworld helloworld.c\n' +
                '\n' +
                'FROM alpine:3.6\n' +
                '\n' +
                'COPY --from=builder helloworld .\n' +
                'ADD app /app'+
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n';
        }
        return sampleDockerfile
    }

    /*Form Validation*/
    $("#dockerRegist").click(function (){
        let valid_filePath = $('#filePath').val();
        if(valid_filePath == ''){
            swal({ title: "",text: "실행 파일을 업로드해 주세요",type: "warning"});
        }else{
            swal({
                title: "등록하시겠습니까?",
                text: "작성한 내용으로 폴더 및 실행파일을 업로드하여 도커 이미지를 생성합니다. ",
                type: "success",
                showCancelButton: true,
                confirmButtonColor: "#2f5dea",
                confirmButtonText: "YES",
                cancelButtonText: "NO",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    $('#registForm').submit();
                } else {
                    swal("취소", "취소되었습니다.", "error");
                }
            });
        }
    });

});