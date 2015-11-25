<?php
return array(
	//'配置项'=>'配置值'
	'TMPL_L_DELIM'=>'{',
	'TMPL_R_DELIM'=>'}',

	'DB_TYPE'               => 'mysql',     // 数据库类型
    'DB_HOST'               => 'localhost', // 服务器地址
    'DB_NAME'               => 'iqianjin_sys',          // 数据库名
    'DB_USER'               => 'root',      // 用户名
    'DB_PWD'                => '',          // 密码
    'DB_PORT'               => '3306',        // 端口
    'DB_PREFIX'             => 'iqianjin_',    // 数据库表前缀

    'SESSION_AUTO_START' =>true,  //开启session
    'SHOW_PAGE_TRACE' => false,    //关闭trace

    'TOKEN_ON'=>true,  // 是否开启令牌验证
	'TOKEN_NAME'=>'__hash__',    // 令牌验证的表单隐藏字段名称
	'TOKEN_TYPE'=>'md5',  //令牌哈希验证规则 默认为MD5
	'TOKEN_RESET'=>true,  //令牌验证出错后是否重置令牌 默认为true

	'TMPL_PARSE_STRING'=>array(
		'__PUBLIC__'=>__ROOT__."/".APP_NAME."/Tpl/Public",
	)


);
?>
