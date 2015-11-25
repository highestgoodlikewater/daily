/**
 * Created by bo on 2015/9/22.
 */
var tools = {};
tools.getParameterByName = function (name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};

function toShare(){
    $.ajax({
        url: "/cy/index.php?c=Index&a=checkShare",
        dataType: "json",
        success: function (data) {
            if(data.state == 1){
                //alert('已获得一次抽奖机会！');
            }
        }
    });
}

var game = {
    elems: {
        arrow: $('#arrow'),
        times: $('#times'),
        startbt: $('#start-bt'),
        rotary: $('#rotary'),
        gamestart: $('#game-start')
    },
    times: 0,
    updateTimes: function () {
        if (isNaN(this.times)) {
            this.times = 0;
        }
        this.elems.times.text((this.times ? this.times : 0 ) + ' 次');
    },
    msg:function(type){
        $('.md-overlay').addClass('md-show');
        $('#md-'+type).show();
    },
    awards: [
        {angle: 22.5, msg: "2"},
        {angle: 67.5, msg: "50"},
        {angle: 112.5, msg: "1"},
        {angle: 157.5, msg: "empty"},
        {angle: 202.5, msg: "2"},
        {angle: 247.5, msg: "1"},
        {angle: 292.5, msg: "1"},
        {angle: 337.5, msg: "chemo"}
    ],
    rotate: function (duration, angle, msg, times) {
        var me = this;
        me.elems.rotary.rotate({
            angle: 0,
            duration: duration,
            //animateTo: angle + 360 * 2,
            animateTo: (360 - angle) + 360 * 2,
            callback: function () {
                if (angle == 360) {
                    alert('服务器超时，请稍后重试！');
                }else if (msg == '1') {
                    me.msg('one');
                }else if (msg == '2') {
                    me.msg('two');
                }else if(msg == '50'){
                    me.msg('fifty');
                }else if(msg == 'chemo'){
                    me.msg('chemo');
                }else{
                    me.msg('empty');
                }
                me.elems.startbt.removeClass('ui-button-disabled').removeAttr('disabled');
                me.elems.gamestart.show();
            }
        });

    },
    start: function () {
        var me = this;
        me.elems.startbt.addClass('ui-button-disabled').attr('disabled', 'disabled');
        var code = tools.getParameterByName('code');
        alert(code);
        $.ajax({
            url: "index.php?c=Index&a=run&code="+code,
            dataType: "json",
            cache: false,
            timeout: 15000,
            success: function (data) {
                alert(JSON.stringify(data))
                if (data.code == -2) {
                    $('#title').hide();
                    $('.rotary-wrap').hide();
                    $('#login-form').show();
                    return;
                }
                if (data.code == -1) {
                    alert( '你的抽奖次数已用完，请明日再来！');
                    $('.share-btn').trigger('click');
                    return;
                }
                if (data.code != 1) return;
                me.elems.gamestart.hide();
                try {
                    //localStorage.times--;
                    //me.times = localStorage.times;
                    me.rotate(8000, me.awards[data.num].angle, me.awards[data.num].msg, me.times);
                } catch (e) {
                    me.rotate(8000, me.awards[data.num].angle, me.awards[data.num].msg, me.times);
                }
            },
            error: function (data) {
                alert(JSON.stringify(data))
                me.rotate(10000, 157.5, "网络超时");
            }
        });
    }
};

$('#game-start').on('click', function () {
    game.start();
});

$('#rule-btn').on('click', function () {
    $('.md-rule').show();
    $('.md-overlay').addClass('md-show');
});

$('#md-rule').find('.close').on('click', function () {
    $('.md-rule').hide();
    $('.md-overlay').removeClass('md-show');
});

$('#md-rule').find('.start-btn').on('click', function () {
    $('.md-rule').hide();
    $('.md-overlay').removeClass('md-show');
});
$('.share-btn').on('click',function(){
    $('#share-tip').show();
    $('.md-overlay').addClass('md-show');
    $('.j-dialog').hide();
    $('.md-overlay').unbind('click').click(function(){
        $(this).removeClass('md-show');
        $('#share-tip').hide();
    });
});

$('.mu-left').animate({
    left:'-400px'
},2000,function(){
    $(this).hide();
});
$('.mu-right').animate({
    right:'-490px'
},2000,function(){
    $(this).hide();
});

