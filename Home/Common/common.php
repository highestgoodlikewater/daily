<?php
/**
 * Created by PhpStorm.
 * User: bo
 * Date: 2015/10/26
 * Time: 17:41
 */

function getUID(){
   $uid = session('loginId');
   return $uid;
}