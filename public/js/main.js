setTimeout(function() {document.getElementById("errorMessage").style.display = "none";}, 5000)
    function clearErrorMessage() {
        
    let errorField = document.getElementById("errorMessage");
    if(errorField)
    {
        errorField.innerHTML = "";
        errorField.style.display = "none";
    }
}
function getIdDetails() {
    var urlParams;
    (window.onpopstate = function() {
        var match,
            pl = /\+/g, // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function(s) {
                return decodeURIComponent(s.replace(pl, " "));
            },
            query = window.location.search.substring(1);

        urlParams = {};
        while ((match = search.exec(query)))
            urlParams[decode(match[1])] = decode(match[2]);
    })();
    return urlParams;
}
if (getIdDetails().message == "changpassword_thanhcong") {
    swal({
        title: "SUCCESS",
        text: "Đổi mật khẩu thành công!",
        icon: "success",
        buttons: false,
        dangerMode: true,
    })
}
if (getIdDetails().message == "register_thanhcong") {
    swal({
        title: "SUCCESS",
        text: "Tạo tài khoản thành công!",
        icon: "success",
        buttons: false,
        dangerMode: true,
    })
}
                                    