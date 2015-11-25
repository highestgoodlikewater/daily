<?php
/**
 * Created by hebo on 2015/10/26.
 */
class IndexAction extends Action
{
    public function index(){
        $this->redirect('Index/blog',0);
    }

    public function reg(){
        $M = M('Group');
        $group = $M->select();
        $this->assign('group',$group);
        $this->display();
    }


    public function login(){
        //dump(session('loginId'));
        $this->display();
    }

    public function regPost(){
        $username = $this->_param('username');
        $email = $this->_param('email');
        $password = $this->_param('password');
        $groupId = $this->_param('group');
        $M = M('User');
        $data['username'] = $username;
        $data['email'] = $email;
        $data['password'] = md5($password);
        $data['group_id'] = $groupId;
        $data['create_date'] = date('Y-m-d H:i:s');

        $condition['username'] = $username;
        $users = $M->where($condition)->select();
        $user = $users[0];
        if($user > 0){
            $this->ajaxReturn(0,"用户名已存在！",0);
        }

        $conmail['email'] = $email;
        $users = $M->where($conmail)->select();
        $user = $users[0];
        if($user > 0){
            $this->ajaxReturn(0,"邮箱已存在！",0);
        }

        $res = $M->data($data)->add();
        if($res){
            session('loginId',$res);
            $this->ajaxReturn(1,'ok',1);
        }else{
            $this->ajaxReturn(0,'fail',0);
        }


    }

    public function loginPost(){
        $username = $this->_param('username');
        $password = $this->_param('password');
        $M = M('User');
        $condition['username'] = $username;
        $users = $M->where($condition)->limit(1)->select();
        $user = $users[0];
        if(!$user){
            $this->ajaxReturn(0,"用户不存在！",0);
        }else{
            if($user['password'] != md5($password)){
                session('loginId',null);
                $this->ajaxReturn(0,"密码不正确！",0);
            }else{
                session('loginId',$user['id']);
                $this->ajaxReturn(0,"登录成功！",1);
            }
        }

    }

    public function blog(){
        $this->assign('todayDate',date('Y-m-d'));
        $this->display();
    }

    public function blogList(){
        $m = M('Daily');
        $data = array();
        $uid = getUID();
        if(!$uid){
            $this->ajaxReturn(0,'请登录',0);
        }
        $list = $m->where('user_id='.$uid)->order('create_date desc')->limit(5)->select();
        $data['list'] = $list;
        $data['todayDate'] = date('Y/m/d');
        $this->ajaxReturn($data,'ok',1);
    }

    public function updateBlog(){
        $m = M('Daily');
        $uid = getUID();
        if(!$uid){
            $this->ajaxReturn(0,'请登录',0);
        }
        $id = $this->_param('id');
        preg_match('/tomorrow_(\d{1,})/',$id,$rmatch);

        if($id == 'today_'){
            $data['today'] = $this->_param('today');
            $data['user_id'] = $uid;
            $data['create_date'] = date('Y-m-d H:i:s');
            $res = $m->data($data)->add();
            if($res){
                $this->ajaxReturn($res,'today',1);
            }else{
                $this->ajaxReturn(0,'fail',0);
            }
        }else if($id == 'tomorrow_'){
            $data['tomorrow'] = $this->_param('today');
            $data['user_id'] = $uid;
            $data['create_date'] = date('Y-m-d H:i:s');
            $res = $m->data($data)->add();
            if($res){
                $this->ajaxReturn($res,'tomorrow',1);
            }else{
                $this->ajaxReturn(0,'fail',0);
            }
        }else if(count($rmatch) > 1){
            $data['tomorrow'] = $this->_param('today');
            $res = $m->where('id='.$rmatch[1])->save($data);
            if($res){
                $this->ajaxReturn(0,'ok',1);
            }else{
                $this->ajaxReturn(0,'fail',0);
            }
        }else{
            $data['today'] = $this->_param('today');
            $res = $m->where('id='.$id)->save($data);
            if($res){
                $this->ajaxReturn(0,'ok',1);
            }else{
                $this->ajaxReturn(0,'fail',0);
            }
        }

    }

    public function blogs(){
        $m = M('User');
        $uid = getUID();
        $date = $this->_param('date');
        if(!$uid){
            redirect('index.php?c=Index&a=login');
        }
        $groupId = $m->where('id='.$uid)->getField('group_id');
        $mode = M('Daily_group');
        if(!isset($date)){
            $query = "SELECT `id` FROM `iqianjin_daily_group` where `group_id` = $groupId && to_days(create_date) = to_days(now())";
        }else{
            $query = "SELECT `id` FROM `iqianjin_daily_group` where `group_id` = $groupId && to_days(create_date) = to_days($date)";
        }
        $id = $mode->query($query);
        $array['id'] = $id[0]['id'];
        $array['todayDate'] = date('Y-m-d');
        $this->assign('vo',$array);
        $this->display();
    }

    public function blogsList(){
        $m = M('User');
        $uid = getUID();
        $date = $this->_param('date');
        if(!$uid){
            $this->ajaxReturn(0,'请登录',0);
        }
        $groupId = $m->where('id='.$uid)->getField('group_id');
        $mode = M();
        if(!isset($date)){
            $query = "SELECT a.username,b.today,b.tomorrow,b.create_date FROM `iqianjin_user` as a left join `iqianjin_daily`as b on a.id = b.user_id where a.group_id = $groupId && to_days(b.create_date) = to_days(now())";
        }else{
            $query = "SELECT a.username,b.today,b.tomorrow,b.create_date FROM `iqianjin_user` as a left join `iqianjin_daily`as b on a.id = b.user_id where a.group_id = $groupId && to_days(b.create_date) = to_days($date)";
        }
        $list = $mode->query($query);
        $this->ajaxReturn($list,'ok',1);
    }

    public function jianbaoPost(){
        $m = M('User');
        $uid = getUID();
        if(!$uid){
            $this->ajaxReturn(0,'请登录',0);
        }
        $groupId = $m->where('id='.$uid)->getField('group_id');
        $date = $this->_param('date');
        $id = $this->_param('id');
        $data['today'] = $this->_param('today');
        $data['tomorrow'] = $this->_param('tomorrow');
        $data['group_id'] = $groupId;
        if(!isset($date)){
            $data['create_date'] = date("Y-m-d H:i:s",time());
        }else{
            $data['create_date'] = date("Y-m-d H:i:s",strtotime($date));
        }
        $mode = M('Daily_group');
        if($id != ""){
            $res = $mode->where('id='.$id)->save($data);
            if($res){
                $this->ajaxReturn(1,'ok',1);
            }else{
                $this->ajaxReturn(0,'fail',0);
            }
        }else{
            $res = $mode->data($data)->add();
            if($res){
                $this->ajaxReturn($res,'update',1);
            }else{
                $this->ajaxReturn(0,'fail',0);
            }
        }

    }

    public function blogss(){
        $date = $this->_param('date');
        if(isset($date)){
            $this->assign('todayDate',$date);
        }else{
            $this->assign('todayDate',date('Y-m-d'));
        }
        $this->display();
    }

    public function jianbaoList(){
        $uid = getUID();
        $date = $this->_param('date');
        if(!$uid){
            $this->ajaxReturn(0,'请登录',0);
        }
        $mode = M();
        if(!isset($date)){
            $query = "SELECT a.id,a.today,a.tomorrow,a.create_date,b.name,b.leader FROM `iqianjin_daily_group` as a left join `iqianjin_group` as b on a.group_id = b.id where to_days(a.create_date) = to_days(now())";
        }else{
            $query = "SELECT a.id,a.today,a.tomorrow,a.create_date,b.name,b.leader FROM `iqianjin_daily_group` as a left join `iqianjin_group` as b on a.group_id = b.id where to_days(a.create_date) = to_days($date)";
        }
        $list = $mode->query($query);
        if($list){
            $this->ajaxReturn($list,'ok',1);
        }else{
            $this->ajaxReturn(0,'fail',0);
        }
    }

}