/**
 * Created by hebo on 2015/10/26.
 */
var $blogs = $('#blogs-container');
var todayDate = $('body').data('today');

function insertText(obj,str) {
    if (document.selection) {
        var sel = document.selection.createRange();
        sel.text = str;
    } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
        var startPos = obj.selectionStart,
            endPos = obj.selectionEnd,
            cursorPos = startPos,
            tmpStr = obj.value;
        obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
        cursorPos += str.length;
        obj.selectionStart = obj.selectionEnd = cursorPos;
    } else {
        obj.value += str;
    }
}
function moveEnd(obj){
    obj.focus();
    var len = obj.value.length;
    if (document.selection) {
        var sel = obj.createTextRange();
        sel.moveStart('character',len);
        sel.collapse();
        sel.select();
    } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
        obj.selectionStart = obj.selectionEnd = len;
    }
}

var isEmpty = function(obj) {
    var ret = true;
    if('[object Array]' === Object.prototype.toString.call(obj)){
        ret = !obj.length;
    }else{
        obj = new Object(obj);
        for(var key in obj){
            return false;
        }
    }
    return ret;
};

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

$.ajax({
    url:'?c=Index&a=blogList',
}).done(function(data){
    var firstDate = '/s';
    var tomorrow = {};
    var todayRecord = false;
    if(data.status === 0){
        location.href = 'index.php?c=Index&a=login';
    }
    if(data.data && data.data.list){
        $.each(data.data.list,function(k,v){
            //合并相同月份
            //console.info(new RegExp(firstDate),firstDate, v.create_date)
            if(!new RegExp(firstDate).test(v.create_date)){
                firstDate = v.create_date.match(/(\d{4}-\d{2})/)[1];
                v.hide = '';
            }else{
                v.hide = 'hide';
            }

            v.today = v.today.replace(/\n/g,'<br>');
            v.tomorrow = v.tomorrow.replace(/\n/g,'<br>');
            var match = v.create_date.match(/(\d{4})-(\d{2})-(\d{2})/);
            var todayMatch = todayDate.match(/(\d{4})-(\d{2})-(\d{2})/);
            if(todayMatch[1] == match[1] && todayMatch[2] == match[2] && todayMatch[3] == match[3]){
                todayRecord = true;
                v.date = '今天';
                v.bgColor = 'today';
                tomorrow.today = v.tomorrow || '未填写';
                tomorrow.create_date_no_time = '明天计划';
                tomorrow.bgColor = 'tomorrow';
                tomorrow.date = '明天';
                tomorrow.id = 'tomorrow'+'_'+v.id;
            }else if(todayMatch[1] == match[1] && todayMatch[2] == match[2] && Number(todayMatch[3]) == Number(match[3]) + 1){
                v.date = '昨天';
            }else{
                v.date = match[3]+'号';
            }
            v.create_date_no_time = match[0];

        });
    }else{
        data.data.list = [];
    }
    if(!isEmpty(tomorrow)){
        data.data.list.unshift(tomorrow);
    }
    if(!todayRecord){
        var today = {};
        today.today = '未填写';
        today.create_date_no_time = todayDate;
        today.bgColor = 'today';
        today.date = '今天';
        today.id = 'today'+'_';
        data.data.list.unshift(today);

        tomorrow.today = '未填写';
        tomorrow.create_date_no_time = '明天计划';
        tomorrow.bgColor = 'tomorrow';
        tomorrow.date = '明天';
        tomorrow.id = 'tomorrow'+'_';
        data.data.list.unshift(tomorrow);
    }

    var source   = $("#blogs-template").html();
    var template = Handlebars.compile(source);
    var html    = template(data);
    $blogs.html(html);
    initBlogs();
});

function initBlogs(){
    $blogs.on('click','.blog-edit',function(){
        var $dd = $(this).parents('dd');
        var $edit = $dd.find('.blog-body-edit');
        var $body = $dd.find('.blog-body');
        if(!$edit.hasClass('hide')){
            $edit.addClass('hide');
            $body.removeClass('hide');
            return;
        }
        var height = $body.height();
        var html = $body.addClass('hide').html().replace(/<br>/g,'\n').replace('未填写','1、');
        $edit.removeClass('hide').find('textarea').css('height',height).val(html).focus();
    }).on('click','.blog-body-edit-cancel-btn',function(){
        $(this).parents('.blog-body-edit').addClass('hide').siblings('.blog-body').removeClass('hide');
    }).on('click','.blog-body-edit-post-btn',function(){
        var $edit = $(this).parents('.blog-body-edit');
        var today = $.trim($edit.find('textarea').val());
        var id = $(this).parents('.blog-date-container').attr('id').replace('blog_','');
        var $body = $edit.siblings('.blog-body');
        if(today == ""){
            return false;
        }
        $.ajax({
            url:'?c=Index&a=updateBlog',
            type:'POST',
            data:{'id':id,'today':today}
        }).done(function(data){
            if(data.status == 1){
                $body.html(today.replace(/\n/g,'<br>')).removeClass('hide');
                $edit.addClass('hide');
                if(data.info == 'tomorrow'){
                    $edit.parents('.blog-date-container').attr('id','blog_tomorrow_'+data.data).next().attr('id','blog_'+data.data);
                }else if(data.info == 'today'){
                    $edit.parents('.blog-date-container').attr('id','blog_'+data.data).prev().attr('id','blog_tomorrow_'+data.data);
                }
            }
        })
    }).find('textarea').autoHeight();

    function mToday(str){
        var html = '';
        var i = 1;
        html += str.replace(/^.*$/gm,function(n){
            if(n !="" && !/^\s/.test(n)){
                var match = n.match(/(^\d+、)(.*)/);
                if(match && match[1] && match[2]){
                    n = i + '、' + match[2];
                }else{
                    n = i + '、' + n;
                }
                i++;
            }
            return n;
        });
        return html;
    }

    $blogs.on('keyup','textarea',function(e){
        if(e.keyCode == 13){
            //insertText(this,'1');
            var html = mToday(this.value);
            $(this).val(html);
        }
    }).on('blur','textarea',function(){
        var html = mToday(this.value);
        $(this).val(html);
    })
}

