$(document).ready(function(){
    // 검색 input
    $("#lklKeyword").on("keyup", function() {
        const value = $(this).val().toLowerCase();
        $("#imageList > tbody > tr").hide();
        const temp = $("#imageList > tbody > tr > td:nth-child(5n+2):contains('" + value + "')");
        $(temp).parent().show();
    });

    $('#imageList').find('tr').click( function(){
        const id            = $(this).find('td:eq(0)').text();
        const repository    = $(this).find('td:eq(1)').text();
        const tag           = $(this).find('td:eq(2)').text();
        const size          = $(this).find('td:eq(3)').text();
        const category      = $(this).find('td:eq(5)').text();
        const dockerId      = $(this).find('td:eq(6)').text();
        const sourcePath    = $(this).find('td:eq(7)').text();

        $("#category").val(category)
        $("#repository").val(repository)
        $("#size").val(size)
        $("#imageId").val(id)
        $("#dockerId").val(repository+':'+tag)
        $("#sourcePath").val(sourcePath)

        $('#imageList').find('tr').attr('style','')
        $(this).attr('style','background:#9ad0c5')
    });



});
