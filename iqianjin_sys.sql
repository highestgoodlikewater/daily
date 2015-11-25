/*
Navicat MySQL Data Transfer

Source Server         : iqianjin_sys
Source Server Version : 50539
Source Host           : 172.16.3.6:3306
Source Database       : iqianjin_sys

Target Server Type    : MYSQL
Target Server Version : 50539
File Encoding         : 65001

Date: 2015-11-25 13:55:48
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for iqianjin_daily
-- ----------------------------
DROP TABLE IF EXISTS `iqianjin_daily`;
CREATE TABLE `iqianjin_daily` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `today` mediumtext NOT NULL,
  `tomorrow` mediumtext NOT NULL,
  `create_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=200 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of iqianjin_daily
-- ----------------------------

-- ----------------------------
-- Table structure for iqianjin_daily_group
-- ----------------------------
DROP TABLE IF EXISTS `iqianjin_daily_group`;
CREATE TABLE `iqianjin_daily_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `today` text NOT NULL,
  `tomorrow` text NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of iqianjin_daily_group
-- ----------------------------

-- ----------------------------
-- Table structure for iqianjin_group
-- ----------------------------
DROP TABLE IF EXISTS `iqianjin_group`;
CREATE TABLE `iqianjin_group` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 NOT NULL,
  `leader` varchar(50) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of iqianjin_group
-- ----------------------------
INSERT INTO `iqianjin_group` VALUES ('1', '前端组', '何波');
INSERT INTO `iqianjin_group` VALUES ('2', '接口组', '刘金杰');
INSERT INTO `iqianjin_group` VALUES ('3', '测试组', '丁晓玲');
INSERT INTO `iqianjin_group` VALUES ('4', '运维组', '丁磊');
INSERT INTO `iqianjin_group` VALUES ('5', '架构组', '胡英荣');
INSERT INTO `iqianjin_group` VALUES ('6', '金库组', '卢超');

-- ----------------------------
-- Table structure for iqianjin_user
-- ----------------------------
DROP TABLE IF EXISTS `iqianjin_user`;
CREATE TABLE `iqianjin_user` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `group_id` int(10) NOT NULL,
  `username` varchar(40) NOT NULL,
  `password` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`) USING BTREE,
  KEY `gruopId` (`group_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of iqianjin_user
-- ----------------------------
