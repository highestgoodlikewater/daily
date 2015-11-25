var $name = $('#username');
var $psw = $('#password');
var isMobile = function (t) {
    return (/^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/).test(t);
};

$('#loginForm').on('submit', function (e) {
    e.preventDefault();
    var $this = $(this);
    var nameVal = $name.val();
    var pswVal = $psw.val();
    if ($.trim(nameVal) == "") {
        $this.find('.error').html('用户名不能为空！');
        $name.focus();
        return false;
    }
    if ($.trim(pswVal) == "") {
        $this.find('.error').html('密码不能为空！');
        $psw.focus();
        return false;
    }
    $.ajax({
        url: $(this).attr('action'),
        data: $(this).serialize(),
        type: 'post',
        dataType: "json",
        error: function (ret, error) {
            //alert(ret.responseText);
        },
        success: function (ret) {
            if (ret.status === 1) {
                if(document.referrer){
                    //location.href = document.referrer;
                    location.href = 'index.php?c=Index&a=blog';
                }else{
                    location.href = 'index.php?c=Index&a=blog';
                }
            } else {
                $this.find('.error').html(ret.info);
            }
        }
    });
});

