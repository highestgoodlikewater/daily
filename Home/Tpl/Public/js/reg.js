var $name = $('#username');
var $psw = $('#password');
var $email = $('#email');

var isEmail = function (e) {
    return (/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i).test(e);
};

$('#regForm').on('submit', function (e) {
    e.preventDefault();
    var $this = $(this);
    var nameVal = $name.val();
    var emailVal = $email.val();
    var pswVal = $psw.val();
    if ($.trim(nameVal) == "") {
        $this.find('.error').html('姓名不能为空！');
        $name.focus();
        return false;
    }
    if(!/^([\u4E00-\u9FA5]+，?)+$/.test(nameVal)){
        $this.find('.error').html('姓名必须为中文！');
        $name.focus();
        return false;
    }
    if ($.trim(emailVal) == "") {
        $this.find('.error').html('邮箱不能为空！');
        $email.focus();
        return false;
    }
    if (!isEmail(emailVal)) {
        $this.find('.error').html('邮箱格式不正确！');
        $email.focus();
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
                location.href = 'index.php?c=Index&a=blog';
            } else {
                $this.find('.error').html(ret.info);
            }
        }
    });
});

