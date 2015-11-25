/**
 * Created by hebo on 2015/10/28.
 */
var $blogs = $('#blogs-container');
var jianbao = {today:'',tomorrow:''};
var getParameterByName = function (name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    };

var date = getParameterByName('date');

$.fn.autoHeight = function(){
    function autoHeight(elem){
        elem.style.height = 'auto';
        elem.scrollTop = 0; //防抖动
        elem.style.height = elem.scrollHeight + 'px';
    }

    this.each(function(){
        autoHeight(this);
        $(this).on('keyup', function(){
            autoHeight(this);
        });
    });
};
var myurl = '?c=Index&a=blogsList';
if(date){
    myurl = '?c=Index&a=blogsList&date='+date;
}

$.datetimepicker.setLocale('ch');
$('#datetimepicker').datetimepicker({
    timepicker:false,
    inline:true,
    format:'Ymd',
    maxDate:'+1970/01/01',//today is maximum date calendar
    onChangeDateTime:function(dp,$input){
        var v = $input.val();
        location.href = '?c=Index&a=blogs&&date='+v;
    }
});

$('body').on('click',function(e){
    if($(e.target)[0].id != 'dateicon'){
        $('#show_inline').hide();
    }
});

(function(){
    var $jbdate = $('#jb-date');
    var todayDate = $('body').data('today').replace(/-/g,'');
    todayDate = parseInt(todayDate,10);
    if(date){
        date = date.replace(/-/g,'');
        date = parseInt(date,10);
        var sub = todayDate - date;
        if(sub == 1){
            $jbdate.html('昨日');
        }else if(sub == 0){
            $jbdate.html('今日');
        }else if(sub > 1 ){
            var dm = String(date).match(/(\d{4})(\d{2})(\d{2})/);
            if(dm&&dm[1]&&dm[2]&&dm[3]){
                $jbdate.html(dm[1]+'-'+dm[2]+'-'+dm[3]);
            }
        }
    }else{
        $jbdate.html('今日');
    }
})();

$.ajax({
    url:myurl,
}).done(function(data){
    var $jianbao = $('#jianbao');
    var $textarea = $jianbao.find('textarea');
    //console.info(data);
    $.each(data.data,function(k,v){
        v.today = v.today.replace(/\n/g,'<br>');
        v.tomorrow = v.tomorrow.replace(/\n/g,'<br>');
        jianbao.today += v.today +'\n';
        jianbao.tomorrow += v.tomorrow + '\n';
    });

    jianbao.today = jianbao.today.replace(/<br>/g,'\n').replace(/\d+[、,]/g,'');
    jianbao.tomorrow = jianbao.tomorrow.replace(/<br>/g,'\n').replace(/\d+[、,]/g,'');
    //console.info(jianbao);
    function renderText(){
        $textarea.val('今日：\n'+ jianbao.today + '\n\n计划：\n'+ jianbao.tomorrow).autoHeight();
    }
    renderText();
    $textarea.blur(function(){
       formate();
    });

    $jianbao.find('.btn-success').on('click',function(){
        jianbaoPost();
    }).end().find('.btn-reset').on('click',function(){
        renderText();
        formate();
    });

    function formate(){
        var html = '';
        var v = $textarea.val().replace(/\d+[、,]/g,'');

        function mToday(str){
            var i = 1;
            html += str.replace(/^.*$/gm,function(n){
                if(n != '今日：' && n !="" && !/^\s/.test(n)){
                    n = i + '、' + n;
                    i++;
                }
                return n;
            });
        }

        function mTomorrow(str){
            var i = 1;
            html += str.replace(/^.*$/gm,function(n){
                if(n != '计划：' && n !="" && !/^\s/.test(n)){
                    n = i + '、' + n;
                    i++;
                }
                return n;
            });
        }

        var arr = v.match(/(今日：[\S\s]*)(计划：[\S\s]*)|(今日：[\S\s]*)|(计划：[\S\s]*)/m);

        if(arr.length && arr[1] && arr[2]){
            mToday(arr[1]);
            mTomorrow(arr[2]);
        }else if(arr.length && arr[3]){
            mToday(arr[3]);
        }else if(arr.length && arr[4]){
            mTomorrow(arr[4]);
        }

        $textarea.val(html);
    }
    formate();

    $(document).keydown(function(e){
        if(e.keyCode == 27){
            formate();
        }
    });

    var source   = $("#blogs-template").html();
    var template = Handlebars.compile(source);
    var html    = template(data);
    $blogs.html(html);

    function jianbaoPost(){
        var v = $textarea.val();
        var id = $textarea.attr('data-id');
        if($.trim(v) == ""){
            return;
        }

        var arr = v.match(/(今日：[\S\s]*)(计划：[\S\s]*)|(今日：[\S\s]*)|(计划：[\S\s]*)/m);
        var data = {};
        if(arr.length && arr[1] && arr[2]){
            data.today = arr[1].replace('今日：','').replace(/^\n/gm, "");
            data.tomorrow = arr[2].replace('计划：','').replace(/^\n/gm, "");
            data.id = id;
            if(date != null){
                data.date = date;
            }
            $.ajax({
                type:'post',
                url:'?c=Index&a=jianbaoPost',
                data:data
            }).done(function(res){
                if(res.status == 1){
                    var link = '?c=Index&a=blogss';
                    if(date){
                        link = '?c=Index&a=blogss&date='+date;
                    }
                    if(res.info == 'update'){
                        $textarea.attr('data-id',res.data);
                    }
                    $jianbao.find('.msg').html('保存成功，立即 <a href="'+link+'" target="_blank">查看团队日报</a>').addClass('shake').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
                        $(this).removeClass('shake');
                    });
                }
            });
        }
    }
});
