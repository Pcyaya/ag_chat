<template>
  <div class="msg" @click="removeFriendType = false">
    <Loading v-if="loadingDiv"></Loading>
    <div class="msg-list">
      <div class="msg-search">
        <div>
          <img :src="icon.search" alt>
        </div>
        <div class="seatchInput">
          <input
            v-model="searchData"
            @focus="searchFocus"
            @blur="searchBlur"
            maxlength="20"
            placeholder="搜索"
          >
        </div>
        <div>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <div>
                <img :src="icon.add" alt>
              </div>
            </span>
            <el-dropdown-menu slot="dropdown">
              <div class="createItem">
                <el-dropdown-item
                  @click.native="createData.addItem.type = true,createData.addFirend.type = false"
                  class="clearfix"
                >
                  <div>
                    <img :src="icon.addItem" alt>
                    <span>创建游团</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="createData.addFirend.type = true,createData.addItem.type = false"
                  class="clearfix"
                >
                  <div>
                    <img :src="icon.addProp" alt>
                    <span>添加侗友</span>
                  </div>
                </el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="addRel_div">
          <div class="addRel_item" v-if="createData.addItem.type">
            <div>
              <div>
                <img :src="icon.addItemw" alt> 创建游团
              </div>
              <div @click="createData.addItem.type = false">x</div>
            </div>
            <div>
              <el-input v-model="createData.addItem.content" placeholder="输入团名" maxlength="20"></el-input>
            </div>
            <div>
              <span>限制输入字数：{{20-createData.addItem.content.length}}</span>
              <el-button @click="createItemBtn" type="primary">确定</el-button>
            </div>
          </div>
          <div class="addRel_firend" v-if="createData.addFirend.type">
            <div>
              <div>
                <img :src="icon.addPropw" alt> 添加侗友
              </div>
              <div @click="createData.addFirend.type = false">x</div>
            </div>
            <div class="createFirendSearch">
              <el-input
                prefix-icon="el-icon-search"
                v-model="createData.addFirend.content"
                maxlength="20"
                placeholder="手机号/用户名"
              ></el-input>
            </div>
            <div class="createFirendList">
              <div
                v-if="createData.addFirend.content == '' && createData.addFirend.list.length <1"
                class="titleTop"
              >请输入关键字！</div>
              <div
                v-else-if="createData.addFirend.content != '' && createData.addFirend.list.length<1"
                class="titleTop"
              >暂无数据！</div>
              <div
                class="firendItem"
                v-for="(item, index) in createData.addFirend.list"
                :key="index"
              >
                <div>
                  <img v-if="item.icon == '' || item.icon == null" :src="icon.firendHead" alt>
                  <img v-else-if="item.icon.indexOf('http') != -1" :src="item.icon" alt>
                  <img v-else :src="head_icon+item.icon" alt>
                </div>
                <div>
                  <span>
                    {{item.name}}
                    <br v-if="item.name != ''">
                    ({{item.num}})
                  </span>
                  <el-button
                    @click="GetAddFriend(item.num,createData.addFirend.list,index)"
                    type="primary"
                    size="mini"
                  >添加</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="msg-box" v-if="!searchType ">
        <div class="box-nav">
          <div @click="msgBtn" :class="{'nav-active':navFlg == 0}">
            消息
            <span v-if="$base.newMsg(newMsgLength[loginVisitor.access_num])>0" class="nav_rel">
              <el-badge
                class="mark"
                :value="$base.newMsg(newMsgLength[loginVisitor.access_num])"
                :max="99"
              />
            </span>
            <div v-if="navFlg == 0">
              <div></div>
            </div>
          </div>
          <div @click="itemBtn" :class="{'nav-active':navFlg == 1}">
            游团
            <div v-if="navFlg == 1">
              <div></div>
            </div>
          </div>
          <div @click="firendBtn" :class="{'nav-active':navFlg == 2}">
            侗友
            <div v-if="navFlg == 2">
              <div></div>
            </div>
          </div>
          <div @click="newfirendBtn" :class="{'nav-active':navFlg == 3}">
            新侗友
            <span v-if="newFriendL>0" class="nav_rel">
              <el-badge class="mark" :value="newFriendL" :max="99"/>
            </span>
            <div v-if="navFlg == 3">
              <div></div>
            </div>
          </div>
        </div>
        <div class="box-list" id="sessView" v-if="navFlg == 0" ref="sessView">
          <div v-if="sessionsData.length<1" class="titleTop">
            <span v-if="!listsearch">
              <i class="el-icon-loading"></i> 正在加载...
            </span>
            <span v-else>暂无数据！</span>
          </div>
          <div class="box-list-item" v-for="(item,index) in sessionsData" :key="index">
            <div v-if="item.rs_sort == 1">
              <!-- 侗友 -->
              <div
                :class="{'item-cative1': ind === item.rs_num,'item-cative':item.rs_sort == 1}"
                @click="chatBtn(sessionsData, index)"
                v-if="item.rs_source == 0"
              >
                <div>
                  <img v-if="item.icon == '' || item.icon == null" :src="icon.firendHead" alt>
                  <img v-else-if="item.icon.indexOf('http') != -1" :src="item.icon" alt>
                  <img v-else :src="head_icon+item.icon" alt>
                  <div
                    class="rel_newMsg"
                    v-if="newMsgLength[loginVisitor.access_num][item.rs_num]>0"
                  >
                    <el-badge
                      class="mark"
                      :value="newMsgLength[loginVisitor.access_num][item.rs_num]"
                      :max="99"
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <div class="lengthd" style="width:130px">{{item.name}}</div>
                    <div class>{{$base.timestampToTime(item.create_date)}}</div>
                  </div>
                  <div
                    class="lengthd"
                    :title="$base.showLast(showDemo,item.rs_num) || $base.isNull(item.recently)"
                    v-html="emojiTo($base.showLast(showDemo,item.rs_num) || $base.isNull(item.recently))"
                  ></div>
                </div>
                <div class="top">
                  <div>
                    <img :src="icon.to_top" alt>
                  </div>
                </div>
              </div>
              <!-- 团 -->
              <div
                :class="{'item-cative1': ind === item.rs_num,'item-cative':item.rs_sort == 1}"
                @click="chatBtn(sessionsData, index)"
                v-if="item.rs_source == 1"
              >
                <div>
                  <img v-if="item.icon == '' || item.icon == null" :src="icon.guide" alt>
                  <img v-else :src="head_icon+item.icon" alt>
                  <div
                    class="rel_newMsg"
                    v-if="newMsgLength[loginVisitor.access_num][item.rs_num]>0"
                  >
                    <el-badge
                      class="mark"
                      :value="newMsgLength[loginVisitor.access_num][item.rs_num]"
                      :max="99"
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <div class="lengthd flex-c" style="width:130px">
                      <img v-if="item.guide_flg == 2" :src="icon.group_guide" alt>
                      <img v-if="item.rg_type == 0" :src="icon.group_general" alt>
                      <img v-if="item.rg_type == 1" :src="icon.group_tour" alt>
                      {{item.name}}
                    </div>
                    <div class>{{$base.timestampToTime(item.create_date)}}</div>
                  </div>
                  <div>
                    <div style="color:red" v-if="alt[sessionsData[index].rs_num]">[有人@你]&nbsp;</div>
                    <div
                      class="lengthd zzd"
                      :title="$base.showLast(showDemo,item.rs_num,1) || $base.isNull(item.recently)"
                      v-html="emojiTo($base.showLast(showDemo,item.rs_num,1) || $base.isNull(item.recently))"
                    ></div>
                  </div>
                </div>
                <div class="top">
                  <div>
                    <img :src="icon.to_top" alt>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <!-- 侗友 -->
              <div
                :class="{'item-cative1': ind === item.rs_num}"
                @click="chatBtn(sessionsData, index)"
                v-if="item.rs_source == 0"
              >
                <div>
                  <img v-if="item.icon == '' || item.icon == null" :src="icon.firendHead" alt>
                  <img v-else-if="item.icon.indexOf('http') != -1" :src="item.icon" alt>
                  <img v-else :src="head_icon+item.icon" alt>
                  <div
                    class="rel_newMsg"
                    v-if="newMsgLength[loginVisitor.access_num][item.rs_num]>0"
                  >
                    <el-badge
                      class="mark"
                      :value="newMsgLength[loginVisitor.access_num][item.rs_num]"
                      :max="99"
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <div class="lengthd" style="width:130px">{{item.name}}</div>
                    <div class>{{$base.timestampToTime(item.create_date)}}</div>
                  </div>
                  <div
                    class="lengthd"
                    :title="$base.showLast(showDemo,item.rs_num) || $base.isNull(item.recently)"
                    v-html="emojiTo($base.showLast(showDemo,item.rs_num) || $base.isNull(item.recently))"
                  ></div>
                </div>
              </div>
              <!-- 团 -->
              <div
                :class="{'item-cative1': ind === item.rs_num}"
                @click="chatBtn(sessionsData, index)"
                v-if="item.rs_source == 1"
              >
                <div>
                  <img v-if="item.icon == '' || item.icon == null" :src="icon.guide" alt>
                  <img v-else :src="head_icon+item.icon" alt>
                  <div
                    class="rel_newMsg"
                    v-if="newMsgLength[loginVisitor.access_num][item.rs_num]>0"
                  >
                    <el-badge
                      class="mark"
                      :value="newMsgLength[loginVisitor.access_num][item.rs_num]"
                      :max="99"
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <div class="lengthd flex-c" style="width:130px">
                      <img v-if="item.guide_flg == 2" :src="icon.group_guide" alt>
                      <img v-if="item.rg_type == 0" :src="icon.group_general" alt>
                      <img v-if="item.rg_type == 1" :src="icon.group_tour" alt>
                      {{item.name}}
                    </div>
                    <div class>{{$base.timestampToTime(item.create_date)}}</div>
                  </div>
                  <div>
                    <div style="color:red" v-if="alt[sessionsData[index].rs_num]">[有人@你]&nbsp;</div>
                    <div
                      class="lengthd zzd"
                      :title="$base.showLast(showDemo,item.rs_num,1) || $base.isNull(item.recently)"
                      v-html="emojiTo($base.showLast(showDemo,item.rs_num,1) || $base.isNull(item.recently))"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="box-list" v-else-if="navFlg == 1" ref="swimTeamView">
          <div v-if="swimTeamData.length<1" class="titleTop">
            <span v-if="!listsearch">
              <i class="el-icon-loading"></i> 正在加载...
            </span>
            <span v-else>暂无数据！</span>
          </div>
          <div class="box-list-item" v-for="(item,index) in swimTeamData" :key="index">
            <div>
              <!-- 团 -->
              <div
                :class="{'item-cative1': ind === item.rs_num}"
                @click="chatBtn(swimTeamData, index)"
              >
                <div>
                  <img v-if="item.rg_icon == '' || item.rg_icon == null" :src="icon.guide" alt>
                  <img v-else :src="head_icon+item.rg_icon" alt>
                </div>
                <div>
                  <div>
                    <div class="lengthd flex-c" style="width:220px">
                      <img v-if="item.guide_flg == 2" :src="icon.group_guide" alt>
                      <img v-if="item.rg_type == 0" :src="icon.group_general" alt>
                      <img v-if="item.rg_type == 1" :src="icon.group_tour" alt>
                      {{item.rg_name}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="box-list" v-else-if="navFlg == 2" ref="firendView">
          <div v-if="firendData.length<1" class="titleTop">
            <span v-if="!listsearch">
              <i class="el-icon-loading"></i> 正在加载...
            </span>
            <span v-else>暂无数据！</span>
          </div>
          <div class="box-list-item" v-for="(item,index) in firendData" :key="index">
            <div>
              <!-- 侗友 -->
              <div
                :class="{'item-cative1': ind === item.rs_num}"
                @click="chatBtn(firendData, index)"
              >
                <div>
                  <img v-if="item.icon == '' || item.icon == null" :src="icon.firendHead" alt>
                  <img v-else-if="item.icon.indexOf('http') != -1" :src="item.icon" alt>
                  <img v-else :src="head_icon+item.icon" alt>
                </div>
                <div>
                  <div>
                    <div class="lengthd" style="width:220px">{{item.alias || item.name || item.num}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="box-list" v-else-if="navFlg == 3">
          <div v-if="newsFriend.unhandled.length<1 && newsFriend.handled.length<1" class="titleTop">
            <span v-if="!listsearch">
              <i class="el-icon-loading"></i> 正在加载...
            </span>
            <span v-else>暂无数据！</span>
          </div>
          <div class="box-list-newFirend">
            <!-- 新侗友 -->
            <div class="newFirend-title" v-if="newsFriend.unhandled.length>0">
              <div>未处理</div>
            </div>
            <div class="box-list-item">
              <div>
                <div v-for="(item, index) in newsFriend.unhandled" :key="index">
                  <div>
                    <img v-if="item.icon == '' || item.icon == null" :src="icon.firendHead" alt>
                    <img v-else-if="item.icon.indexOf('http') != -1" :src="item.icon" alt>
                    <img v-else :src="head_icon+item.icon" alt>
                  </div>
                  <div>
                    <div class="rexBtn">
                      <div class="lengthd" style="width:130px" :title="item.name">{{item.name}}</div>
                      <div v-if="item.apply_flg == 1">
                        <span></span>
                        <span>待验证</span>
                      </div>
                      <div v-else>
                        <span class="cur" @click="GetApplyhandle(item.rfa_id, 2)">
                          <img :src="icon.errormsg" alt>
                        </span>
                        <span class="cur" @click="GetApplyhandle(item.rfa_id, 1)">
                          <img :src="icon.successmsg" alt>
                        </span>
                      </div>
                    </div>
                    <div class="lengthd" :title="item.content">{{item.content}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="newFirend-title" v-if="newsFriend.handled.length>0">
              <div>已处理</div>
              <div @click="GetNewFirendClear">清空已处理消息</div>
            </div>
            <div class="box-list-item">
              <div>
                <div v-for="(item, index) in newsFriend.handled" :key="index" style="opacity:.6">
                  <div>
                    <img v-if="item.icon == '' || item.icon == null" :src="icon.guide" alt>
                    <img v-else-if="item.icon.indexOf('http') != -1" :src="item.icon" alt>
                    <img v-else :src="head_icon+item.icon" alt>
                  </div>
                  <div>
                    <div>
                      <div class="lengthd" style="width:145px" :title="item.name">{{item.name}}</div>
                      <div>{{item.rfa_status == 1 ? '已通过' : '已拒绝'}}</div>
                    </div>
                    <div class="lengthd" :title="item.content">{{item.content}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="search-list">
        <div class="newFirend-title" v-if="searchData.trim() == ''">
          <div style="margin: 0 auto">请输入关键字！</div>
        </div>
        <div
          class="newFirend-title"
          v-if="searchData.trim() != '' && searchdataInfo.length<1 && searchItemInfo.length<1"
        >
          <div style="margin: 0 auto" v-if="!listsearch">
            <i class="el-icon-loading"></i> 搜索中...
          </div>
          <div style="margin: 0 auto" v-else>暂无数据！</div>
        </div>
        <div class="newFirend-title" v-if="searchdataInfo.length>0">
          <div>侗友</div>
        </div>
        <div class="box-list-item">
          <div
            v-for="(item, index) in searchdataInfo"
            :key="index"
            @click="chatBtn(searchdataInfo, index)"
          >
            <div>
              <img v-if="item.icon == '' || item.icon == null" :src="icon.firendHead" alt>
              <img v-else-if="item.icon.indexOf('http') != -1" :src="item.icon" alt>
              <img v-else :src="head_icon+item.icon" alt>
            </div>
            <div>
              <div class="rexBtn">
                <div>{{item.name == '' ? item.num : item.name}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="newFirend-title" v-if="searchItemInfo.length>0">
          <div>游团</div>
        </div>
        <div class="box-list-item">
          <div
            v-for="(item, index) in searchItemInfo"
            :key="index"
            @click="chatBtn(searchItemInfo, index)"
          >
            <div>
              <img v-if="item.rg_icon == '' || item.rg_icon == null" :src="icon.guide" alt>
              <img v-else :src="head_icon+item.rg_icon" alt>
            </div>
            <div>
              <div>
                <div class="flex-c">
                  <img v-if="item.guide_flg == 2" :src="icon.group_guide" alt>
                  <img v-if="item.rg_type == 0" :src="icon.group_general" alt>
                  <img v-if="item.rg_type == 1" :src="icon.group_tour" alt>
                  {{item.rg_name}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="msg-send" v-if="chatType">
      <div class="msg-send-top">
        <div v-if="itemDataInfo.rs_source == 0" @click="GetFriendInfo(itemDataInfo.num)">
          <span>{{itemDataInfo.name}}</span>
          <span></span>
        </div>
        <div v-else-if="itemDataInfo.rs_source == 1" @click="dialogVisible.itemInfo = true">
          <span>{{itemDataInfo.name}}</span>
          <span>({{memsLength}}人)</span>
        </div>

        <el-dropdown trigger="click" class="top-tool">
          <span class="el-dropdown-link">
            <div>
              <img :src="icon.tool" alt>
            </div>
          </span>
          <el-dropdown-menu slot="dropdown">
            <div class="right-toll">
              <el-dropdown-item
                v-if="itemDataInfo.rs_sort == 0"
                @click.native="listTop(itemDataInfo)"
                class="clearfix"
              >
                <span>
                  <i class="el-icon-upload2"></i> 置顶
                </span>
              </el-dropdown-item>
              <el-dropdown-item v-else @click.native="listTop(itemDataInfo)" class="clearfix">
                <span>
                  <i class="el-icon-upload2"></i> 取消置顶
                </span>
              </el-dropdown-item>
              <el-dropdown-item @click.native="listDel(itemDataInfo)" class="clearfix">
                <span>
                  <i class="el-icon-delete"></i> 删除会话
                </span>
              </el-dropdown-item>

              <el-dropdown-item @click.native="clearMsg(itemDataInfo.rs_num)" class="clearfix">
                <span>
                  <i class="el-icon-close"></i> 清屏
                </span>
              </el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="msg-send-box" ref="viewBox">
        <div
          v-show="showDemo!=null"
          class="show-single"
          v-for="(item,index) in showDemo[rs_numCli]"
          :key="index"
        >
          <div
            v-if="index>= showDemo[rs_numCli].length-(10*viewBoxLength[rs_numCli].leng) && index<=showDemo[rs_numCli].length"
          >
            <div
              v-if="index == showDemo[rs_numCli].length-(10*viewBoxLength[rs_numCli].leng) && viewBoxLength[rs_numCli].type == 1"
              class="msgLoad cur"
              @click="loadingLength"
            >点击加载更多</div>
            <div
              v-if="index == showDemo[rs_numCli].length-(10*viewBoxLength[rs_numCli].leng) && viewBoxLength[rs_numCli].type == 0"
              class="msgLoad"
            >
              <img :src="icon.send_loading" alt>
            </div>
            <!-- date -->
            <div v-if="$base.threeTime(showDemo[rs_numCli],index)" class="show-time">
              <span>{{$base.timestampToTime(item.date)}}</span>
            </div>
            <!-- system -->
            <div v-if="$base.systemMsg(item.code)" class="show-system">
              <span :title="item.obj.content">{{item.obj.content}}</span>
            </div>
            <!-- y -->
            <div v-if="item.obj.own_num == baseinfo.access_num">
              <!--me消息-->
              <div v-if="$base.contentMeMsg(item.code)  && item.obj.type == 0" class="show-right">
                <img v-if="item.plat.send_type == 0" class="error" :src="icon.send_loading" alt>
                <img
                  @click="resDel(showDemo, rs_numCli, index)"
                  v-else-if="item.plat.send_type == -1"
                  class="error cur"
                  :src="icon.send_error"
                  alt
                >
                <span class="bubble rightJ" v-html="emojiTo(item.obj.content)"></span>
                <img
                  @click="GetFriendInfo(item.obj.own_num)"
                  class="headIcon cur"
                  v-if="baseinfo.icon == '' || baseinfo.icon == null"
                  :src="icon.firendHead"
                  alt
                >
                <img
                  @click="GetFriendInfo(item.obj.own_num)"
                  v-else-if="baseinfo.icon.indexOf('http') != -1"
                  class="headIcon cur"
                  :src="baseinfo.icon"
                  alt
                >
                <img
                  @click="GetFriendInfo(item.obj.own_num)"
                  v-else
                  class="headIcon cur"
                  :src="head_icon+baseinfo.icon"
                  alt
                >
              </div>
              <!--me行程-->
              <div v-if="$base.tripMeMsg(item.code) && item.obj.type == 0" class="show-right">
                <span
                  @click="GetInfoTrip(item.obj.rgm_num)"
                  class="trip rightJ"
                  style="width:248px!important;"
                >
                  <div>
                    <img :src="icon.trip" alt>
                  </div>
                  <div>
                    <div class="lengthd" :title="item.obj.content">{{item.obj.content}}</div>
                    <div>
                      <div>{{$base.tampToTime(item.obj.min_date,2)}}</div>
                      <div>~{{$base.tampToTime(item.obj.max_date,3,item.obj.min_date)}}</div>
                    </div>
                  </div>
                </span>
                <img
                  @click="GetFriendInfo(item.obj.own_num)"
                  class="headIcon cur"
                  v-if="baseinfo.icon == '' || baseinfo.icon == null"
                  :src="icon.firendHead"
                  alt
                >
                <img
                  @click="GetFriendInfo(item.obj.own_num)"
                  v-else-if="baseinfo.icon.indexOf('http') != -1"
                  class="headIcon cur"
                  :src="baseinfo.icon"
                  alt
                >
                <img
                  @click="GetFriendInfo(item.obj.own_num)"
                  v-else
                  class="headIcon cur"
                  :src="head_icon+baseinfo.icon"
                  alt
                >
              </div>
              <!--me文件-->
              <div v-if="$base.contentMeMsg(item.code) && item.obj.type == 4" class="show-right">
                <img v-if="item.plat.send_type == 0" class="error" :src="icon.send_loading" alt>
                <img
                  @click="resDel(showDemo, rs_numCli, index)"
                  v-else-if="item.plat.send_type == -1"
                  class="error cur"
                  :src="icon.send_error"
                  alt
                >
                <span class="file rightJ" @click="$base.openFile(OSSFILE+item.obj.url)">
                  <div>
                    <div>
                      <img v-if="$base.fileType(item.plat.file_name) == 'pdf'" :src="icon.pdf" alt>
                      <img
                        v-else-if="$base.fileType(item.plat.file_name) == 'word'"
                        :src="icon.word"
                        alt
                      >
                      <img
                        v-else-if="$base.fileType(item.plat.file_name) == 'xls'"
                        :src="icon.excel"
                        alt
                      >
                      <img
                        v-else-if="$base.fileType(item.plat.file_name) == 'ppt' "
                        :src="icon.ppt"
                        alt
                      >
                    </div>
                    <div>
                      <div
                        class="lengthd"
                        :title="item.plat.file_name"
                      >{{$base.lengHide(item.plat.file_name)}}</div>
                      <div>{{item.plat.file_size}}</div>
                    </div>
                  </div>
                </span>
                <img
                  @click="GetFriendInfo(item.obj.own_num)"
                  class="headIcon cur"
                  v-if="baseinfo.icon == '' || baseinfo.icon == null"
                  :src="icon.firendHead"
                  alt
                >
                <img
                  @click="GetFriendInfo(item.obj.own_num)"
                  v-else-if="baseinfo.icon.indexOf('http') != -1"
                  class="headIcon cur"
                  :src="baseinfo.icon"
                  alt
                >
                <img
                  @click="GetFriendInfo(item.obj.own_num)"
                  v-else
                  class="headIcon cur"
                  :src="head_icon+baseinfo.icon"
                  alt
                >
              </div>
              <!--me通知-->
              <div v-if="$base.noticeMeMsg(item.code)  && item.obj.type == 0" class="show-right">
                <span @click="GetInfoNotice(item.obj.rgm_num)" class="notice rightJ">
                  <div>
                    <img :src="icon.notice2" alt>
                    <div>游团通知</div>
                  </div>
                  <div>
                    <div class="lengthd" :title="item.obj.content">{{item.obj.content}}</div>
                    <div>{{$base.tampToTime(item.obj.create_date)}}</div>
                  </div>
                </span>
                <img
                  @click="GetFriendInfo(item.obj.own_num)"
                  class="headIcon cur"
                  v-if="baseinfo.icon == '' || baseinfo.icon == null"
                  :src="icon.firendHead"
                  alt
                >
                <img
                  @click="GetFriendInfo(item.obj.own_num)"
                  v-else-if="baseinfo.icon.indexOf('http') != -1"
                  class="headIcon cur"
                  :src="baseinfo.icon"
                  alt
                >
                <img
                  @click="GetFriendInfo(item.obj.own_num)"
                  v-else
                  class="headIcon cur"
                  :src="head_icon+baseinfo.icon"
                  alt
                >
              </div>
              <!--me图片-->
              <div v-if="$base.contentMeMsg(item.code) && item.obj.type == 1" class="show-right">
                <img v-if="item.plat.send_type == 0" class="error" :src="icon.send_loading" alt>
                <img
                  @click="resDel(showDemo, rs_numCli, index)"
                  v-else-if="item.plat.send_type == -1"
                  class="error cur"
                  :src="icon.send_error"
                  alt
                >
                <span class="rightJ" style="padding: 0;">
                  <img
                    @click="msgImgView(showDemo[rs_numCli],index,msg_img)"
                    class="msgImgs"
                    v-lazy="msg_img+item.obj.url"
                    alt
                  >
                </span>
                <!-- <span>
                </span>-->
                <img
                  @click="GetFriendInfo(item.obj.own_num)"
                  class="headIcon cur"
                  v-if="baseinfo.icon == '' || baseinfo.icon == null"
                  :src="icon.firendHead"
                  alt
                >
                <img
                  @click="GetFriendInfo(item.obj.own_num)"
                  v-else-if="baseinfo.icon.indexOf('http') != -1"
                  class="headIcon cur"
                  :src="baseinfo.icon"
                  alt
                >
                <img
                  @click="GetFriendInfo(item.obj.own_num)"
                  class="headIcon cur"
                  v-else
                  :src="head_icon+baseinfo.icon"
                  alt
                >
              </div>
              <!--me语音-->
              <div v-if="$base.contentMeMsg(item.code) && item.obj.type == 2" class="show-right">
                <span
                  @click="audioBtn(voice_file+item.obj.url,index)"
                  class="audio rightJ"
                  :style="{'width':item.plat.recording_session*10+55+'px','max-width':'200px','height':'20px'}"
                >
                  <div>
                    <img :src="audioInt == index ? icon.voicegif: icon.voiceh3" alt>
                    {{item.plat.recording_session}}s
                  </div>
                </span>
                <img
                  @click="GetFriendInfo(item.obj.own_num)"
                  class="headIcon cur"
                  v-if="baseinfo.icon == '' || baseinfo.icon == null"
                  :src="icon.firendHead"
                  alt
                >
                <img
                  @click="GetFriendInfo(item.obj.own_num)"
                  v-else-if="baseinfo.icon.indexOf('http') != -1"
                  class="headIcon cur"
                  :src="baseinfo.icon"
                  alt
                >
                <img
                  @click="GetFriendInfo(item.obj.own_num)"
                  class="headIcon cur"
                  v-else
                  :src="head_icon+baseinfo.icon"
                  alt
                >
              </div>
              <!--me视频-->
              <div v-if="$base.contentMeMsg(item.code) && item.obj.type == 3" class="show-right">
                <span>{{item.obj.content}}</span>
                <img
                  @click="GetFriendInfo(item.obj.own_num)"
                  class="headIcon cur"
                  v-if="baseinfo.icon == '' || baseinfo.icon == null"
                  :src="icon.firendHead"
                  alt
                >
                <img
                  @click="GetFriendInfo(item.obj.own_num)"
                  v-else-if="baseinfo.icon.indexOf('http') != -1"
                  class="headIcon cur"
                  :src="baseinfo.icon"
                  alt
                >
                <img
                  @click="GetFriendInfo(item.obj.own_num)"
                  class="headIcon cur"
                  v-else
                  :src="head_icon+baseinfo.icon"
                  alt
                >
              </div>
            </div>

            <div v-else>
              <!--y消息-->
              <div v-if="$base.contentYMsg(item.code) && item.obj.type == 0" class="show-left">
                <div>
                  <img
                    @click="GetFriendInfo(item.obj.own_num)"
                    class="headIcon cur"
                    v-if="item.obj.own_icon == '' || item.obj.own_icon == null "
                    :src="icon.firendHead"
                    alt
                  >
                  <img
                    @click="GetFriendInfo(item.obj.own_num)"
                    v-else-if="item.obj.own_icon.indexOf('http') != -1"
                    class="headIcon cur"
                    :src="item.obj.own_icon"
                    alt
                  >
                  <img
                    @click="GetFriendInfo(item.obj.own_num)"
                    class="headIcon cur"
                    v-else
                    :src="head_icon+item.obj.own_icon"
                    alt
                  >
                </div>
                <div>
                  <span>
                    <img v-if="item.obj.guide_flg==2" :src="icon.label_guide" alt>
                    <img v-if="item.obj.guide_flg<2" :src="icon.label_tourist" alt>
                    {{item.obj.own_name}}
                  </span>
                  <span v-html="emojiTo(item.obj.content)" class="leftJ"></span>
                </div>
              </div>

              <!--y行程-->
              <div v-if="$base.tripYMsg(item.code) && item.obj.type == 0" class="show-left">
                <div>
                  <img
                    @click="GetFriendInfo(item.obj.own_num)"
                    v-if="item.obj.own_icon == '' || item.obj.own_icon == null"
                    class="headIcon cur"
                    :src="icon.firendHead"
                    alt
                  >
                  <img
                    @click="GetFriendInfo(item.obj.own_num)"
                    v-else-if="item.obj.own_icon.indexOf('http') != -1"
                    class="headIcon cur"
                    :src="item.obj.own_icon"
                    alt
                  >
                  <img
                    @click="GetFriendInfo(item.obj.own_num)"
                    class="headIcon cur"
                    v-else
                    :src="head_icon+item.obj.own_icon"
                    alt
                  >
                </div>
                <div>
                  <span>
                    <img v-if="item.obj.guide_flg==2" :src="icon.label_guide" alt>
                    <img v-if="item.obj.guide_flg<2" :src="icon.label_tourist" alt>
                    {{item.obj.own_name}}
                  </span>
                  <span
                    @click="GetInfoTrip(item.obj.rgm_num)"
                    class="trip leftJ"
                    style="width:248px!important;margin-top: 5px;"
                  >
                    <div>
                      <img :src="icon.trip" alt>
                    </div>
                    <div>
                      <div class="lengthd" :title="item.obj.content">{{item.obj.content}}</div>
                      <div>
                        <div>{{$base.tampToTime(item.obj.min_date,2)}}</div>
                        <div>~{{$base.tampToTime(item.obj.max_date,3,item.obj.min_date)}}</div>
                      </div>
                    </div>
                  </span>
                </div>
              </div>

              <!--y文件-->
              <div v-if="$base.contentYMsg(item.code) && item.obj.type == 4" class="show-left">
                <div>
                  <img
                    @click="GetFriendInfo(item.obj.own_num)"
                    class="headIcon cur"
                    v-if="item.obj.own_icon == '' || item.obj.own_icon == null"
                    :src="icon.firendHead"
                    alt
                  >
                  <img
                    @click="GetFriendInfo(item.obj.own_num)"
                    v-else-if="item.obj.own_icon.indexOf('http') != -1"
                    class="headIcon cur"
                    :src="item.obj.own_icon"
                    alt
                  >
                  <img
                    @click="GetFriendInfo(item.obj.own_num)"
                    class="headIcon cur"
                    v-else
                    :src="head_icon+item.obj.own_icon"
                    alt
                  >
                </div>
                <div>
                  <span>
                    <img v-if="item.obj.guide_flg==2" :src="icon.label_guide" alt>
                    <img v-if="item.obj.guide_flg<2" :src="icon.label_tourist" alt>
                    {{item.obj.own_name}}
                  </span>
                  <span class="file leftJ">
                    <div>
                      <div>
                        <img
                          v-if="$base.fileType(item.plat.file_name) == 'pdf'"
                          :src="icon.pdf"
                          alt
                        >
                        <img
                          v-else-if="$base.fileType(item.plat.file_name) == 'word'"
                          :src="icon.word"
                          alt
                        >
                        <img
                          v-else-if="$base.fileType(item.plat.file_name) == 'xls'"
                          :src="icon.excel"
                          alt
                        >
                        <img
                          v-else-if="$base.fileType(item.plat.file_name) == 'ppt'"
                          :src="icon.ppt"
                          alt
                        >
                      </div>
                      <div>
                        <div
                          class="lengthd"
                          :title="item.plat.file_name"
                        >{{$base.lengHide(item.plat.file_name)}}</div>
                        <div>{{item.plat.file_size}}</div>
                      </div>
                    </div>
                    <div>
                      <p class="cur" @click="$base.downloadFile(OSSFILE+item.obj.url)">下载</p>
                      <p class="cur" @click="$base.openFile(OSSFILE+item.obj.url)">查看</p>
                    </div>
                  </span>
                </div>
              </div>

              <!--y通知-->
              <div v-if="$base.noticeYMsg(item.code)  && item.obj.type == 0" class="show-left">
                <div>
                  <img
                    @click="GetFriendInfo(item.obj.own_num)"
                    class="headIcon cur"
                    v-if="item.obj.own_icon == '' || item.obj.own_icon == null"
                    :src="icon.firendHead"
                    alt
                  >
                  <img
                    @click="GetFriendInfo(item.obj.own_num)"
                    v-else-if="item.obj.own_icon.indexOf('http') != -1"
                    class="headIcon cur"
                    :src="item.obj.own_icon"
                    alt
                  >
                  <img
                    @click="GetFriendInfo(item.obj.own_num)"
                    class="headIcon cur"
                    v-else
                    :src="head_icon+item.obj.own_icon"
                    alt
                  >
                </div>
                <div>
                  <span>
                    <img v-if="item.obj.guide_flg==2" :src="icon.label_guide" alt>
                    <img v-if="item.obj.guide_flg<2" :src="icon.label_tourist" alt>
                    {{item.obj.own_name}}
                  </span>
                  <span
                    @click="GetInfoNotice(item.obj.rgm_num)"
                    class="notice leftJ"
                    style="margin-top: 5px;"
                  >
                    <div>
                      <img :src="icon.notice2" alt>
                      <div>游团通知</div>
                    </div>
                    <div>
                      <div class="lengthd" :title="item.obj.content">{{item.obj.content}}</div>
                      <div>{{$base.tampToTime(item.obj.create_date)}}</div>
                    </div>
                  </span>
                </div>
              </div>

              <!--y图片-->
              <div v-if="$base.contentYMsg(item.code) && item.obj.type == 1" class="show-left">
                <div>
                  <img
                    @click="GetFriendInfo(item.obj.own_num)"
                    class="headIcon cur"
                    v-if="item.obj.own_icon == '' || item.obj.own_icon == null"
                    :src="icon.firendHead"
                    alt
                  >
                  <img
                    @click="GetFriendInfo(item.obj.own_num)"
                    v-else-if="item.obj.own_icon.indexOf('http') != -1"
                    class="headIcon cur"
                    :src="item.obj.own_icon"
                    alt
                  >
                  <img
                    @click="GetFriendInfo(item.obj.own_num)"
                    class="headIcon cur"
                    v-else
                    :src="head_icon+item.obj.own_icon"
                    alt
                  >
                </div>
                <div>
                  <span>
                    <img v-if="item.obj.guide_flg==2" :src="icon.label_guide" alt>
                    <img v-if="item.obj.guide_flg<2" :src="icon.label_tourist" alt>
                    {{item.obj.own_name}}
                  </span>
                  <span class="leftJ" style="padding: 0;">
                    <img
                      class="msgImgs"
                      @click="msgImgView(showDemo[rs_numCli],index,msg_img)"
                      v-lazy="msg_img+item.obj.url"
                      alt
                    >
                  </span>
                </div>
              </div>

              <!--y语音-->
              <div v-if="$base.contentYMsg(item.code) && item.obj.type == 2" class="show-left">
                <div>
                  <img
                    @click="GetFriendInfo(item.obj.own_num)"
                    class="headIcon cur"
                    v-if="item.obj.own_icon == '' || item.obj.own_icon == null"
                    :src="icon.firendHead"
                    alt
                  >
                  <img
                    @click="GetFriendInfo(item.obj.own_num)"
                    v-else-if="item.obj.own_icon.indexOf('http') != -1"
                    class="headIcon cur"
                    :src="item.obj.own_icon"
                    alt
                  >
                  <img
                    @click="GetFriendInfo(item.obj.own_num)"
                    class="headIcon cur"
                    v-else
                    :src="head_icon+item.obj.own_icon"
                    alt
                  >
                </div>
                <div>
                  <span>
                    <img v-if="item.obj.guide_flg==2" :src="icon.label_guide" alt>
                    <img v-if="item.obj.guide_flg<2" :src="icon.label_tourist" alt>
                    {{item.obj.own_name}}
                  </span>
                  <span
                    @click="audioBtn(voice_file+item.obj.url,index)"
                    class="audio leftJ"
                    :style="{'width':item.plat.recording_session*10+55+'px','max-width':'200px','height':'20px'}"
                  >
                    <div>
                      <img :src="audioInt == index ? icon.voicegif: icon.voiceh3" alt>
                      {{item.plat.recording_session}}s
                    </div>
                  </span>
                </div>
              </div>

              <!--y视频-->
              <div v-if="$base.contentYMsg(item.code) && item.obj.type == 3" class="show-left">
                <div>
                  <img
                    @click="GetFriendInfo(item.obj.own_num)"
                    class="headIcon cur"
                    v-if="item.obj.own_icon == '' || item.obj.own_icon == null"
                    :src="icon.firendHead"
                    alt
                  >
                  <img
                    @click="GetFriendInfo(item.obj.own_num)"
                    v-else-if="item.obj.own_icon.indexOf('http') != -1"
                    class="headIcon cur"
                    :src="item.obj.own_icon"
                    alt
                  >
                  <img
                    @click="GetFriendInfo(item.obj.own_num)"
                    class="headIcon cur"
                    v-else
                    :src="head_icon+item.obj.own_icon"
                    alt
                  >
                </div>
                <div>
                  <span>
                    <img v-if="item.obj.guide_flg==2" :src="icon.label_guide" alt>
                    <img v-if="item.obj.guide_flg<2" :src="icon.label_tourist" alt>
                    {{item.obj.own_name}}
                  </span>
                  <span class="leftJ">
                    <img class="msgImgs" :src="msg_img+item.obj.url" alt>
                  </span>
                </div>
              </div>

              <!-- me -->
            </div>
          </div>
        </div>
      </div>
      <div class="AltBox" v-if="AltData.length>0">
        <div>
          <div v-for="(item, index) in AltData" :key="index" class="lengthd" @click="AltBtn(item)">
            <div>
              <img v-if="item.rv_icon == '' || item.rv_icon == null" :src="icon.firendHead" alt>
              <img v-else-if="item.rv_icon.indexOf('http') != -1" :src="item.rv_icon" alt>
              <img v-else :src="head_icon+item.rv_icon" alt>
            </div>
            {{item.rv_name}}
          </div>
        </div>
      </div>
      <div class="msg-send-input" v-if="itemData.forbidden != 1">
        <div
          contenteditable="true"
          id="contentedit"
          class="contentedit"
          placeholder="..."
          @keydown="EventAlt"
          @focus="GetFocus"
          @blur="GetBlur"
        >
          <span v-if="!$base.isFirefox()">
            <img v-for="(item,index) in addIMGData.files" :key="index" :src="item.src" alt>
          </span>
        </div>
        <div class="iconbtn">
          <div class="icon-item">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <div>
                  <img
                    @mouseover="expressionover"
                    @mouseout="expressionout"
                    @click="expressionbtn"
                    :src="icon.expression"
                    title="表情"
                  >
                </div>
              </span>
              <el-dropdown-menu slot="dropdown">
                <div class="iconExpressionbtn">
                  <div
                    @click="addExpress(index)"
                    v-for="(item,index) in 206"
                    :key="index"
                    :class="`bg-`+(index+1)"
                  ></div>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
            <img
              v-if="itemData.guide_flg == 2"
              @mouseover="arrangementover"
              @mouseout="arrangementout"
              @click="arrangementbtn(itemData)"
              :src="icon.arrangement"
              title="新建行程安排"
            >
            <img
              v-if="itemData.guide_flg == 2"
              @mouseover="noticeover"
              @mouseout="noticeout"
              @click="noticebtn(itemData)"
              :src="icon.notice"
              title="新建游团通知"
            >
            <img
              @mouseover="albumover"
              @mouseout="albumout"
              @click="albumbtn"
              class="ml52"
              :src="icon.album"
              title="图片"
            >
            <img
              @mouseover="filesover"
              @mouseout="filesout"
              @click="filesbtn"
              :src="icon.files"
              title="文件"
            >
          </div>
          <input
            v-show="0"
            class="imgval"
            type="file"
            @change="sendImg"
            ref="file"
            multiple="multiple"
            accept="image/*"
          >
          <input
            v-show="0"
            class="fileval"
            type="file"
            @change="sendFile"
            ref="file1"
            multiple="multiple"
            accept=".xls, .xlsx, .doc, .docx, .pdf, .ppt, .pptx"
          >
          <div @click="send(0)" class="send-btn">
            <div :title="sendEnter">发送</div>
          </div>
        </div>
      </div>
      <div class="msg-send-input" v-else>已禁言。。。</div>
    </div>
    <div class="dialogs">
      <!-- 查看行程列表 -->
      <div class="listTrip">
        <el-dialog :visible.sync="dialogVisible.listTrip">
          <div class="listTrip-box">
            <div class="top">
              <div>
                行程安排
                <span>({{listTripData.data == null ? 0 : listTripData.data.length}}条)</span>
              </div>
              <div class="cur">
                <img @click="dialogVisible.listTrip = false" :src="icon.close" alt>
              </div>
            </div>
            <div v-if="listTripData == ''" style="text-align:center;margin-top:10px;">
              <i class="el-icon-loading"></i>加载中...
            </div>
            <div v-else>
              <div v-if="listTripData.data == null" class="anlig-c">暂无行程安排</div>
              <div v-for="item in listTripData.data" :key="item.index">
                <div
                  class="trip-title"
                  @click="GetInfoTrip(item.rgm_num),guide_flg = item.guide_flg"
                >
                  <div>{{item.title}}</div>
                  <div>
                    <div>{{$base.tampToTime(item.rgm_date)}}</div>
                    <div :class="{'ac': item.guide_flg == 2}">已查看人数：{{item.read_amount}}</div>
                  </div>
                </div>
                <div class="trip-content">
                  <div
                    v-for="(childItem, len) in item.routedists"
                    :key="len"
                    :class="{'col_9':Date.now()>childItem.date}"
                  >
                    <div>{{$base.tampToTime(childItem.date, 4)}}</div>
                    <div>{{childItem.content}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
      <!-- 行程安排详情 -->
      <div class="infoTrip">
        <el-dialog :visible.sync="dialogVisible.infoTrip">
          <div class="infoTrip-box">
            <div class="top">
              <div>行程安排详情</div>
              <div class="cur">
                <img @click="dialogVisible.infoTrip = false" :src="icon.close" alt>
              </div>
            </div>
            <div v-if="infoTripData == ''" style="text-align:center;padding-top:10px;">
              <i class="el-icon-loading"></i>加载中...
            </div>
            <div v-else class="infoTrips">
              <div class="infoTrip-title">
                <div>{{infoTripData.other.title}}</div>
                <div>
                  <div>{{$base.tampToTime(infoTripData.other.rgm_date)}}</div>
                  <div
                    :class="{'ac': infoTripData.guide_flg == 2}"
                  >已查看人数：{{infoTripData.other.read_amount}}</div>
                </div>
              </div>
              <div class="infoTrip-content">
                <div v-for="(item, index) in infoTripData.resData" :key="index">
                  <div class="dateY">
                    <span>{{$base.tampToTime(item[0].date, 5)}}</span>
                    <div class="rel-hr"></div>
                  </div>
                  <div v-for="(childItem, len) in item" :key="len" class="item-content">
                    <div>{{$base.tampToTime(childItem.date, 4)}}</div>
                    <div :class="{'col_9':Date.now()>childItem.date}">{{childItem.content}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tripEdit" v-if="guide_flg == 2 && infoTripData != ''">
              <el-button @click="GetDelTrip(infoTripData.rgm_num, listTripData.rg_num)">删除</el-button>
              <el-button
                @click="GetEditTrip"
                v-if="infoTripData.data[infoTripData.data.length-1].date>Date.now()"
                type="primary"
              >编辑行程安排</el-button>
              <el-button v-else title="无法编辑已过期行程" disabled>编辑行程安排</el-button>
            </div>
          </div>
        </el-dialog>
      </div>
      <!-- 编辑行程 -->
      <div class="addTrip">
        <el-dialog :visible.sync="dialogVisible.editTrip">
          <div class="addTrip-box" v-if="editTripData.title != undefined">
            <div class="top">
              <div>编辑行程安排</div>
              <div class="cur">
                <img title="发送" @click="GetRoutedistTrip(editTripData)" :src="icon.share" alt>
              </div>
            </div>
            <div>
              <div>
                <span>标题</span>
                <input v-model="editTripData.title" maxlength="20" type="text">
                <span>(限：{{20-editTripData.title.length}})</span>
              </div>
              <div>
                <el-date-picker
                  v-model="editTripData.date"
                  type="date"
                  align="center"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  @change="changeTripDate(editTripData.list, editTripData.date)"
                  :picker-options="pickerOption"
                ></el-date-picker>
                <div class="rel">
                  <div>（可选多天行程）</div>
                </div>
              </div>
              <div>
                <div v-for="(item,index) in editTripData.list[editTripData.date]" :key="index">
                  <div>
                    <el-time-picker
                      v-model="item.time"
                      format="HH:mm"
                      value-format="HH:mm"
                      @change="changeTime(item.time)"
                      @blur="changeTime(item.time)"
                      @input="updateDom"
                      placeholder="选择时间"
                      :disabled="disab(item.date)"
                    ></el-time-picker>
                  </div>
                  <div>
                    <img :src="icon.divider" alt>
                  </div>
                  <div>
                    <el-input
                      v-model="item.content"
                      maxlength="100"
                      :disabled="disab(item.date)"
                      placeholder="内容"
                    ></el-input>
                  </div>
                  <div>(限：{{100-item.content.length}})</div>
                  <div style="margin-right:4px;">
                    <i
                      style="cursor:pointer;"
                      @click="closeAddInput(editTripData.list[editTripData.date],index)"
                      class="el-icon-circle-close"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                @click="addInput(editTripData.list, editTripData.date)"
                class="cur"
                :src="icon.add_arrang"
                alt
              >
            </div>
          </div>
        </el-dialog>
      </div>
      <!-- 新增行程 -->
      <div class="addTrip">
        <el-dialog :visible.sync="dialogVisible.addTrip">
          <div class="addTrip-box">
            <div class="top">
              <div>新增行程安排</div>
              <div class="cur">
                <img title="发送" @click="GetAddTrip(addTripData)" :src="icon.share" alt>
              </div>
            </div>
            <div>
              <div>
                <span>标题</span>
                <input v-model="addTripData.title" type="text" maxlength="20" placeholder="请输入标题">
                <span>(限：{{20-addTripData.title.length}})</span>
              </div>
              <div>
                <el-date-picker
                  v-model="addTripData.date"
                  type="date"
                  align="center"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  @change="changeTripDate(addTripData.obj, addTripData.date)"
                  :picker-options="pickerOption"
                ></el-date-picker>
                <div class="rel">
                  <div>（可选多天行程）</div>
                </div>
              </div>

              <div>
                <div v-for="(item,index) in addTripData.obj[addTripData.date]" :key="index">
                  <div>
                    <el-time-picker
                      v-model="item.time"
                      format="HH:mm"
                      @change="changeTime(item.time)"
                      @blur="changeTime(item.time)"
                      @input="updateDom"
                      placeholder="选择时间"
                    ></el-time-picker>
                  </div>
                  <div>
                    <img :src="icon.divider" alt>
                  </div>
                  <div>
                    <el-input
                      v-model="item.content"
                      maxlength="100"
                      @input="updateDom"
                      placeholder="内容"
                    ></el-input>
                  </div>
                  <div>(限：{{100-item.content.length}})</div>
                  <div style="margin-right:4px;">
                    <i
                      style="cursor:pointer;"
                      @click="closeAddInput(addTripData.obj[addTripData.date],index)"
                      class="el-icon-circle-close"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                @click="addInput(addTripData.obj,addTripData.date)"
                class="cur"
                :src="icon.add_arrang"
                alt
              >
            </div>
          </div>
        </el-dialog>
      </div>
      <!-- 查看游团通知列表 -->
      <div class="listNotice">
        <el-dialog :visible.sync="dialogVisible.listNotice">
          <div class="listNotice-box">
            <div class="top">
              <div>
                游团通知
                <span>({{listNoticeData.data == null ? 0 : listNoticeData.data.length}}条)</span>
              </div>
              <div class="cur">
                <img class="cur" @click="dialogVisible.listNotice = false" :src="icon.close" alt>
              </div>
            </div>
            <div v-if="listNoticeData == ''" style="text-align:center;margin-top:10px;">
              <i class="el-icon-loading"></i>加载中...
            </div>
            <div v-else>
              <p v-if="listNoticeData.data == null" class="anlig-c">暂无游团通知</p>
              <div
                v-for="item in listNoticeData.data"
                :key="item.index"
                class="cur"
                @click="GetInfoNotice(item.rgm_num)"
              >
                <div>
                  <div>{{item.title}}</div>
                  <div>发布于{{$base.tampToTime(item.create_date)}}</div>
                </div>
                <div>
                  <div>{{item.content}}</div>
                  <div class="noticeVoice" v-if="item.audios != null">
                    <div>
                      <img :src="icon.voice3" alt>
                    </div>
                    <div>{{item.audios[0].content}}s</div>
                  </div>
                  <div class="noticeImg" v-if="item.imgs != null">
                    <img :src="msg_img+item.imgs[0].url" alt>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
      <!-- 游团通知详情 -->
      <div class="noticeInfo">
        <el-dialog :visible.sync="dialogVisible.noticeInfo">
          <div class="noticeInfo-box">
            <div class="top">
              <div>游团通知详情</div>
              <div class="cur">
                <img class="cur" @click="dialogVisible.noticeInfo = false" :src="icon.close" alt>
              </div>
            </div>
            <div v-if="infoNoticeData == ''" style="text-align:center">
              <i class="el-icon-loading"></i>加载中...
            </div>
            <div v-else>
              <div class="noticeInfo-title">
                <div>{{infoNoticeData.title}}</div>
                <div>发布时间：{{$base.tampToTime(infoNoticeData.create_date)}}</div>
              </div>
              <div class="noticeInfo-content">
                <div>{{infoNoticeData.content}}</div>
                <div
                  class="noticeVoice"
                  v-if="infoNoticeData.show_flg == 2 || infoNoticeData.show_flg == 4 || infoNoticeData.show_flg == 6 || infoNoticeData.show_flg == 7"
                >
                  <div class="cur" @click="audioBtn(voice_file+infoNoticeData.audios[0].url,0)">
                    <img :src="audioInt == 0 ? icon.voicegif1: icon.voice3" alt>
                  </div>
                  <div>{{infoNoticeData.audios[0].content}}s</div>
                </div>
                <div class="noticeImg">
                  <div
                    v-for="(item, index) in infoNoticeData.imgs"
                    :key="index"
                    :class="{'imgOne':infoNoticeData.imgs.length == 1}"
                  >
                    <img
                      :src="msg_img+item.url"
                      alt
                      @click="msgImgView(infoNoticeData.imgs,index,msg_img)"
                    >
                  </div>
                </div>
                <div class="operate" v-if="infoNoticeData.date != 0">
                  <img :src="icon.notice_remind" alt>
                  <span>{{$base.tampToTime(infoNoticeData.date)}} {{infoNoticeData.operate == 2 ? '震动及响铃' : '震动提醒'}}</span>
                </div>
              </div>
              <div class="del" v-if="infoNoticeData.guide_flg == 2">
                <el-button @click="GetNotedel(infoNoticeData.rgm_num)" size="mini">删除</el-button>
                <!-- <i @click="GetNotedel(infoNoticeData.rgm_num)" class="el-icon-delete"></i> -->
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
      <!-- 新增游团 -->
      <div class="addNotice">
        <el-dialog :visible.sync="dialogVisible.addNotice">
          <div class="addNotice-box">
            <div class="top">
              <div>编辑游团通知</div>
              <div class="cur">
                <img class="cur" @click="dialogVisible.addNotice = false" :src="icon.close" alt>
              </div>
            </div>
            <div>
              <div>
                <div>
                  <span>*</span>标题：
                  <span>(20字内)</span>
                </div>
                <div>
                  <el-input
                    v-model="addNoticeData.title"
                    maxlength="20"
                    type="text"
                    placeholder="请输入标题"
                  ></el-input>
                </div>
              </div>
              <div>
                <div>
                  <textarea
                    name
                    id
                    v-model="addNoticeData.content"
                    maxlength="300"
                    cols="30"
                    rows="10"
                    placeholder="请输入内容（300字内）..."
                  ></textarea>
                </div>
                <div>
                  <div class="cur">
                    <img @click="$refs.file3.click()" :src="icon.add_pic" alt>
                    <input
                      v-show="0"
                      type="file"
                      @change="fileChanged"
                      ref="file3"
                      multiple="multiple"
                      accept="image/jpg, image/jpeg, image/png, image/bmp"
                    >
                  </div>
                  <div>
                    <div v-for="(item,index) in addNoticeData.files" :key="index">
                      <img
                        class="cur"
                        @click="msgImgView(addNoticeData.files, index, '')"
                        :src="item.src"
                        alt
                      >
                      <span class="file-remove cur" @click.stop="removeImg(index)">
                        <div>+</div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div>提醒方式</div>
                <div>
                  <el-radio v-model="addNoticeData.operate" :label="0">无</el-radio>
                  <el-radio v-model="addNoticeData.operate" :label="1">震动</el-radio>
                  <el-radio v-model="addNoticeData.operate" :label="2">默认铃声</el-radio>
                </div>
              </div>
              <div v-show="addNoticeData.operate != 0">
                <div>提醒时间</div>
                <div>
                  <div>
                    <el-date-picker
                      v-model="addNoticeData.date"
                      type="datetime"
                      placeholder="选择提醒时间"
                      :disabled="addNoticeData.operate == 0"
                      :picker-options="pickerOption"
                      default-time="12:00:00"
                    ></el-date-picker>
                  </div>
                </div>
              </div>
            </div>
            <div @click="GetAddNotice" class="notice-box-send">发送</div>
          </div>
        </el-dialog>
      </div>
      <!-- 侗友信息 -->
      <div class="firendInfo">
        <el-dialog :visible.sync="dialogVisible.firendInfo">
          <div
            v-if="propData === ''"
            class="firendInfo-box"
            style="height:189px;text-align:center;"
          >
            <i class="el-icon-loading"></i>加载中...
          </div>
          <div v-else class="firendInfo-box">
            <div>
              <div>
                <img
                  class="cur"
                  @click="viewBtn(icon.firendHead)"
                  v-if="propData.icon == '' || propData.icon == null"
                  :src="icon.firendHead"
                  alt
                >
                <img
                  class="cur"
                  @click="viewBtn(propData.icon)"
                  v-else-if="propData.icon.indexOf('http') != -1"
                  :src="propData.icon"
                  alt
                >
                <img
                  class="cur"
                  @click="viewBtn(head_icon+propData.icon)"
                  v-else
                  :src="head_icon+propData.icon"
                  alt
                >
              </div>
              <div>
                <div>{{propData.name == '' ? propData.num : propData.name}}</div>
                <div>
                  <span>性别</span>
                  {{propData.sex == 0 ? '男' : '女'}}
                </div>
                <div>
                  <span>年龄</span>
                  {{propData.age}}岁 ({{$base.tampToTime(propData.birth,2)}})
                </div>
              </div>
            </div>
            <div>
              <span>手机号</span>
              <div>{{$base.flgNull(propData.phone)}}</div>
            </div>
            <div>
              <span>职业</span>
              <div>{{$base.flgNull(propData.occupation)}}</div>
            </div>
            <div>
              <span>地区</span>
              <div>{{$base.flgNull(propData.address)}}</div>
            </div>
            <div
              class="fx_rel"
              v-if="propData.friend_flg == 1 && propData.num != baseinfo.access_num"
            >
              <div @click="infoDel(propData)">删除</div>
            </div>
          </div>
        </el-dialog>
      </div>
      <!-- 团信息 -->
      <div class="itemInfo" v-if="memsData.group != undefined">
        <el-dialog :visible.sync="dialogVisible.itemInfo">
          <div class="itemInfo-box">
            <div class="top">
              <img
                @click="GetGfriends(memsData.group.rg_num), dialogVisible.addFriend = true"
                :src="icon.itemAdd"
                alt
              >
              <img
                v-if="memsData.group.guide_flg == 2"
                @click.stop="removeFriendType = !removeFriendType"
                :src="icon.itemRemove"
                alt
              >
            </div>
            <div class="itemInfoList">
              <div @click="GetFriendInfo(memsData.guide_bean.rv_num)">
                <div :title="memsData.guide_bean.rv_name">
                  <img
                    v-if="memsData.guide_bean.rv_icon == '' || memsData.guide_bean.rv_icon == null"
                    :src="icon.guide"
                    alt
                  >
                  <img
                    v-else-if="memsData.guide_bean.rv_icon.indexOf('http') != -1"
                    :src="memsData.guide_bean.rv_icon"
                    alt
                  >
                  <img v-else :src="head_icon+memsData.guide_bean.rv_icon" alt>
                </div>
                <div class="lengthd" style="color:red;">{{memsData.guide_bean.rv_name}}</div>
              </div>
              <div
                v-for="(item,index) in memsData.visitor_beans"
                :key="index"
                :title="item.rv_name"
              >
                <div @click="GetFriendInfo(item.rv_num)">
                  <img v-if="item.rv_icon == '' || item.rv_icon == null" :src="icon.firendHead" alt>
                  <img v-else-if="item.rv_icon.indexOf('http') != -1" :src="item.rv_icon" alt>
                  <img v-else :src="head_icon+item.rv_icon" alt>
                </div>
                <div class="lengthd" @click="GetFriendInfo(item.rv_num)">{{item.rv_name}}</div>
                <div
                  class="removeFirend"
                  v-if="removeFriendType"
                  @click.stop="RemoveFirend(memsData.group.rg_num, memsData.visitor_beans[index].rv_num)"
                >
                  <div>-</div>
                </div>
              </div>
            </div>
            <div>
              <span>行程安排</span>
              <div>
                <div @click="GetListTrip(itemDataInfo.rg_num),dialogVisible.listTrip = true">
                  查看
                  <i class="el-icon-arrow-right"></i>
                </div>
              </div>
            </div>
            <div>
              <span>游团通知</span>
              <div>
                <div @click="GetListNotice(itemDataInfo.rg_num)">
                  查看
                  <i class="el-icon-arrow-right"></i>
                </div>
              </div>
            </div>
            <div>
              <span>团头像</span>
              <div>
                <img v-if="groupInfo.icon == '' || groupInfo.icon == null" :src="icon.guide" alt>
                <img v-else-if="groupInfo.icon.indexOf('http') != -1" :src="groupInfo.icon" alt>
                <img v-else :src="head_icon+groupInfo.icon" alt>
              </div>
            </div>
            <div>
              <span>团名称</span>
              <div
                class="lengthd"
                style="width:230px;text-align:right"
                :title="itemSettingData.rg_name"
              >{{itemSettingData.rg_name}}</div>
            </div>
            <div>
              <span>我在本团名称</span>
              <div
                @click="GetEditMyItemName(),old_name=itemSettingData.alias"
                v-if="!myItemFlg"
                :title="itemSettingData.alias"
              >{{itemSettingData.alias}}</div>
              <div v-if="myItemFlg" class="editMyItemName">
                <el-input
                  ref="editMyItemName"
                  v-model="itemSettingData.alias"
                  @blur="GetEditMyItemNameT(itemSettingData.alias,itemSettingData.rg_num,baseinfo.access_num)"
                ></el-input>
              </div>
            </div>
            <div>
              <span>消息免打扰</span>
              <div>
                <el-switch @change="disturbBtn(itemSettingData)" v-model="disturb"></el-switch>
              </div>
            </div>
            <div v-if="itemDataInfo.guide_flg == 2">
              <span @click="listItemDel(itemSettingData.rg_num)">解散团</span>
            </div>
            <div v-else>
              <span @click="RemoveFirend(itemSettingData.rg_num,baseinfo.access_num,0,1)">删除并退出</span>
            </div>
          </div>
        </el-dialog>
      </div>
      <!-- 邀请侗友进团 -->
      <div class="itemInfoAdd">
        <el-dialog :visible.sync="dialogVisible.addFriend">
          <div class="itemInfoAdd-box">
            <div class="top">
              <div>
                <img :src="icon.addPropw" alt> 邀请进团
              </div>
              <div @click="dialogVisible.addFriend = false">x</div>
            </div>
            <div>
              <el-input
                prefix-icon="el-icon-search"
                v-model="createData.addFirend.content"
                placeholder="手机号/用户名"
              ></el-input>
            </div>
            <div>
              <div>
                <div v-if="gfriends.length>0">侗友</div>
                <div v-for="(item,index) in gfriends" :key="index">
                  <div>
                    <img v-if="item.icon == '' || item.icon == null" :src="icon.firendHead" alt>
                    <img v-else-if="item.icon.indexOf('http') != -1" :src="item.icon" alt>
                    <img v-else :src="head_icon+item.icon" alt>
                  </div>
                  <div>
                    <span>{{item.name == '' ? item.num : item.name}}</span>
                    <el-button
                      @click="GetItemInfoAdd(memsData.group.rg_num, item.num)"
                      type="primary"
                      size="mini"
                    >邀请</el-button>
                  </div>
                </div>
              </div>
              <div>
                <div v-if="createData.addFirend.list.length>0">非侗友</div>
                <div
                  class="firendItem"
                  v-for="(item) in createData.addFirend.list"
                  :key="item.index"
                >
                  <div>
                    <img v-if="item.icon == '' || item.icon == null" :src="icon.firendHead" alt>
                    <img v-else-if="item.icon.indexOf('http') != -1" :src="item.icon" alt>
                    <img v-else :src="head_icon+item.icon" alt>
                  </div>
                  <div>
                    <span>{{item.name == '' ? item.num : item.name}}</span>
                    <el-button
                      @click="GetItemInfoAdd(memsData.group.rg_num, item.num)"
                      type="primary"
                      size="mini"
                    >邀请</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
    <viewimg v-if="imgType" :imgurl="imgurlList" @typeBy="typeBy"></viewimg>
  </div>
</template>

<script>
import Loading from "../../loading/loading";
import viewimg from "./../../viewimg/viewimg";
export default {
  data() {
    return {
      loginVisitor: {},
      baseinfo: {},
      len: 0,
      loadingDiv: false,
      audioInt: -1,
      icon: {
        label_guide: this.OSSIMG + "label_guide.png", //导游label
        label_tourist: this.OSSIMG + "label_tourist.png", //游客label
        search: this.OSSIMG + "icon_searching.png", //搜索
        add: this.OSSIMG + "icon_addition.png", //添加
        firendHead: this.OSSIMG + "icon_tongyou_head.png", //默认好友头像
        guide: this.OSSIMG + "icon_youtuan_head.png", //默认团头像
        group_guide: this.OSSIMG + "icon_youtaun_oneself.png", //团长
        group_general: this.OSSIMG + "icon_general_group.png", //普通团
        group_tour: this.OSSIMG + "icon_tour_group.png", //旅行团
        to_top: this.OSSIMG + "to_top.png", //置顶
        trip: this.OSSIMG + "icon_arrangement2.png", //行程安排
        tool: this.OSSIMG + "icon_more.png", //其他
        expression: this.OSSIMG + "icon_expression_default.png", //表情
        arrangement: this.OSSIMG + "icon_arrangement_default.png", //行程安排
        notice: this.OSSIMG + "icon_notice_default.png", //游团通知
        album: this.OSSIMG + "icon_album_default.png", //图片
        files: this.OSSIMG + "icon_folder_default.png", //文件
        message: this.OSSIMG + "icon_message_default.png", //记录
        share: this.OSSIMG + "icon_share2.png", //发送行程
        divider: this.OSSIMG + "icon_divider11.png", //border
        add_arrang: this.OSSIMG + "icon_add_arrangement.png", //添加行程table
        top: this.OSSIMG + "icon_top.png", //置顶
        delet3: this.OSSIMG + "icon_delet3.png", //删除
        empty: this.OSSIMG + "icon_scan_empty.png", //清空
        addItem: this.OSSIMG + "icon_cjyt.png", //创建游团
        addItemw: this.OSSIMG + "icon_cjyt_w.png",
        addProp: this.OSSIMG + "icon_tjty.png", //添加侗友
        addPropw: this.OSSIMG + "icon_tjty_w.png",
        send_error: this.OSSIMG + "icon_sed_error.png", //发送失败
        send_loading: this.OSSIMG + "icon_send_loading.gif", //发送中
        //查看游团资料icon
        itemAdd: this.OSSIMG + "%2B.png",
        itemRemove: this.OSSIMG + "-.png",
        dropDown: this.OSSIMG + "icon_drop_down2.png",
        //临时通知
        notice2: this.OSSIMG + "icon_notice2.png",
        notice_remind: this.OSSIMG + "icon_notice_remind.png",
        bg_voice: this.OSSIMG + "bg_voice.png",
        voice1: this.OSSIMG + "icon_voice1.png",
        voice2: this.OSSIMG + "icon_voice2.png",
        voice3: this.OSSIMG + "icon_voice3.png",
        voiceh3: this.OSSIMG + "icon_voice3_black.png",
        voicegif: this.OSSIMG + "icon_voice1_gif_black.gif",
        voicegif1: this.OSSIMG + "icon_voice1_gif.gif",
        add_pic: this.OSSIMG + "icon_add_pic.png",
        //发送文件
        pdf: this.OSSIMG + "icon_pdf.png",
        excel: this.OSSIMG + "icon_excel.png",
        word: this.OSSIMG + "icon_word.png",
        ppt: this.OSSIMG + "icon_ppt.png",
        close: this.OSSIMG + "delete.png",
        successmsg: this.OSSIMG + "%2Bagreement.png",
        errormsg: this.OSSIMG + "-ignor.png"
      },
      dialogVisible: {
        imgView: false,
        listTrip: false,
        infoTrip: false,
        editTrip: false,
        addTrip: false,
        listNotice: false,
        noticeInfo: false,
        addNotice: false,
        firendInfo: false,
        itemInfo: false,
        addFriend: false
      },
      navFlg: "0",
      // iconEx: ['😄','😃','😀','😊','😉','😍','😘','😚','😗','😙','😜','😝','😛','😳','😁','😔','😌','😒','😞','😣','😢','😂','😭','😪','😥','😰','😅','😓','😩','😫','😨','😱','😠','😡','😤','😖','😆','😋','😷','😎','😴','😵','😲','😟','😦','😧','😈','👿','😮','😬','😐','😕','😯','😶','😇','😏','😑','👲','👳','👮','👷','💂','👶','👦','👧','👨','👩','👴','👵','👱','👼','👸','😺','😸','😻','😽','😼','🙀','😿','😹','😾','👹','👺','🙈','🙉','🙊','💀','👽','💩','🔥','✨','🌟','💫','💥','💢','💦','💧','💤','💨','👂','👀','👃','👅','👄','👍','👎','👌','👊','✊','✌','👋','✋','👐','👆','👇','👉','👈','🙌','🙏','☝','👏','💪','🚶','🏃','💃','👫','👪','👬','👭','💏','💑','👯','🙆','🙅','💁','🙋','💆','💇','💅','👰','🙎','🙍','🙇','🎩','👑','👒','👟','👞','👡','👠','👢','👕','👔','👚','👗','🎽','👖','👘','👙','💼','👜','👝','👛','👓','🎀','🌂','💄','💛','💙','💜','💚','❤','💔','💓','💕','💖','💞','💘','💌','💋','💍','💎','👤','💬','👣','💭'],
      iconEx: [
        "😄",
        "😁",
        "😂",
        "😃",
        "😄",
        "😅",
        "😆",
        "😇",
        "😈",
        "😉",
        "😊",
        "😋",
        "😌",
        "😍",
        "😎",
        "😏",
        "😐",
        "😑",
        "😒",
        "😓",
        "😔",
        "😕",
        "😖",
        "😗",
        "😘",
        "😙",
        "😚",
        "😛",
        "😜",
        "😝",
        "😞",
        "😟",
        "😠",
        "😡",
        "😢",
        "😣",
        "😤",
        "😥",
        "😦",
        "😧",
        "😨",
        "😩",
        "😪",
        "😫",
        "😬",
        "😭",
        "😦",
        "😧",
        "😰",
        "😱",
        "😲",
        "😳",
        "😴",
        "😵",
        "😶",
        "😷",
        "😸",
        "😹",
        "😺",
        "😻",
        "😽",
        "😾",
        "😿",
        "🙀",
        "🙅",
        "🙆",
        "🙇",
        "🙈",
        "🙉",
        "🙊",
        "🙋",
        "🙌",
        "🙍",
        "🙎",
        "🙏",
        "🚀",
        "🚁",
        "🚂",
        "🚃",
        "🚆",
        "🚈",
        "🚉",
        "🚊",
        "🚌",
        "🚍",
        "🚎",
        "🚏",
        "🚐",
        "🚑",
        "🚒",
        "🚓",
        "🚔",
        "🚕",
        "🚖",
        "🚗",
        "🚘",
        "🚙",
        "🚚",
        "🚛",
        "🚝",
        "🚞",
        "🚟",
        "🚠",
        "🚡",
        "🚢",
        "🚣",
        "🚤",
        "🚥",
        "🚦",
        "🚧",
        "🚨",
        "🚩",
        "🅰",
        "🅱",
        "🅾",
        "🅿",
        "🆎",
        "🆑",
        "🆒",
        "🆓",
        "🆔",
        "🆕",
        "🆖",
        "🆗",
        "🆘",
        "🆙",
        "🆚",
        "🈁",
        "🈂",
        "🈚",
        "🈯",
        "🈲",
        "🈳",
        "🈴",
        "🈵",
        "🈶",
        "🈷",
        "🈸",
        "🈹",
        "🈺",
        "🉐",
        "🉑",
        "🌀",
        "🌁",
        "🌄",
        "🌅",
        "🌆",
        "🌇",
        "🌈",
        "🌉",
        "🌊",
        "🌋",
        "🌌",
        "🌍",
        "🌎",
        "🌏",
        "🌐",
        "🌑",
        "🌒",
        "🌓",
        "🌔",
        "🌕",
        "🌖",
        "🌗",
        "🌘",
        "🌙",
        "🌚",
        "🌛",
        "🌜",
        "🌝",
        "🌞",
        "🌰",
        "🌱",
        "🌲",
        "🌳",
        "🌴",
        "🌵",
        "🌷",
        "🌸",
        "🌹",
        "🌺",
        "🌻",
        "🌼",
        "🌽",
        "🌾",
        "🌿",
        "🍀",
        "🍁",
        "🍂",
        "🍃",
        "🍄",
        "🍅",
        "🍆",
        "🍇",
        "🍈",
        "🍉",
        "🍊",
        "🍋",
        "🍌",
        "🍍",
        "🍎",
        "🍏",
        "🍐",
        "🍑",
        "🍒",
        "🍓"
      ],
      baseinfo: {}, //我的信息
      itemData: {}, //聊天的侗友或团信息
      itemDataInfo: {},
      sessionsData: [], //消息
      swimTeamData: [], //游团
      firendData: [], //侗友
      newsFriend: { unhandled: [], handled: [] }, //新侗友
      newFriendL: 0, //新侗友信息长度
      searchData: "", //搜索内容
      searchType: false, //搜索状态
      listsearch: true,
      searchdataInfo: [], //搜索数据
      searchItemInfo: [],
      gfriends: [], //可被拉进团的侗友
      socketJson: {
        prefix: "", //消息前缀
        code: "", //状态码
        date: new Date().getTime(), //操作时间
        msg: "", //提示信息
        msg_prefix: "",
        plat: {
          //自定义
          uniqueness_num: "" //发送信息唯一标识
        },
        obj: {
          rs_num: "", //回话编码
          own_num: "", //个人编码
          type: "", //发送消息状态  0=>文本  1=>图片  2=>语音  3=>视频
          content: "", //文本内容
          url: "" //非文本地址
        }
      }, //发出去的消息
      chatType: false, //聊天状态
      ind: "",
      ws: null,
      memsData: {}, //团列表信息
      itemSettingData: {}, //团设置信息
      removeFriendType: false,
      guide_flg: "",
      propData: "", //好友个人信息
      sheNum: "",
      groupInfo: {}, //团信息
      memsLength: "", //团列表人数
      rs_numCli: "", //点击的rs_num
      showDemo: {}, //在demo显示
      uniqueness_num: "", //uuid
      client: "", //阿里云存储
      newMsgLength: {}, //信息消息提示
      createData: {
        //创建团、添加侗友信息
        addItem: {
          type: false,
          content: ""
        },
        addFirend: {
          type: false,
          content: "",
          list: []
        }
      },
      addTripData: {
        //新增行程
        title: "",
        date: this.$base.tampToTime(Date.now(), 2),
        obj: {}
      },
      addNoticeData: {
        //新增游团通知
        title: "",
        operate: 0,
        date: "",
        files: [],
        imgs: [],
        audios: [],
        video: {}
      },
      addIMGData: {
        files: [],
        imgs: [],
        content: ""
      },
      imgData: {
        imgs: []
      }, //图片预览数据
      imgViewUrl: "",
      imgType: false,
      imgurlList: [],
      listTripData: "", //行程安排列表（团内）
      infoTripData: "", //行程安排详情
      infoRgm_num: "",
      listNoticeData: "", //游团通知列表（团内）
      infoNoticeData: "", //游团通知详情
      editTripData: {}, //编辑行程
      proList: [],
      pickerOption: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      heartCheck: {
        timeout: 45000, //45s发一次心跳
        timeoutObj: null,
        serverTimeoutObj: null,
        that: this,
        reset: function() {
          clearTimeout(this.timeoutObj);
          clearTimeout(this.serverTimeoutObj);
          return this;
        },
        start: function() {
          const self = this.that;
          this.timeoutObj = setInterval(function() {
            var data = {
              code: "sk_000005",
              prefix: "SKC",
              msg_prefix: "",
              warn: -1,
              date: "0",
              msg: "操作成功",
              obj: null,
              plat: null
            };
            if (self.ws != null) {
              try {
                self.ws.send(JSON.stringify(data));
              } catch (e) {}
            }
          }, this.timeout);
        }
      },
      sendEnter: "",
      viewBoxLength: {},
      sessionsPage: 1,
      swimTeamPage: 1,
      firendPage: 1,
      placeholderText: "...",
      isFirefox: false,
      newMessage: this.voice_file + "newMessage.mp3",
      AltData: [],
      flashTitlePlayer: {
        that: this,
        start: function(msg) {
          const self = this.that;
          this.title = document.title;
          if (!this.action) {
            try {
              this.element = document.getElementsByTagName("title")[0];
              this.element.innerHTML = this.title;
              this.action = function(ttl) {
                this.element.innerHTML = ttl;
              };
            } catch (e) {
              this.action = function(ttl) {
                document.title = ttl;
              };
              delete this.element;
            }
            this.toggleTitle = function() {
              this.action(
                this.title +
                  this.messages[(this.index = this.index == 0 ? 1 : 0)]
              );
            };
          }
          this.messages = [msg];
          var n = msg.length;
          var s = "";
          if (this.element) {
            var num = msg.match(/\w/g);
            if (num != null) {
              var n2 = num.length;
              n -= n2;
              while (n2 > 0) {
                s += " ";
                n2--;
              }
            }
          }
          while (n > 0) {
            s += "　";
            n--;
          }
          this.messages.push(s);
          this.index = 0;
          this.timer = setInterval(function() {
            self.flashTitlePlayer.toggleTitle();
          }, 500);
        },
        stop: function() {
          if (this.timer) {
            clearInterval(this.timer);
            this.action(this.title);
            delete this.timer;
            delete this.messages;
          }
        }
      },
      newlengthS: 0,
      disturb: "",
      alt: {}, //@状态
      current: 0,
      myItemFlg: false //修改我在本团名称状态
    };
  },
  props: ["enterType", "exitType", "routeNav"],
  components: {
    Loading,
    viewimg
  },
  mounted() {
    const that = this;
    // 设置title
    let OriginTitile = document.title,
      titleTime;
    document.addEventListener("visibilitychange", function() {
      if (document.hidden) {
      } else {
        that.stopFlash();
      }
    });
    setTimeout(() => {
      // that._initSwiper();
    }, 100);
    // document.getElementById('sessView').oncontextmenu = function(e) {
    //     return false;
    // }
  },
  created() {
    const that = this;
    let loginVisitor = localStorage.getItem("loginVisitor");
    let baseinfo = localStorage.getItem("baseinfo");
    let enterD = localStorage.getItem("enterD");
    let viewBoxLength = localStorage.getItem("viewBoxLength");

    that.loginVisitor = JSON.parse(loginVisitor);
    that.baseinfo = JSON.parse(baseinfo);

    if (loginVisitor == null || loginVisitor == "") {
      // that.$message({
      //     message: "登录超时，请重新登录！",
      //     type: 'error'
      // })
      localStorage.setItem("loginVisitor", "");
      that.$router.push({
        path: "/"
      });
    } else {
      setTimeout(() => {
        // that.GetswimTeam()  //游团
        // that.GetFirend()    //侗友
        // that.GetNewFirend(); //新侗友
        var share = localStorage.getItem("share");
        // console.log(share);
        if (that.baseinfo.access_flat < 0 && share == 1) {
          // that.GetSessions(); //消息
          that.websocket();
          that.showDemo = JSON.parse(localStorage.getItem("locaShowDom"));
          that.locaAllMsg = JSON.parse(localStorage.getItem("locaAllMsg"));
          if (that.showDemo == null) {
            that.showDemo = {};
          }
          if (that.locaAllMsg == null) {
            that.locaAllMsg = {};
          }
        }
      }, 100);
    }
    if (this.enterD == null || this.enterD == 0) {
      this.sendEnter = "点击/Enter 发送消息";
    } else {
      this.sendEnter = "点击/Ctrl+Enter 发送消息";
    }
    if (viewBoxLength == null) {
      this.viewBoxLength = {};
    } else {
      this.viewBoxLength = JSON.parse(viewBoxLength);
    }
  },
  watch: {
    navFlg() {
      const that = this;
      if (this.navFlg == 0) {
        if (this.$refs.swimTeamView != undefined)
          that.$refs.swimTeamView.removeEventListener(
            "scroll",
            that.EventswimTeamFn,
            false
          );
        if (this.$refs.firendView != undefined)
          that.$refs.firendView.removeEventListener(
            "scroll",
            that.EventFirendFn,
            false
          );
      } else if (this.navFlg == 1) {
        if (this.$refs.sessView != undefined)
          that.$refs.sessView.removeEventListener(
            "scroll",
            that.EventSessFn,
            false
          );
        if (this.$refs.firendView != undefined)
          that.$refs.firendView.removeEventListener(
            "scroll",
            that.EventFirendFn,
            false
          );
      } else if (this.navFlg == 2) {
        if (this.$refs.sessView != undefined)
          that.$refs.sessView.removeEventListener(
            "scroll",
            that.EventSessFn,
            false
          );
        if (this.$refs.swimTeamView != undefined)
          that.$refs.swimTeamView.removeEventListener(
            "scroll",
            that.EventswimTeamFn,
            false
          );
      } else {
        if (this.$refs.sessView != undefined)
          that.$refs.sessView.removeEventListener(
            "scroll",
            that.EventSessFn,
            false
          );
        if (this.$refs.swimTeamView != undefined)
          that.$refs.swimTeamView.removeEventListener(
            "scroll",
            that.EventswimTeamFn,
            false
          );
        if (this.$refs.firendView != undefined)
          that.$refs.firendView.removeEventListener(
            "scroll",
            that.EventFirendFn,
            false
          );
      }
    },
    newlengthS() {
      const that = this;
      if (document.hidden) {
        if (this.newlengthS > 0) {
          that.stopFlash();
          // setTimeout(() => {
          that.flashTitle(" 【新消息！】");
          // }, 0);
        }
      } else {
        that.stopFlash();
      }
    },
    showDemo() {
      const that = this;
      setTimeout(() => {
        that.scrollB();
      }, 0);
    },
    //全部搜索
    searchData() {
      if (this.searchData.trim() == "") {
        this.searchdataInfo = [];
        this.searchItemInfo = [];
      } else {
        this.GetAllSearch(this.searchData);
      }
    },
    //添加侗友搜索
    "createData.addFirend.content"() {
      if ($.trim(this.createData.addFirend.content) != "") {
        this.GetAddFirendSearch(this.createData.addFirend.content);
      } else {
        this.createData.addFirend.list = [];
      }
      this.GetGfriends(this.itemData.rg_num);
    },
    "createData.addFirend.type"() {
      this.createData.addFirend.content = "";
    },
    "memsData.visitor_beans"() {
      if (this.memsData.visitor_beans.length < 1) {
        this.removeFriendType = false;
      }
    },
    "dialogVisible.addTrip"() {
      if (this.dialogVisible.addTrip == false) {
        this.addTripData = {
          title: "",
          date: this.$base.tampToTime(Date.now(), 2),
          obj: {}
        };
        setTimeout(() => {
          $(".addTrip .el-dialog").css({ top: 0, left: 230 });
        }, 300);
      } else {
      }
      setTimeout(() => {
        this.moveDiv("addTrip");
      }, 0);
    },
    "dialogVisible.editTrip"() {
      setTimeout(() => {
        this.moveDiv("addTrip");
      }, 0);
      if (this.dialogVisible.editTrip == false) {
        setTimeout(() => {
          $(".addTrip .el-dialog").css({ top: 0, left: 230 });
        }, 300);
      }
    },
    "dialogVisible.listTrip"() {
      setTimeout(() => {
        this.moveDiv("listTrip");
      }, 0);
      if (this.dialogVisible.listTrip == false) {
        setTimeout(() => {
          $(".listTrip .el-dialog").css({ top: 0, left: 230 });
        }, 300);
      }
    },
    "dialogVisible.listNotice"() {
      setTimeout(() => {
        this.moveDiv("listNotice");
      }, 0);
      if (this.dialogVisible.listNotice == false) {
        setTimeout(() => {
          $(".listNotice .el-dialog").css({ top: 0, left: 230 });
        }, 300);
      }
    },
    "dialogVisible.infoTrip"() {
      setTimeout(() => {
        this.moveDiv("infoTrip");
      }, 0);
      if (this.dialogVisible.infoTrip == false) {
        setTimeout(() => {
          $(".infoTrip .el-dialog").css({ top: 0, left: 230 });
        }, 300);
      }
    },
    "dialogVisible.noticeInfo"() {
      setTimeout(() => {
        this.moveDiv("noticeInfo");
      }, 0);
      if (this.dialogVisible.noticeInfo == false) {
        setTimeout(() => {
          $(".noticeInfo .el-dialog").css({ top: 0, left: 230 });
        }, 300);
      }
    },
    "dialogVisible.addNotice"() {
      setTimeout(() => {
        this.moveDiv("addNotice");
      }, 0);
      if (this.dialogVisible.addNotice == false) {
        setTimeout(() => {
          $(".addNotice .el-dialog").css({ top: 0, left: 230 });
        }, 300);
      }
    },
    "dialogVisible.itemInfo"() {
      //团信息发生改变隐藏移除开关
      this.removeFriendType = false;
      setTimeout(() => {
        this.moveDiv("itemInfo");
      }, 0);
      if (this.dialogVisible.itemInfo == false) {
        setTimeout(() => {
          $(".itemInfo .el-dialog").css({ top: 50, left: 130 });
        }, 300);
      }
    },
    enterType() {
      if (this.enterType == 1) {
        this.sendEnter = "点击/Ctrl+Enter 发送消息";
      } else {
        this.sendEnter = "点击/Enter 发送消息";
      }
    },
    exitType() {
      this.disconnect();
    },
    routeNav() {
      if (this.routeNav == "msg" || this.routeNav == "MSG") {
        // console.log('clear')
        this.showDemo = {};
        localStorage.setItem("historyMsg", JSON.stringify({}));
        localStorage.setItem("locaShowDom", JSON.stringify({}));
        localStorage.setItem("locaAllMsg", JSON.stringify({}));
        // this.loadingDiv = true;
        this.GetSessions(1);
      }
    },
    newMsgLength() {
      this.say();
    }
  },
  methods: {
    typeBy(t) {
      this.imgType = t;
    },
    viewBtn(data, index) {
      if (!Array.isArray(data)) {
        this.imgurlList = {
          imgs: [data],
          index: 0
        };
      } else {
        this.imgurlList = {
          imgs: data,
          index
        };
      }
      this.imgType = true;
    },
    //新消息title提示
    flashTitle(msg) {
      this.flashTitlePlayer.start(msg);
    },
    stopFlash() {
      this.flashTitlePlayer.stop();
    },
    updateDom() {
      this.$forceUpdate();
    },
    GetFocus() {
      window.addEventListener("paste", this.EventContedit, false);
      window.addEventListener("keydown", this.EventEnter, false);
      // window.addEventListener('keyup',this.EventAlt,false)
    },
    GetBlur() {
      window.removeEventListener("paste", this.EventContedit, false);
      window.removeEventListener("keydown", this.EventEnter, false);
      // window.removeEventListener('keyup',this.EventAlt,false)
      setTimeout(() => {
        this.AltData = [];
      }, 300);
    },
    //修改我在本团名称
    GetEditMyItemName() {
      this.myItemFlg = true;
      setTimeout(() => {
        this.$refs.editMyItemName.focus();
      }, 0);
    },
    GetEditMyItemNameT(alias, rg_num, num) {
      const that = this;
      that.myItemFlg = false;
      if ($.trim(alias) == "") {
        that.$message("不可为空！");
        that.itemSettingData.alias = that.old_name;
      } else {
        $.ajax({
          url: that.urlHost + "visitor/group/editalias",
          type: "post",
          data: {
            access_token: that.loginVisitor.access_token,
            alias,
            rg_num,
            num
          },
          typeData: "json",
          success: res => {
            if (res.success === "00000000") {
              that.GetGroupMmems(rg_num);
            } else {
              that.itemSettingData.alias = that.old_name;
              that.$base.err(res, that);
            }
          },
          error: err => {
            that.itemSettingData.alias = that.old_name;
          }
        });
      }
    },
    EventEnter(e) {
      const that = this;
      if (that.enterType == 1) {
        //ctrl+enter 发消息--enter换行
        if (e.ctrlKey && e.keyCode == 13) {
          that.send(0);
        }
      } else {
        //enter 发消息--ctrl+enter换行
        if (e.ctrlKey && e.keyCode == 13) {
          that.socketJson.obj.content += "\n";
          $(".contentedit").html($(".contentedit").html() + "<br/>");
          var range = window.getSelection(); //创建range
          range.selectAllChildren($(".contentedit")[0]); //range 选择obj下所有子内容
          range.collapseToEnd();
        } else if (e.keyCode == 13) {
          that.send(0);
          e.cancelBubble = true;
          e.preventDefault();
          e.stopPropagation();
        }
      }
    },
    //@监听
    EventAlt(e) {
      const that = this;
      let item = that.itemData;
      if (item.guide_flg > 0) {
        if (
          (e.shiftKey && e.keyCode == 50) ||
          (e.shiftKey && e.code == "Digit2")
        ) {
          that.GetAlt(item.rg_num);
        }
        if (e.key == "Backspace") {
          this.AltData = [];
        }
      }
    },
    //@列表
    GetAlt(rg_num) {
      const that = this;
      $.ajax({
        url: that.urlHost + "visitor/group/memaites",
        type: "post",
        data: {
          access_token: that.loginVisitor.access_token,
          rg_num: rg_num,
          page: 1,
          rows: 300
        },
        typeData: "json",
        success: res => {
          if (res.success === "00000000") {
            that.AltData = res.obj.data;
            that.AltData.unshift({ rv_name: "全部成员", rv_num: "-1" });
          } else {
            that.$base.err(res, that);
          }
        },
        error: err => {}
      });
    },
    AltBtn(data) {
      this.AltData = [];
      let flg = false;
      let dom = document.getElementById("contentedit").childNodes;
      let altDom = $(".contentedit input");
      this.socketJson.obj.content = this.socketJson.obj.content.replace(
        "@",
        ""
      );
      let reg = new RegExp("@", "");
      for (let i = 0; i < dom.length; i++) {
        if (dom[i].nodeValue != null) {
          dom[i].nodeValue = dom[i].nodeValue.replace(reg, "");
        }
      }
      for (let i = 0; i < altDom.length; i++) {
        if (data.rv_num == altDom.eq(i).attr("rv_num")) {
          flg = true;
        }
      }
      if (!flg) {
        $(".contentedit").append(
          '&nbsp;<input type="text" rv_num="' +
            data.rv_num +
            '" value="@' +
            data.rv_name +
            '" class="lengthd" title="' +
            data.rv_name +
            '" style="width:80px" disabled="disabled">&nbsp;'
        );
      }
    },
    //监听粘贴
    EventContedit(e) {
      const that = this;
      if (!(e.clipboardData && e.clipboardData.items)) {
        return;
      }
      for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
        var item = e.clipboardData.items[i];

        if (item.kind === "string") {
          item.getAsString(function(str) {
            // console.log(str);
          });
        } else if (item.kind === "file") {
          var f = item.getAsFile();
          that.sendImg1(f);
        }
      }
    },
    //监听滚动到最底部
    EventSessFn() {
      const that = this;
      if (
        that.$refs.sessView.scrollTop + that.$refs.sessView.offsetHeight >
        that.$refs.sessView.scrollHeight
      ) {
        that.GetSessions();
      }
    },
    EventswimTeamFn() {
      const that = this;
      if (
        that.$refs.swimTeamView.scrollTop +
          that.$refs.swimTeamView.offsetHeight >
        that.$refs.swimTeamView.scrollHeight
      ) {
        that.GetswimTeam();
      }
    },
    EventFirendFn() {
      const that = this;
      if (
        that.$refs.firendView.scrollTop + that.$refs.firendView.offsetHeight >
        that.$refs.firendView.scrollHeight
      ) {
        that.GetFirend();
      }
    },
    moveDiv(dom) {
      let _move = false; //移动标记
      let _x, _y; //鼠标离控件左上角的相对位置
      $("." + dom + " .el-dialog .top")
        .click(function() {})
        .mousedown(function(e) {
          _move = true;
          _x = e.pageX - parseInt($("." + dom + " .el-dialog").css("left"));
          _y = e.pageY - parseInt($("." + dom + " .el-dialog").css("top"));
          // $(".addTrip .el-dialog").fadeTo(20, 0.3); //点击后开始拖动并透明显示
        });
      $(document)
        .mousemove(function(e) {
          if (_move) {
            let x = e.pageX - _x; //移动时根据鼠标位置计算控件左上角的绝对位置
            let y = e.pageY - _y;
            $("." + dom + " .el-dialog").css({ top: y, left: x }); //控件新位置
          }
        })
        .mouseup(function() {
          _move = false;
          // $("." + dom + " .el-dialog").fadeTo("fast", 1); //松开鼠标后停止移动并恢复成不透明
        });
    },
    // 消息
    msgBtn() {
      this.navFlg = 0;
      this.GetSessions(1);
      if (this.$refs.swimTeamView != undefined) {
        this.$refs.swimTeamView.removeEventListener(
          "scroll",
          this.EventSessFn,
          false
        );
      }
    },
    //游团
    itemBtn() {
      this.navFlg = 1;
      this.GetswimTeam(1);
      if (this.$refs.sessView != undefined) {
        this.$refs.sessView.removeEventListener(
          "scroll",
          this.EventSessFn,
          false
        );
      }
    },
    //侗友
    firendBtn() {
      this.navFlg = 2;
      this.GetFirend(1);
      if (this.$refs.sessView != undefined) {
        this.$refs.sessView.removeEventListener(
          "scroll",
          this.EventSessFn,
          false
        );
      }
    },
    //新侗友
    newfirendBtn() {
      this.navFlg = 3;
      this.newFriendL = 0;
      this.GetNewFirend();
      if (this.$refs.sessView != undefined) {
        this.$refs.sessView.removeEventListener(
          "scroll",
          this.EventSessFn,
          false
        );
      }
    },
    //鼠标样式事件
    expressionover() {
      this.icon.expression = this.OSSIMG + "icon_expression_hover.png";
    },
    expressionout() {
      this.icon.expression = this.OSSIMG + "icon_expression_default.png";
    },
    expressionbtn() {
      this.icon.expression = this.OSSIMG + "icon_expression_click.png";
    },

    arrangementover() {
      this.icon.arrangement = this.OSSIMG + "icon_arrangement_hover.png";
    },
    arrangementout() {
      this.icon.arrangement = this.OSSIMG + "icon_arrangement_default.png";
    },
    arrangementbtn(itemData) {
      this.icon.arrangement = this.OSSIMG + "icon_arrangement_click.png";
      if (itemData.guide_flg != 2) {
        this.$message({
          message: "团员无法创建行程安排！",
          type: "warning",
          center: true
        });
      } else {
        this.dialogVisible.addTrip = true;
        // console.log(this.itemData.rg_num)
        this.addTripData.obj[this.$base.tampToTime(Date.now(), 2)] = [];
        for (let i = 0; i < 3; i++) {
          this.addTripData.obj[this.$base.tampToTime(Date.now(), 2)].push({
            title: "",
            content: "",
            date: "",
            end: 0,
            warn: 0,
            warn_flg: 0,
            nyr: this.$base.tampToTime(Date.now(), 2),
            time: ""
          });
        }
      }
    },

    noticeover() {
      this.icon.notice = this.OSSIMG + "icon_notice_hover.png";
    },
    noticeout() {
      this.icon.notice = this.OSSIMG + "icon_notice_default.png";
    },
    noticebtn(itemData) {
      this.icon.notice = this.OSSIMG + "icon_notice_click.png";
      if (itemData.guide_flg != 2) {
        this.$message({
          message: "团员无法创建通知！",
          type: "warning",
          center: true
        });
      } else {
        this.dialogVisible.addNotice = true;
      }
    },

    albumover() {
      this.icon.album = this.OSSIMG + "icon_album_hover.png";
    },
    albumout() {
      this.icon.album = this.OSSIMG + "icon_album_default.png";
    },
    albumbtn() {
      this.icon.album = this.OSSIMG + "icon_album_click.png";
      this.$refs.file.click();
    },

    filesover() {
      this.icon.files = this.OSSIMG + "icon_folder_hover.png";
    },
    filesout() {
      this.icon.files = this.OSSIMG + "icon_folder_default.png";
    },
    filesbtn() {
      this.icon.files = this.OSSIMG + "icon_folder_click.png";
      this.$refs.file1.click();
      // console.log(this.$refs)
    },

    messageover() {
      this.icon.message = this.OSSIMG + "icon_message_hover.png";
    },
    messageout() {
      this.icon.message = this.OSSIMG + "icon_message_default.png";
    },
    messagebtn() {
      this.icon.message = this.OSSIMG + "icon_message_click.png";
    },
    isToken(msg) {
      // console.log(msg.indexOf('TOKEN'))
      if (msg.indexOf("TOKEN") > -1) {
        localStorage.setItem("loginVisitor", "");
        this.$router.push({ path: "/" });
        return "登录超时，请重新登录！";
      } else {
        return msg;
      }
    },
    // websocket握手
    websocket() {
      const that = this;
      const url = this.wsUrl + "access_token=" + this.loginVisitor.access_token;
      this.ws = new WebSocket(url);
      this.ws.onopen = () => {
        // console.log('OK！')
        this.heartCheck.reset().start();
      };
      this.ws.onmessage = e => {
        let data = JSON.parse(e.data);
        let obj = data.obj;
        // console.log(data);
        if (data.code == "sk_200012") {
          //团禁言
          for (let i = 0; i < this.sessionsData.length; i++) {
            if (data.obj.rs_num === this.sessionsData[i].rs_num) {
              if (data.obj.operate == 1) {
                this.sessionsData[i].forbidden = 1;
              } else {
                this.sessionsData[i].forbidden = 0;
              }
            }
          }
        } else if (data.code === "sk_2000016") {
          //转让团
          for (let i = 0; i < this.sessionsData.length; i++) {
            if (data.obj.rs_num === this.sessionsData[i].rs_num) {
              this.sessionsData[i].guide_flg = data.obj.accept_guide_flg;
              data.prefix = data.prefix + "_RY";
              this.ws.send(JSON.stringify(data));
              this.sortSessions(data);
              this.say();
            }
          }
        } else if (data.code === "sk_200019") {
          //修改团名
          for (let i = 0; i < this.sessionsData.length; i++) {
            if (data.obj.rs_num === this.sessionsData[i].rs_num) {
              this.sessionsData[i].name = data.obj.rg_name;
              data.prefix = data.prefix + "_RY";
              this.ws.send(JSON.stringify(data));
              this.sortSessions(data);
              this.say();
            }
          }
        }
        if (data.code == "sk_000003") {
          this.disconnect();
          this.$message({
            message: "你的账号在其它地方登陆！",
            type: "error",
            center: true
          });
          localStorage.setItem("loginVisitor", "");
          this.$router.push({ path: "/" });
        } else if (data.code == "sk_000006") {
          //添加好友
          if (this.navFlg != 3) {
            this.newFriendL++;
          }
          this.GetNewFirend();
          this.GetSessions(1);
        } else if (data.code == "sk_000007") {
          //被添加好友
          this.GetNewFirend();
          this.GetSessions(1);
        } else if (data.code === "sk_000008") {
          //被好友删除
          for (let i = 0; i < this.sessionsData.length; i++) {
            if (data.obj.rs_num === this.sessionsData[i].rs_num) {
              this.sessionsData.splice(i, 1);
              this.newMsgLength[data.obj.accept_num][data.obj.rs_num] = 0;
              if (this.rs_numCli === data.obj.rs_num) {
                this.chatType = false;
              }
            }
          }
        } else if (data.code == "sk_000012") {
          //拉好友进团
          this.GetSessions(1);
        } else if (data.code == "sk_000013" || data.code == "sk_000018") {
          //被提出团 解散团
          this.newMsgLength[this.loginVisitor.access_num][obj.rs_num] = 0;
          localStorage.setItem("newMsgL", JSON.stringify(this.newMsgLength));
          this.GetSessions(1);
        } else if (data != "") {
          if (data.obj != null) {
            if (obj.rs_num != null) {
              // console.log(JSON.stringify(data.plat))
              if (data.plat == null) {
                if (this.ind == obj.rs_num) {
                  this.chatType = false;
                }
              } else if (data.obj.own_num == that.baseinfo.access_num) {
                if (JSON.stringify(data.plat) == "{}") {
                  that.GetlocaAllMsg(obj.rs_num, obj.rsm_num, data);
                } else {
                  for (let i in that.showDemo[obj.rs_num]) {
                    if (that.showDemo[obj.rs_num][i].plat != null) {
                      if (
                        data.plat.uniqueness_num ==
                        that.showDemo[obj.rs_num][i].plat.uniqueness_num
                      ) {
                        //发送成功返回后改变状态
                        data.plat.send_type = 1;
                        that.showDemo[obj.rs_num][i] = data;
                        that.showDemo[obj.rs_num].splice(i, 1);
                        localStorage.setItem(
                          "locaShowDom",
                          JSON.stringify(that.showDemo)
                        );
                        // that.GetlocaAllMsg(obj.rs_num, obj.rsm_num, data)
                      }
                    }
                  }
                  that.GetlocaAllMsg(obj.rs_num, obj.rsm_num, data);
                }
                // console.log(that.showDemo[obj.rs_num])
              } else if (data.prefix.indexOf("_RY") == 1) {
              } else {
                //收到消息
                if (
                  this.newMsgLength[this.loginVisitor.access_num] == undefined
                ) {
                  this.newMsgLength[this.loginVisitor.access_num] = {};
                }
                if (
                  this.newMsgLength[this.loginVisitor.access_num][obj.rs_num] ==
                  undefined
                ) {
                  this.newMsgLength[this.loginVisitor.access_num][
                    obj.rs_num
                  ] = 0;
                }
                if (this.ind != obj.rs_num) {
                  this.newMessageAudio();
                  this.newMsgLength[this.loginVisitor.access_num][obj.rs_num]++;
                  if (obj.aites != "") {
                    var list = JSON.parse(
                      obj.aites.substr(1, obj.aites.length - 2)
                    );
                    // console.log(list)
                    for (let i = 0; i < list.length; i++) {
                      if (
                        list[i].rv_num == "-1" ||
                        list[i].rv_num == this.loginVisitor.access_num
                      ) {
                        this.alt[obj.rs_num] = true;
                      }
                    }
                  }
                  that.GetSessions(1);
                  localStorage.setItem(
                    "newMsgL",
                    JSON.stringify(this.newMsgLength)
                  );
                  // localStorage.setItem('alt',JSON.stringify(this.alt))
                }
                // this.messages_data(obj.rs_num,data,0);
                this.GetlocaAllMsg(obj.rs_num, obj.rsm_num, data);
              }

              data.prefix = data.prefix + "_RY";
              this.ws.send(JSON.stringify(data));
              this.sortSessions(data);
              this.say();
              setTimeout(() => {
                //监听20秒后无回复，变为发送失败
                for (let i = 0; i < that.showDemo[obj.rs_num].length; i++) {
                  if (that.showDemo[obj.rs_num][i].plat != null) {
                    if (that.showDemo[obj.rs_num][i].plat.send_type == 0) {
                      that.showDemo[obj.rs_num][i].plat.send_type = -1;
                    }
                  }
                }
                localStorage.setItem(
                  "locaShowDom",
                  JSON.stringify(that.showDemo)
                );
              }, 20000);
              this.newlengthS++;
            }
          }
        }
      };
      this.ws.onclose = e => {
        // console.log(e);
        this.disconnect();
        if (e.code != 1011 && e.code != 1000 && e.code != 200) {
          setTimeout(() => {
            that.websocket();
          }, 5000);
        }
      };
    },
    //关闭
    disconnect() {
      // console.log('已关闭')
      if (this.ws != null) {
        this.ws.close();
        this.ws = null;
      }
    },
    //失败消息重发或删除
    resDel(data, rs_num, index) {
      const that = this;
      // console.log(data)
      let sendData = data[rs_num][index];
      that
        .$confirm("删除还是重新发送？", "提示", {
          confirmButtonText: "删除",
          cancelButtonText: "重发"
        })
        .then(() => {
          data[rs_num].splice(index, 1);
          // console.log(data)
          localStorage.setItem("locaShowDom", JSON.stringify(data));
        })
        .catch(err => {
          data[rs_num].splice(index, 1);
          localStorage.setItem("locaShowDom", JSON.stringify(data));
          sendData.plat.uniqueness_num = "web_" + that.$base.createRandomId();
          sendData.plat.send_type = 0;
          try {
            if (that.ws.readyState == 1) {
              that.GetlocaShowDom(rs_num, sendData);
              that.ws.send(JSON.stringify(sendData));
            } else {
              sendData.plat.send_type = -1;
              that.GetlocaShowDom(rs_num, sendData);
            }
          } catch (e) {
            sendData.plat.send_type = -1;
            that.GetlocaShowDom(rs_num, sendData);
          }
        });
    },
    //消息列表
    GetSessions(page) {
      const that = this;
      that.listsearch = false;
      if (page == undefined) {
        this.sessionsPage++;
      } else {
        this.sessionsPage = 1;
        if (that.$refs.sessView != undefined) {
          that.$refs.sessView.scrollTop = 0;
        }
      }
      $.ajax({
        url: this.urlHost + "visitor/sessions",
        type: "post",
        data: {
          access_token: this.loginVisitor.access_token,
          page: this.sessionsPage,
          rows: 10
        },
        dataType: "json",
        success: res => {
          that.loadingDiv = false;
          that.listsearch = true;
          if (res.success === "00000000") {
            if (res.obj.data.length > 0) {
              if (page == 1) {
                this.sessionsData = res.obj.data;
                this.sessionsData = this.$base.sessUniq(this.sessionsData);
                this.sessionsData = this.sessionsData.sort(function(a, b) {
                  if (b.rs_sort == a.rs_sort) {
                    return b.create_date - a.create_date;
                  } else {
                    return b.rs_sort - a.rs_sort;
                  }
                });
              } else {
                for (let i = 0; i < res.obj.data.length; i++) {
                  this.sessionsData.push(res.obj.data[i]);
                }
                this.sessionsData = this.$base.sessUniq(this.sessionsData);
                this.sessionsData = this.sessionsData.sort(function(a, b) {
                  if (b.rs_sort == a.rs_sort) {
                    return b.create_date - a.create_date;
                  } else {
                    return b.rs_sort - a.rs_sort;
                  }
                });
                that.$refs.sessView.removeEventListener(
                  "scroll",
                  that.EventSessFn,
                  false
                );
              }
              try {
                that.$refs.sessView.addEventListener(
                  "scroll",
                  that.EventSessFn,
                  false
                );
              } catch (e) {}
            } else {
              this.$refs.sessView.removeEventListener(
                "scroll",
                this.EventSessFn,
                false
              );
            }
            let newsLength = JSON.parse(localStorage.getItem("newMsgL"));
            if (newsLength != null) {
              this.newMsgLength = JSON.parse(localStorage.getItem("newMsgL"));
            }
            // this.showDemo = JSON.parse(localStorage.getItem('locaShowDom'))
            if (
              this.newMsgLength[this.loginVisitor.access_num] == null ||
              this.newMsgLength[this.loginVisitor.access_num] == undefined
            ) {
              this.newMsgLength[this.loginVisitor.access_num] = {};
            }
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          this.loadingDiv = false;
        }
      });
    },
    //收发消息更新时间
    sortSessions(data) {
      for (let i in this.sessionsData) {
        if (data.obj.rs_num == this.sessionsData[i].rs_num) {
          this.sessionsData[i].create_date = data.date;
        }
      }
      this.sessionsData = this.sessionsData.sort(function(a, b) {
        if (b.rs_sort == a.rs_sort) {
          return b.create_date - a.create_date;
        } else {
          return b.rs_sort - a.rs_sort;
        }
      });
      let newsLength = JSON.parse(localStorage.getItem("newMsgL"));
      if (newsLength != null) {
        this.newMsgLength = JSON.parse(localStorage.getItem("newMsgL"));
      }
    },
    // 游团列表
    GetswimTeam(page) {
      const that = this;
      that.listsearch = false;
      if (page == undefined) {
        that.swimTeamPage++;
      } else {
        that.swimTeamPage = 1;
        if (that.$refs.swimTeamView != undefined) {
          that.$refs.swimTeamView.scrollTop = 0;
        }
      }
      $.ajax({
        url: that.urlHost + "visitor/groups",
        type: "post",
        data: {
          access_token: that.loginVisitor.access_token,
          page: that.swimTeamPage,
          rows: 10
        },
        dataType: "json",
        success: res => {
          that.listsearch = true;
          if (res.success === "00000000") {
            if (res.obj.data.length > 0) {
              if (page == 1) {
                that.swimTeamData = res.obj.data;
              } else {
                for (let i = 0; i < res.obj.data.length; i++) {
                  this.swimTeamData.push(res.obj.data[i]);
                }
                that.$refs.swimTeamView.removeEventListener(
                  "scroll",
                  that.EventswimTeamFn,
                  false
                );
              }
              try {
                that.$refs.swimTeamView.addEventListener(
                  "scroll",
                  that.EventswimTeamFn,
                  false
                );
              } catch (e) {}
            } else {
              that.$refs.swimTeamView.removeEventListener(
                "scroll",
                that.EventswimTeamFn,
                false
              );
            }
          } else {
            that.$base.err(res, that);
          }
        },
        error: err => {
          that.listsearch = true;
        }
      });
    },
    //侗友列表
    GetFirend(page) {
      const that = this;
      that.listsearch = false;
      that.listsearch = false;
      if (page == undefined) {
        that.firendPage++;
      } else {
        that.firendPage = 1;
        if (that.$refs.firendView != undefined) {
          that.$refs.firendView.scrollTop = 0;
        }
      }
      $.ajax({
        url: that.urlHost + "visitor/friends",
        type: "post",
        data: {
          access_token: that.loginVisitor.access_token,
          page: that.firendPage,
          rows: 10
        },
        dataType: "json",
        success: res => {
          that.listsearch = true;
          if (res.success === "00000000") {
            if (res.obj.data == null) {
              that.$refs.firendView.removeEventListener(
                "scroll",
                that.EventFirendFn,
                false
              );
              return;
            } else {
              if (page == 1) {
                that.firendData = res.obj.data;
              } else {
                for (let i = 0; i < res.obj.data.length; i++) {
                  that.firendData.push(res.obj.data[i]);
                }
                that.$refs.firendView.removeEventListener(
                  "scroll",
                  that.EventFirendFn,
                  false
                );
              }
              try {
                that.$refs.firendView.addEventListener(
                  "scroll",
                  that.EventFirendFn,
                  false
                );
              } catch (e) {}
            }
          } else {
            that.listsearch = true;
            that.$base.err(res, that);
          }
        },
        error: err => {}
      });
    },
    //新侗友
    GetNewFirend() {
      this.listsearch = false;
      $.ajax({
        url: this.urlHost + "visitor/applybean",
        type: "post",
        data: {
          access_token: this.loginVisitor.access_token,
          page: 1,
          rows: 1000
        },
        dataType: "json",
        success: res => {
          this.listsearch = true;
          if (res.success === "00000000") {
            this.newsFriend = res.obj;
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          this.listsearch = true;
        }
      });
    },
    //添加侗友请求处理
    GetApplyhandle(id, type) {
      $.ajax({
        url: this.urlHost + "visitor/applyhandle",
        type: "post",
        data: {
          access_token: this.loginVisitor.access_token,
          id: id,
          status: type
        },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            this.$message({
              message: "处理成功！",
              type: "success",
              center: true
            });
            this.GetNewFirend();
            this.GetSessions(1);
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          // console.log(err);
        }
      });
    },
    // 清空已处理消息
    GetNewFirendClear() {
      $.ajax({
        url: this.urlHost + "visitor/friend/applydels",
        type: "post",
        data: { access_token: this.loginVisitor.access_token },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            this.$message({
              message: "已清空！",
              type: "success",
              center: true
            });
            this.GetNewFirend();
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          // console.log(err);
        }
      });
    },
    //搜索获取焦点
    searchFocus() {
      this.searchType = true;
    },
    //失去焦点
    searchBlur() {
      setTimeout(() => {
        this.searchType = false;
        this.searchData = "";
      }, 200);
    },
    //搜索全部
    GetAllSearch(search) {
      this.listsearch = false;
      $.ajax({
        url: this.urlHost + "visitor/friends",
        type: "post",
        data: {
          access_token: this.loginVisitor.access_token,
          search: search,
          page: 1,
          rows: 1000
        },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            console.log(this.searchData);
            if (this.searchData.trim() != "") {
              if (res.obj.data) {
                this.searchdataInfo = res.obj.data;
              } else {
                this.searchdataInfo = [];
              }
            }
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          // console.log(err);
        }
      });
      $.ajax({
        url: this.urlHost + "visitor/groups",
        type: "post",
        data: {
          access_token: this.loginVisitor.access_token,
          search: search,
          page: 1,
          rows: 1000
        },
        dataType: "json",
        success: res => {
          this.listsearch = true;
          if (res.success === "00000000") {
            this.searchItemInfo = res.obj.data;
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          this.listsearch = true;
        }
      });
    },
    //创建游团
    createItemBtn() {
      // console.log(this.createData.addItem.content)
      if ($.trim(this.createData.addItem.content) == "") {
        this.$message({
          message: "团名不可为空！",
          type: "error",
          center: true
        });
      } else {
        $.ajax({
          url: this.urlHost + "visitor/groupnew",
          type: "post",
          data: {
            access_token: this.loginVisitor.access_token,
            name: this.createData.addItem.content,
            group_type: 0
          },
          dataType: "json",
          success: res => {
            if (res.success === "00000000") {
              this.$message({
                message: "创建成功！",
                type: "success",
                center: true
              });
              this.GetSessions(1);
              this.GetswimTeam(1);
              this.createData.addItem.content = "";
              this.createData.addItem.type = false;
              // console.log(this.sessionsData)
              // console.log(res.obj.def_session.rs_id)
              setTimeout(() => {
                for (let i = 0; i < this.sessionsData.length; i++) {
                  if (res.obj.def_session.rs_id == this.sessionsData[i].rs_id) {
                    this.chatBtn(this.sessionsData, i);
                  }
                }
              }, 500);
            } else {
              this.$base.err(res, this);
            }
          },
          error: err => {
            // console.log(err);
          }
        });
      }
    },
    //搜索侗友
    GetAddFirendSearch(search) {
      $.ajax({
        url: this.urlHost + "visitor/friend/search",
        type: "post",
        data: {
          access_token: this.loginVisitor.access_token,
          search: search,
          page: 1,
          rows: 1000
        },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            this.createData.addFirend.list = res.obj.data;
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          // console.log(err);
        }
      });
    },
    //添加侗友
    GetAddFriend(num, data, index) {
      this.$prompt("", "验证消息", {
        confirmButtonText: "发送",
        cancelButtonText: "取消"
      })
        .then(val => {
          $.ajax({
            url: this.urlHost + "visitor/addfriend",
            type: "post",
            data: { access_token: this.loginVisitor.access_token, num: num },
            dataType: "json",
            success: res => {
              if (res.success === "00000000") {
                this.$message({
                  message: "已申请",
                  type: "success",
                  center: true
                });
                this.GetNewFirend();
                data.splice(index, 1);
              } else {
                this.$base.err(res, this);
              }
            },
            error: err => {
              // console.log(err);
            }
          });
        })
        .catch(() => {});
    },
    // 会话信息
    GetSessionInfo(rs_num, num) {
      $.ajax({
        url: this.urlHost + "visitor/session",
        type: "post",
        data: { access_token: this.loginVisitor.access_token, rs_num: rs_num },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            this.itemDataInfo = res.obj;
            // console.log(res.obj)
            if (res.obj.rg_num != null) {
              //团成员列表信息
              this.GetGroupMmems(res.obj.rg_num);
              //团设置信息
              this.GetGroupSetting(res.obj.rg_num);
              //团信息
              this.GetGroupInfo(res.obj.rg_num);
            } else {
              //好友个人信息
              // this.GetFriendInfo(res.obj.num);
            }
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          // console.log(err);
        }
      });
    },
    // 好友信息
    GetFriendInfo(num) {
      if (num !== this.sheNum) {
        this.propData = "";
      }
      this.sheNum = num;
      this.dialogVisible.firendInfo = true;
      $.ajax({
        url: this.urlHost + "visitor/friend/info",
        type: "post",
        data: { access_token: this.loginVisitor.access_token, num: num },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            this.propData = res.obj;
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {}
      });
    },
    //团信息
    GetGroupInfo(rg_num) {
      $.ajax({
        url: this.urlHost + "visitor/group/info",
        type: "post",
        data: { access_token: this.loginVisitor.access_token, rg_num: rg_num },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            this.groupInfo = res.obj;
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {}
      });
    },
    //成员信息
    GetGroupMmems(rg_num) {
      $.ajax({
        url: this.urlHost + "visitor/group/mems",
        type: "post",
        data: { access_token: this.loginVisitor.access_token, rg_num: rg_num },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            this.memsData = res.obj;
            this.memsLength = this.memsData.visitor_beans.length + 1;
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {}
      });
    },
    //团设置信息
    GetGroupSetting(rg_num) {
      $.ajax({
        url: this.urlHost + "visitor/group/setting",
        type: "post",
        data: { access_token: this.loginVisitor.access_token, rg_num: rg_num },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            this.itemSettingData = res.obj;
            if (this.itemSettingData.disturb == 1) {
              this.disturb = true;
            } else {
              this.disturb = false;
            }
            // console.log(this.disturb)
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          // console.log(err);
        }
      });
    },
    //拉侗友进团
    GetItemInfoAdd(rg_num, num) {
      $.ajax({
        url: this.urlHost + "visitor/pull/group",
        type: "post",
        data: {
          access_token: this.loginVisitor.access_token,
          rg_num: rg_num,
          num: num
        },
        dataType: "json",
        success: res => {
          if (res.success == "00000000") {
            if (res.obj != null) {
              this.$message({
                message: "已添加",
                type: "success",
                center: true
              });
              this.GetGfriends(rg_num);
              this.GetGroupMmems(this.itemData.rg_num);
            } else {
              this.$message({
                message: "已发出邀请",
                type: "success",
                center: true
              });
            }
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          // console.log(err);
        }
      });
    },
    //可拉的侗友
    GetGfriends(rg_num) {
      $.ajax({
        url: this.urlHost + "visitor/gfriends",
        type: "post",
        data: {
          access_token: this.loginVisitor.access_token,
          rg_num: rg_num,
          search: this.createData.addFirend.content,
          page: 1,
          rows: 1000
        },
        dataType: "json",
        success: res => {
          if (res.success == "00000000") {
            this.gfriends = res.obj.data;
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          console.log(err);
        }
      });
    },
    //消息免打扰
    disturbBtn() {
      let rg_num = this.itemSettingData.rg_num;
      let type = 0;
      if (this.itemSettingData.disturb == true) {
        type = 0;
      } else {
        type = 1;
      }

      $.ajax({
        url: this.urlHost + "visitor/group/disturb",
        type: "post",
        data: {
          access_token: this.loginVisitor.access_token,
          rg_num: rg_num,
          disturb: type
        },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            if (type == 0) {
              this.itemSettingData.disturb = 1;
            } else {
              this.itemSettingData.disturb = 0;
            }
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          console.log(err);
        }
      });
    },
    //置顶
    listTop(data) {
      //0->取消置顶   1->置顶
      if (data.rs_sort == 0) {
        var flg = 1;
      } else {
        var flg = 0;
      }
      $.ajax({
        url: this.urlHost + "visitor/session/top",
        type: "post",
        data: {
          access_token: this.loginVisitor.access_token,
          rs_num: data.rs_num,
          flg: flg
        },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            // console.log(this.sessionsData)
            for (let i = 0; i < this.sessionsData.length; i++) {
              if (data.rs_num === this.sessionsData[i].rs_num) {
                this.sessionsData[i].rs_sort = flg;
                this.itemDataInfo.rs_sort = flg;
              }
            }
            this.sessionsData = this.sessionsData.sort(function(a, b) {
              if (b.rs_sort == a.rs_sort) {
                return b.create_date - a.create_date;
              } else {
                return b.rs_sort - a.rs_sort;
              }
            });
            // this.GetSessions()  //更新会话列表
            // this.GetSessionInfo(data.rs_num,data.num)   //更新会话信息
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          console.log(err);
        }
      });
    },
    //解散团
    listItemDel(rg_num) {
      this.$confirm("确认是否删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          $.ajax({
            url: this.urlHost + "visitor/group/dismiss",
            type: "post",
            data: {
              access_token: this.loginVisitor.access_token,
              rg_num: rg_num
            },
            dataType: "json",
            success: res => {
              if (res.success === "00000000") {
                this.$message({
                  message: "已删除！",
                  type: "success",
                  center: true
                });
                // this.GetSessions()
                this.GetswimTeam(1); //游团
                for (let i = 0; i < this.sessionsData.length; i++) {
                  if (rg_num === this.sessionsData[i].rg_num) {
                    this.sessionsData.splice(i, 1);
                  }
                }
                this.chatType = false;
                this.dialogVisible.itemInfo = false;
              } else {
                this.$base.err(res, this);
              }
            },
            error: err => {
              console.log(err);
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    //退出团、踢人出团
    RemoveFirend(rg_num, num, type, flg) {
      this.$confirm("确认是否移出本团？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          $.ajax({
            url: this.urlHost + "visitor/del/groupmem",
            type: "post",
            data: {
              access_token: this.loginVisitor.access_token,
              rg_num: rg_num,
              num: num
            },
            dataType: "json",
            success: res => {
              if (res.success === "00000000") {
                this.$message({
                  message: "操作成功！",
                  type: "success",
                  center: true
                });
                if (type == 0) {
                  this.chatType = false;
                  for (let i = 0; i < this.sessionsData.length; i++) {
                    if (rg_num === this.sessionsData[i].rg_num) {
                      this.sessionsData.splice(i, 1);
                    }
                  }
                }
                if (flg == 1) {
                  this.dialogVisible.itemInfo = false;
                }
                this.GetSessions(1);
                this.GetGroupMmems(this.itemData.rg_num);
              } else {
                this.$base.err(res, this);
              }
            },
            error: err => {
              console.log(err);
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    //删除会话
    listDel(info) {
      // console.log(info)
      // this.$confirm('确认是否删除？','提示',{
      //     confirmButtonText: '确认',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      // }).then(()=> {
      $.ajax({
        url: this.urlHost + "visitor/session/del",
        type: "post",
        data: {
          access_token: this.loginVisitor.access_token,
          rs_num: info.rs_num,
          del: 1
        },
        dataType: "json",
        success: res => {
          // console.log(res)
          if (res.success === "00000000") {
            this.$message({
              message: "已删除！",
              type: "success",
              center: true
            });
            this.chatType = false;
            this.ind = "";
            for (let i = 0; i < this.sessionsData.length; i++) {
              if (info.rs_num === this.sessionsData[i].rs_num) {
                this.sessionsData.splice(i, 1);
              }
            }
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          console.log(err);
        }
      });
      // }).catch((err)=> {
      //     console.log(err)
      // })
    },
    //删除好友，团
    infoDel(info) {
      // console.log(info);
      // console.log(this.sessionsData);
      this.$confirm("确认是否删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          $.ajax({
            url: this.urlHost + "visitor/delfriend",
            type: "post",
            data: {
              access_token: this.loginVisitor.access_token,
              num: info.num
            },
            dataType: "json",
            success: res => {
              if (res.success === "00000000") {
                this.$message({
                  message: "已删除！",
                  type: "success",
                  center: true
                });
                this.chatType = false;
                this.dialogVisible.firendInfo = false;
                this.GetFirend(1);
                for (let i = 0; i < this.sessionsData.length; i++) {
                  if (info.num === this.sessionsData[i].num) {
                    this.sessionsData.splice(i, 1);
                  }
                }
              } else {
                this.$base.err(res, this);
              }
            },
            error: err => {
              console.log(err);
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    //清空聊天记录
    clearMsg(rs_num) {
      this.$confirm("确认是否清空？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "已清空",
            center: true
          });
          delete this.showDemo[rs_num];
          localStorage.setItem("locaShowDom", JSON.stringify(this.showDemo));
          // this.GetSessions(1);
          this.$forceUpdate();
          this.historyMsgType[rs_num] = 0;
          localStorage.setItem(
            "historyMsg",
            JSON.stringify(this.historyMsgType)
          );
        })
        .catch(() => {});
    },
    //点击列表开始聊天
    chatBtn(data, index) {
      const that = this;
      that.AltData = [];
      that.socketJson.obj.content = "";
      $(".contentedit").html("");
      let rs_num = data[index].rs_num;
      that.historyMsgType = JSON.parse(localStorage.getItem("historyMsg"));
      if (that.historyMsgType[rs_num] == undefined) {
        that.historyMsgType[rs_num] = 0;
      }
      if (that.historyMsgType[rs_num] == 0) {
        that.GetMsgs(rs_num);
      }
      // console.log(that.historyMsgType[rs_num])
      that.baseinfo = JSON.parse(localStorage.getItem("baseinfo"));
      that.chatType = true;
      that.rs_numCli = rs_num;
      that.ind = rs_num;
      that.itemData = data[index];
      //清空小红点
      that.newMsgLength[that.loginVisitor.access_num][rs_num] = 0;
      that.alt[rs_num] = false;
      that.say();
      localStorage.setItem("newMsgL", JSON.stringify(that.newMsgLength));
      if (that.itemData.guide_flg > 0) {
        that.socketJson.code = "sk_200000";
        that.socketJson.prefix = "SKG";
      } else {
        that.socketJson.code = "sk_100000";
        that.socketJson.prefix = "SKF";
      }
      that.socketJson.obj.rs_num = that.itemData.rs_num;
      if (that.viewBoxLength[rs_num] == undefined) {
        that.viewBoxLength[rs_num] = {};
        that.viewBoxLength[rs_num].leng = 1;
        that.viewBoxLength[rs_num].type = 1;
      }
      if (that.locaAllMsg[rs_num] == undefined) {
        that.locaAllMsg[rs_num] = {};
      }
      if (that.showDemo[rs_num] == undefined) {
        that.showDemo[rs_num] = [];
      }
      // console.log(that.$refs)
      if (that.$refs.viewBox != undefined) {
        that.$refs.viewBox.removeEventListener("scroll", that.EventFn, false);
      }
      setTimeout(() => {
        that.GetSessionInfo(rs_num, data[index].num);

        $(".contentedit").focus();
        that.scrollB();
        that.$refs.viewBox.addEventListener("scroll", that.EventFn, false);
      }, 0);
    },
    EventFn() {
      const that = this;
      let rs_num = that.rs_numCli;
      if (this.$refs.viewBox.scrollTop == 0) {
        const self = this;
        // console.log(that.viewBoxLength[rs_num])
        if (that.showDemo[rs_num] != undefined)
          if (
            that.viewBoxLength[rs_num].leng * 10 <
            that.showDemo[rs_num].length
          ) {
            // that.viewBoxLength[rs_num].type = 0
            that.$forceUpdate();
            that.$set(that.viewBoxLength[rs_num], "type", 0);
            that.GetMsgs(rs_num, that.showDemo[rs_num][0].obj.rsm_num);
            that.$refs.viewBox.removeEventListener(
              "scroll",
              that.EventFn,
              false
            );
            var oldHeight = that.$refs.viewBox.scrollHeight;
            setTimeout(() => {
              self.$refs.viewBox.scrollTop = 1;
            }, 0);
            // console.log(that.$refs.viewBox.scrollHeight)
            setTimeout(() => {
              that.viewBoxLength[rs_num].leng++;
              that.$forceUpdate();
              that.$set(that.viewBoxLength[rs_num], "type", 1);
              that.$refs.viewBox.addEventListener(
                "scroll",
                that.EventFn,
                false
              );
              setTimeout(() => {
                self.$refs.viewBox.scrollTop =
                  that.$refs.viewBox.scrollHeight - oldHeight + 50;
                // console.log(that.$refs.viewBox.scrollHeight-oldHeight)
              }, 0);
            }, 300);
            // localStorage.setItem('viewBoxLength',JSON.stringify(that.viewBoxLength))
          }
      }
    },
    loadingLength() {
      const that = this;
      let rs_num = that.rs_numCli;
      var oldHeight = that.$refs.viewBox.scrollHeight;
      that.$refs.viewBox.scrollTop = 1;
      that.$forceUpdate();
      that.$set(that.viewBoxLength[rs_num], "type", 0);
      that.GetMsgs(rs_num, that.showDemo[rs_num][0].obj.rsm_num);
      setTimeout(() => {
        that.viewBoxLength[rs_num].leng++;
        that.$forceUpdate();
        that.$set(that.viewBoxLength[rs_num], "type", 1);
        setTimeout(() => {
          that.$refs.viewBox.scrollTop =
            that.$refs.viewBox.scrollHeight - oldHeight + 50;
        }, 0);
      }, 300);
    },
    //滚动条至最下面
    scrollB() {
      if (typeof $(".msg-send-box")[0] != "undefined") {
        $(".msg-send-box")[0].scrollTop = $(".msg-send-box")[0].scrollHeight;
      }
    },
    // 发送消息
    send(T, name, size) {
      const that = this;
      let rs_num = this.socketJson.obj.rs_num;
      this.socketJson.obj.own_num = this.baseinfo.access_num;
      this.uniqueness_num = "web_" + this.$base.createRandomId();
      this.socketJson.plat.uniqueness_num = this.uniqueness_num;
      this.socketJson.plat.send_type = 0;
      this.socketJson.obj.type = T;
      // console.log(this.socketJson)
      //0>消息  1>图片  2>语音  3>视频    4>文件
      if (T == 0) {
        let dom = $(".contentedit img");
        let altDom = $(".contentedit input");
        let contedit = document.getElementById("contentedit").childNodes;

        var txt = "";
        var ty = "";
        var aites = [];
        for (let i = 0; i < contedit.length; i++) {
          // console.log(typeof contedit[i])
          // console.log(contedit[i].innerText)
          if (contedit[i].nodeValue != null) {
            ty = contedit[i].nodeValue;
          } else if (contedit[i].innerText != null) {
            ty = contedit[i].innerText + "\n";
          }
          txt += ty;
        }
        // console.log(txt)
        this.socketJson.obj.content = txt;

        if (this.socketJson.obj.content.length > 1000) {
          that.$message({
            message: "消息内容过多！（小于1000字）",
            type: "error",
            align: true
          });
        } else {
          if (dom.length > 0) {
            for (let i = 0; i < dom.length; i++) {
              let type = this.$base.createRandomId() + ".jpg";
              let conversions = this.$base.base64ToBlob(dom[i].src, type);
              // conversions.name = this.$base.createRandomId()+'.jpg'
              // console.log(conversions)

              $.ajax({
                url:
                  that.urlHost +
                  "/common/ali_sts?access_token=" +
                  that.loginVisitor.access_token,
                type: "get",
                data: "json",
                success: function(data) {
                  that.client = new OSS.Wrapper({
                    region: "oss-cn-beijing", //oss地址
                    accessKeyId: data.AccessKeyId, //ak
                    accessKeySecret: data.AccessKeySecret, //secret
                    stsToken: data.SecurityToken,
                    bucket: "anygo-imag"
                  });
                  let filesuff = conversions.name.split(".").splice(-1)[0];
                  //随机命名
                  // let creaName = that.$base.createRandomId();
                  that.client
                    .multipartUpload(
                      "message_imgs/" + conversions.name,
                      conversions
                    )
                    .then(function(result) {
                      let sendData = that.$base.objDeepCopy(that.socketJson);
                      sendData.obj = {
                        content: "",
                        own_num: that.baseinfo.access_num,
                        rs_num: that.socketJson.obj.rs_num,
                        type: 1,
                        url: conversions.name
                      };
                      sendData.plat.send_type = 0;
                      sendData.plat.uniqueness_num =
                        "web_" + that.$base.createRandomId();
                      // console.log(sendData)
                      // that.GetlocaShowDom(rs_num,sendData)
                      // that.ws.send(JSON.stringify(sendData))
                      // if(that.ws != null){
                      //     that.ws.send(JSON.stringify(sendData))
                      // }else{
                      //     sendData.plat.send_type = -1
                      //     that.GetlocaShowDom(rs_num,sendData)
                      // }
                      try {
                        if (that.ws.readyState == 1) {
                          that.GetlocaShowDom(rs_num, sendData);
                          that.ws.send(JSON.stringify(sendData));
                        } else {
                          sendData.plat.send_type = -1;
                          that.GetlocaShowDom(rs_num, sendData);
                        }
                      } catch (e) {
                        sendData.plat.send_type = -1;
                        that.GetlocaShowDom(rs_num, sendData);
                      }
                    })
                    .catch(function(err) {
                      console.log(err);
                    });
                },
                error: function(err) {
                  console.log(err);
                }
              });
            }
            setTimeout(() => {
              $(".contentedit").html("");
            }, 5);
          }
          if (altDom.length > 0) {
            var txt = "";
            var ty = "";
            var aites = [];
            for (let i = 0; i < contedit.length; i++) {
              // console.log(typeof contedit[i])

              if (contedit[i].nodeValue != null) {
                ty = contedit[i].nodeValue;
              } else {
                ty = $(contedit[i]).val() + " ";
                // console.log(contedit[i])
              }
              txt += ty;
            }
            // console.log(txt)
            this.socketJson.obj.content = txt;
            for (let i = 0; i < altDom.length; i++) {
              // console.log(altDom.eq(i).attr('rv_num'))
              if (altDom.eq(i).attr("rv_num") == "-1") {
                aites.push({ rv_num: altDom.eq(i).attr("rv_num") });
                break;
              }
              aites.push({ rv_num: altDom.eq(i).attr("rv_num") });
            }
            this.socketJson.obj.aites = JSON.stringify(aites);
          }
          if ($.trim(this.socketJson.obj.content) == "") {
            this.socketJson.obj.content = "";
            $(".contentedit").html("");
            // this.$message('不能发送空白消息')
          } else {
            this.socketJson.obj.url = null;
            let sendData = this.$base.objDeepCopy(this.socketJson);
            // console.log(sendData)
            this.$forceUpdate();
            this.socketJson.obj.content = "";
            $(".contentedit").html("");
            // console.log(this.ws)
            try {
              if (this.ws.readyState == 1) {
                this.GetlocaShowDom(rs_num, sendData);
                this.ws.send(JSON.stringify(sendData));
              } else {
                sendData.plat.send_type = -1;
                this.GetlocaShowDom(rs_num, sendData);
              }
            } catch (e) {
              sendData.plat.send_type = -1;
              this.GetlocaShowDom(rs_num, sendData);
            }
            this.scrollB();
          }
        }
      } else if (T == 1) {
        let sendData = this.$base.objDeepCopy(this.socketJson);
        // sendData.obj.content = ''
        this.GetlocaShowDom(rs_num, sendData);
        this.ws.send(JSON.stringify(sendData));
      } else if (T == 2) {
      } else if (T == 3) {
      } else if (T == 4) {
        let sendData = this.$base.objDeepCopy(this.socketJson);
        sendData.obj.content = "";
        sendData.plat.file_name = name;
        sendData.plat.file_size = size;
        sendData.plat.send_type = 0;
        try {
          if (that.ws.readyState == 1) {
            that.GetlocaShowDom(rs_num, sendData);
            that.ws.send(JSON.stringify(sendData));
          } else {
            sendData.plat.send_type = -1;
            that.GetlocaShowDom(rs_num, sendData);
          }
        } catch (e) {
          sendData.plat.send_type = -1;
          that.GetlocaShowDom(rs_num, sendData);
        }
      }
    },
    //截图粘贴
    sendImg1(arr) {
      const that = this;
      if (!that.$base.isIE()) {
        if (!this.isContain(arr)) {
          const item = {
            name: arr.name,
            size: arr.size,
            file: arr
          };
          this.html5Reader(arr, item);
          this.addIMGData.files.push(item);
        }
      }
    },
    //发送图片
    sendImg() {
      const that = this;
      let imgs = that.$refs.file.files;
      let imgLen = 0;
      let loadLen = 0;
      for (let i = 0; i < imgs.length; i++) {
        $.ajax({
          url:
            that.urlHost +
            "/common/ali_sts?access_token=" +
            that.loginVisitor.access_token,
          type: "get",
          data: "json",
          success: function(data) {
            that.client = new OSS.Wrapper({
              region: "oss-cn-beijing", //oss地址
              accessKeyId: data.AccessKeyId, //ak
              accessKeySecret: data.AccessKeySecret, //secret
              stsToken: data.SecurityToken,
              bucket: "anygo-imag"
            });
            let filesuff = imgs[i].name.split(".").splice(-1)[0];
            //随机命名
            let creaName = that.$base.createRandomId();
            loadLen++;
            that.client
              .multipartUpload(
                "message_imgs/" + creaName + "." + filesuff,
                imgs[i]
              )
              .then(function(result) {
                that.socketJson.obj.url = creaName + "." + filesuff;
                that.send(1);
                imgLen++;
                if (imgLen == loadLen) {
                  $(".imgval").val("");
                }
              })
              .catch(function(err) {
                console.log(err);
              });
          },
          error: function(err) {
            console.log(err);
          }
        });
      }
      this.$forceUpdate();
    },
    //发送文件
    sendFile() {
      const that = this;
      let _files = that.$refs.file1.files;
      let imgLen = 0;
      let loadLen = 0;
      for (let i = 0; i < _files.length; i++) {
        let file_name = _files[i].name;
        let file_size = Math.round(_files[i].size / 1000) + "kb";
        let suff = file_name.substr(
          file_name.lastIndexOf(".") + 1,
          file_name.length
        );
        if (
          suff == "doc" ||
          suff == "DOC" ||
          suff == "docx" ||
          suff == "DOCX" ||
          suff == "pdf" ||
          suff == "PDF" ||
          suff == "xlsx" ||
          suff == "xls" ||
          suff == "XLS" ||
          suff == "ppt" ||
          suff == "PPT" ||
          suff == "pptx" ||
          suff == "PPTX"
        ) {
          $.ajax({
            url:
              that.urlHost +
              "/common/ali_sts?access_token=" +
              that.loginVisitor.access_token,
            type: "get",
            data: "json",
            success: function(data) {
              that.client = new OSS.Wrapper({
                region: "oss-cn-beijing", //oss地址
                accessKeyId: data.AccessKeyId, //ak
                accessKeySecret: data.AccessKeySecret, //secret
                stsToken: data.SecurityToken,
                bucket: "anygo-imag"
              });
              let filesuff = _files[i].name.split(".").splice(-1)[0];
              //随机命名
              let creaName = that.$base.createRandomId();
              loadLen++;
              that.client
                .multipartUpload("files/" + file_name, _files[i])
                .then(function(result) {
                  that.socketJson.obj.url = file_name;
                  that.send(4, file_name, file_size);
                  imgLen++;
                  if (imgLen == loadLen) {
                    $(".fileval").val("");
                  }
                })
                .catch(function(err) {
                  console.log(err);
                });
            },
            error: function(err) {
              console.log(err);
            }
          });
        } else {
          that.$message.warning("请选择正确格式的文件(doc、xls、ppt、pdf)");
        }
      }
    },
    //新消息声音
    newMessageAudio() {
      const that = this;
      let audio = new Audio(that.newMessage);
      audio.play();
    },
    //语音播放
    audioBtn(url, index) {
      // console.log(url+'~~~~'+index)
      const that = this;
      if (that.currentAudio == undefined) {
        that.currentAudio = new Audio(url);
        that.currentAudio.play();
        that.audioInt = index;
        that.currentAudio.addEventListener(
          "ended",
          function() {
            that.audioInt = -1;
          },
          false
        );
      } else {
        if (that.currentAudio.src == url) {
          if (that.currentAudio.paused) {
            that.audioInt = index;
            that.currentAudio.play();
          } else {
            that.audioInt = -1;
            that.currentAudio.pause();
            that.currentAudio = undefined;
          }
        } else {
          that.audioInt = -1;
          that.currentAudio.pause();
          that.currentAudio = undefined;
          that.currentAudio = new Audio(url);
          that.currentAudio.play();
          that.audioInt = index;
          that.currentAudio.addEventListener(
            "ended",
            function() {
              that.audioInt = -1;
            },
            false
          );
        }
      }
    },
    //添加表情
    addExpress(index) {
      // $('.contentedit').html(this.socketJson.obj.content+this.iconEx[index])
      $(".contentedit").append(this.iconEx[index]);
      // this.socketJson.obj.content = this.socketJson.obj.content+this.iconEx[index]
    },
    //修改日期
    changeTripDate(obj, date) {
      this.proList.push(1);
      if (obj[date] == undefined) {
        obj[date] = [];
        for (let i = 0; i < 3; i++) {
          obj[date].push({
            title: "",
            content: "",
            date: "",
            end: 0,
            warn: 0,
            warn_flg: 0,
            nyr: date,
            time: ""
          });
        }
        console.log(obj);
        this.$forceUpdate();
      }
    },
    closeAddInput(date, index) {
      date[index].date = "";
      date.splice(index, 1);
      this.$forceUpdate();
    },
    //行程列表（团内）
    GetListTrip(rg_num) {
      if (rg_num != this.listTripData.rg_num) {
        this.listTripData = "";
      }
      $.ajax({
        url: this.urlHost + "visitor/group/routedists",
        type: "post",
        data: {
          access_token: this.loginVisitor.access_token,
          rg_num: rg_num,
          page: 1,
          rows: 1000
        },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            this.listTripData = res.obj;
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          console.log(err);
        }
      });
    },
    //游团通知列表（团内）
    GetListNotice(rg_num) {
      this.dialogVisible.listNotice = true;
      if (rg_num != this.listNoticeData.rg_num) {
        this.listNoticeData = "";
      }
      $.ajax({
        url: this.urlHost + "visitor/group/notes",
        type: "post",
        data: {
          access_token: this.loginVisitor.access_token,
          rg_num: rg_num,
          page: 1,
          rows: 1000
        },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            this.listNoticeData = res.obj;
            // console.log(this.listNoticeData)
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          console.log(err);
        }
      });
    },
    //删除行程安排
    GetDelTrip(rgm_num, rg_num) {
      console.log(rgm_num);
      this.$confirm("确认是否删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          $.ajax({
            url: this.urlHost + "visitor/routedist/del",
            type: "post",
            data: {
              access_token: this.loginVisitor.access_token,
              rgm_num: rgm_num
            },
            dataType: "json",
            success: res => {
              if (res.success === "00000000") {
                this.$message({
                  message: "已删除！",
                  type: "success",
                  center: true
                });
                this.GetListTrip(rg_num);
                // this.dialogVisible.listTrip = true;
                setTimeout(() => {
                  this.dialogVisible.infoTrip = false;
                }, 100);
              } else {
                this.$base.err(res, this);
              }
            },
            error: err => {
              console.log(err);
            }
          });
        })
        .catch(() => {});
    },
    //行程安排详情
    GetInfoTrip(rgm_num) {
      if (rgm_num !== this.infoRgm_num) this.infoTripData = "";
      this.infoRgm_num = rgm_num;
      this.dialogVisible.infoTrip = true;
      $.ajax({
        url: this.urlHost + "visitor/routedist/details",
        type: "post",
        data: {
          access_token: this.loginVisitor.access_token,
          rgm_num: rgm_num,
          read: 1
        },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            this.infoTripData = res.obj;
            // console.log(this.infoTripData);
            let data = res.obj.data;
            let obj = {};
            for (let i in data) {
              let Y = this.$base.tampToTime(data[i].date, 5);
              obj[Y] = [];
            }
            for (let i in data) {
              let Ye = this.$base.tampToTime(data[i].date, 5);
              for (let j in obj) {
                if (j == Ye) {
                  obj[j].push(data[i]);
                }
              }
            }
            this.infoTripData.resData = obj;
            for (let i in this.infoTripData.data) {
              this.infoTripData.data[i].nyr = this.$base.tampToTime(
                this.infoTripData.data[i].date,
                2
              );
              this.infoTripData.data[i].time = this.$base.tampToTime(
                this.infoTripData.data[i].date,
                1
              );
            }
          } else if (res.msg == "参数错误") {
            this.$message("该行程已被删除！");
            this.dialogVisible.infoTrip = false;
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          console.log(err);
        }
      });
    },
    //游团通知详情
    GetInfoNotice(rgm_num) {
      this.dialogVisible.noticeInfo = true;
      if (rgm_num != this.infoNoticeData.rgm_num) {
        this.infoNoticeData = "";
      }
      $.ajax({
        url: this.urlHost + "visitor/group/noteinfo",
        type: "post",
        data: {
          access_token: this.loginVisitor.access_token,
          rgm_num: rgm_num,
          read: 1
        },
        dataType: "json",
        success: res => {
          if (res.success === "00000000") {
            this.infoNoticeData = res.obj;
            // console.log(res.obj)
          } else if (res.msg == "参数错误") {
            this.$message("该通知已被删除！");
            this.dialogVisible.noticeInfo = false;
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          console.log(err);
        }
      });
    },
    //删除游团通知
    GetNotedel(rgm_num) {
      this.$confirm("确认是否删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          $.ajax({
            url: this.urlHost + "visitor/group/notedel",
            type: "post",
            data: {
              access_token: this.loginVisitor.access_token,
              rgm_num: rgm_num
            },
            dataType: "json",
            success: res => {
              if (res.success === "00000000") {
                this.$message({
                  message: "已删除！",
                  type: "success",
                  center: true
                });
                this.dialogVisible.noticeInfo = false;
                this.GetListNotice(this.itemDataInfo.rg_num);
              } else {
                this.$base.err(res, this);
              }
            },
            error: err => {
              console.log(err);
            }
          });
        })
        .catch(() => {});
    },
    //编辑行程
    GetEditTrip() {
      let cloneData = this.$base.objDeepCopy(this.infoTripData);
      // console.log(this.infoTripData)
      this.editTripData = {
        rgm_num: cloneData.other.rgm_num,
        title: cloneData.other.title,
        routedists: cloneData.data,
        date: this.$base.tampToTime(cloneData.data[0].date, 2),
        list: {}
      };

      for (let i in this.editTripData.routedists) {
        this.editTripData.list[
          this.$base.tampToTime(this.editTripData.routedists[i].date, 2)
        ] = [];
      }
      for (let i in this.editTripData.routedists) {
        let strDate = this.$base.tampToTime(
          this.editTripData.routedists[i].date,
          2
        );
        for (let j in this.editTripData.list) {
          if (j == strDate) {
            this.editTripData.list[strDate].push(
              this.editTripData.routedists[i]
            );
          }
        }
      }
      // console.log(this.editTripData)
      this.dialogVisible.editTrip = true;
    },
    //修改时间
    changeTime(time) {
      this.proList.push(1);
    },
    disab(date) {
      if (Date.now() < date || date == "") {
        return false;
      } else {
        return true;
      }
    },
    //新增input框
    addInput(obj, date) {
      // console.log(obj)
      // this.$forceUpdate();
      this.updateDom();
      obj[date].push({
        title: "",
        content: "",
        date: "",
        end: 0,
        warn: 0,
        warn_flg: 0,
        nyr: date,
        time: ""
      });
      // console.log(this.addTripData.obj)
    },
    //新增行程安排
    GetAddTrip(data) {
      data.rg_num = this.itemData.rg_num;
      let objData = {};
      objData.rg_num = this.itemData.rg_num;
      objData.title = data.title;
      objData.routedists = [];
      if (data.title == "") {
        this.$message({
          message: "标题不可为空！",
          type: "error",
          center: true
        });
      } else {
        for (let i in data.obj) {
          for (let j in data.obj[i]) {
            if (data.obj[i][j].time != "" && data.obj[i][j].content != "") {
              data.obj[i][j].title = data.title;
              // console.log(data.obj[i][j].time)
              data.obj[i][j].time = this.$base.tampToTime(
                data.obj[i][j].time,
                1
              );
              data.obj[i][j].date = this.$base.timeToTamp(
                data.obj[i][j].nyr + " " + data.obj[i][j].time
              );
              if (data.obj[i][j].time != "--") {
                objData.routedists.push(data.obj[i][j]);
              }
            }
          }
        }
        for (let k in objData.routedists) {
          delete objData.routedists[k].nyr;
          delete objData.routedists[k].time;
        }
        if (objData.routedists.length < 1) {
          this.$message({
            message: "至少添加一条行程！",
            type: "error",
            center: true
          });
        } else {
          $.ajax({
            url: this.urlHost + "visitor/routedist",
            type: "post",
            data: {
              access_token: this.loginVisitor.access_token,
              rg_num: objData.rg_num,
              title: objData.title,
              routedists: JSON.stringify(objData.routedists)
            },
            dataType: "json",
            success: res => {
              if (res.success === "00000000") {
                this.$message({
                  message: this.isToken(res.msg),
                  type: "success",
                  center: true
                });
                this.dialogVisible.addTrip = false;
                this.addTripData = {
                  title: "",
                  date: this.$base.tampToTime(Date.now(), 2),
                  obj: {}
                };
              } else {
                this.$base.err(res, this);
              }
            },
            error: err => {
              console.log(err);
            }
          });
        }
      }
    },
    //编辑行程安排
    GetRoutedistTrip(data) {
      let objData = data;
      if (data.title == "") {
        this.$message({
          message: "标题不可为空！",
          type: "error",
          center: true
        });
      } else {
        objData.routedists = [];
        for (let i in data.list) {
          for (let j in data.list[i]) {
            if (
              (data.list[i][j].time != "" || data.list[i][j].time != null) &&
              data.list[i][j].content != ""
            ) {
              data.list[i][j].title = data.title;
              data.list[i][j].date = this.$base.timeToTamp(
                data.list[i][j].nyr + " " + data.list[i][j].time
              );
              if (!isNaN(data.list[i][j].date)) {
                objData.routedists.push(data.list[i][j]);
              }
            }
          }
        }
        for (let k in objData.routedists) {
          delete objData.routedists[k].nyr;
          delete objData.routedists[k].time;
          delete objData.routedists[k].id;
        }
        if (objData.routedists.length < 1) {
          this.$message({
            message: "至少添加一条行程！",
            type: "error",
            center: true
          });
        } else {
          $.ajax({
            url: this.urlHost + "visitor/routedist/edit",
            type: "post",
            data: {
              access_token: this.loginVisitor.access_token,
              rgm_num: objData.rgm_num,
              title: objData.title,
              routedists: JSON.stringify(objData.routedists)
            },
            dataType: "json",
            success: res => {
              if (res.success === "00000000") {
                this.$message({
                  message: res.msg,
                  type: "success",
                  center: true
                });
                this.GetListTrip(this.itemDataInfo.rg_num);
                this.GetInfoTrip(objData.rgm_num);
                setTimeout(() => {
                  this.dialogVisible.editTrip = false;
                }, 100);
              } else {
                this.$base.err(res, this);
              }
            },
            error: err => {
              console.log(err);
            }
          });
        }
      }
    },
    //游团通知图片移除
    removeImg(index) {
      this.addNoticeData.files.splice(index, 1);
    },
    //添加游团通知图片
    fileChanged() {
      const list = this.$refs.file3.files;
      console.log(this.addNoticeData.files);
      for (let i = 0; i < list.length; i++) {
        if (this.addNoticeData.files.length <= 5) {
          if (!this.isContain(list[i])) {
            const item = {
              name: list[i].name,
              size: list[i].size,
              file: list[i]
            };
            this.html5Reader(list[i], item);
            this.addNoticeData.files.push(item);
          }
        } else {
          this.$message("最多只能添加6张图");
          return;
        }
      }
      this.$refs.file.value = "";
    },
    // 将图片文件转成BASE64格式
    html5Reader(file, item) {
      const reader = new FileReader();
      reader.onload = e => {
        this.$set(item, "src", e.target.result);
      };
      reader.readAsDataURL(file);
    },
    isContain(file) {
      return this.addNoticeData.files.find(
        item => item.name === file.name && item.size === file.size
      );
    },
    // 新增游团通知
    GetAddNotice() {
      let objData = this.addNoticeData;
      if (objData.title == "") {
        this.$message({
          message: "请输入标题！",
          type: "error",
          center: true
        });
      } else if (objData.operate != 0 && objData.date == "") {
        this.$message({
          message: "请选择提醒日期！",
          type: "error",
          center: true
        });
      } else {
        if (objData.files.length == 0) {
          this.GetNotice(objData);
        } else {
          //图片上传后再
          this.GetUpImg(objData);
        }
      }
    },
    //提交新增游团通知
    GetNotice(data) {
      let getData = {};
      if (data.date == "") {
        getData = {
          access_token: this.loginVisitor.access_token,
          rg_num: this.itemData.rg_num,
          title: data.title,
          content: data.content,
          imgs: JSON.stringify(data.imgs),
          video: JSON.stringify(data.video),
          audios: JSON.stringify(data.audios),
          operate: this.addNoticeData.operate
        };
      } else {
        getData = {
          access_token: this.loginVisitor.access_token,
          rg_num: this.itemData.rg_num,
          title: data.title,
          content: data.content,
          imgs: JSON.stringify(data.imgs),
          video: JSON.stringify(data.video),
          audios: JSON.stringify(data.audios),
          operate: this.addNoticeData.operate,
          date: this.$base.timeToTampNotice(data.date)
        };
      }
      // console.log(data)
      $.ajax({
        url: this.urlHost + "visitor/group/note",
        type: "post",
        data: getData,
        dataType: "json",
        success: res => {
          // this.$loading().close()
          if (res.success === "00000000") {
            this.$message({
              message: res.msg,
              type: "success",
              center: true
            });
            this.dialogVisible.addNotice = false;
            this.addNoticeData = {
              title: "",
              operate: 0,
              date: "",
              files: [],
              imgs: []
            };
          } else {
            this.$base.err(res, this);
          }
        },
        error: err => {
          this.$loading().close();
          console.log(err);
        }
      });
    },
    GetUpImg(data) {
      const _that = this;
      $.ajax({
        url: _that.urlHost + "common/ali_sts",
        type: "post",
        dataType: "json",
        success: res => {
          // console.log(res)
          if (res.StatusCode == "200") {
            data.imgs = [];
            const OSSData = res;
            const client = new OSS.Wrapper({
              region: "oss-cn-beijing",
              accessKeyId: OSSData.AccessKeyId,
              accessKeySecret: OSSData.AccessKeySecret,
              stsToken: OSSData.SecurityToken,
              bucket: "anygo-imag"
            });
            let imgLen = 0;
            let loadLen = 0;
            // console.log()
            for (let i in _that.addNoticeData.files) {
              if (_that.addNoticeData.files[i] != undefined) {
                loadLen++;
                let f = _that.addNoticeData.files[i].file;
                const Name = f.name;
                const suffix = Name.substr(Name.indexOf("."));
                const storeAs =
                  "message_imgs/" + _that.$base.createRandomId() + suffix; //  路径+随机命名+后缀名
                client
                  .multipartUpload(storeAs, f)
                  .then(function(result) {
                    let urlName = result.name.substring(
                      result.name.lastIndexOf("/") + 1
                    );
                    _that.addNoticeData.imgs.push({
                      content: "",
                      url: urlName
                    });
                    imgLen++;
                    if (imgLen == loadLen) {
                      _that.GetNotice(data);
                    }
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }
            }
          }
        },
        error: err => {}
      });
    },
    //聊天图片预览
    msgImgView(imgs, index, url) {
      let imgsData = [];
      for (let i in imgs) {
        if (imgs[i].obj) {
          //聊天img处理
          if (imgs[i].obj.type == 1) {
            imgsData.push(url + imgs[i].obj.url);
          }
        } else {
          //其他
          if (imgs[i].url) {
            imgsData.push(url + imgs[i].url);
          } else if (imgs[i].src) {
            //本地img
            imgsData.push(imgs[i].src);
          }
        }
      }
      for (let i = 0; i < imgsData.length; i++) {
        if (imgs[index].obj) {
          //聊天img处理
          if (url + imgs[index].obj.url == imgsData[i]) {
            this.viewBtn(imgsData, i);
          }
        } else {
          if (url + imgs[index].url == imgsData[i]) {
            this.viewBtn(imgsData, i);
          } else if (imgs[index].src == imgsData[i]) {
            //本地img
            this.viewBtn(imgsData, i);
          }
        }
      }
    },
    emojiTo(msg) {
      for (let i = 0; i < this.iconEx.length; i++) {
        let re = "/" + this.iconEx[i] + "/g";
        // console.log(msg)
        if (typeof msg == "string")
          msg = msg.replace(
            eval(re),
            '<i class="bg-' +
              (i + 1) +
              '" style="width:20px!important;height:20px;"></i>'
          );
      }
      return msg;
    },
    //存储发消息
    GetlocaShowDom(rs_num, data) {
      let locaShowDom = localStorage.getItem("locaShowDom");
      if (locaShowDom == null || locaShowDom == "") {
        locaShowDom = {};
      } else {
        locaShowDom = JSON.parse(locaShowDom);
      }
      if (locaShowDom[rs_num] == null) {
        locaShowDom[rs_num] = [];
      }
      locaShowDom[rs_num].push(data);
      // console.log(locaShowDom[rs_num])
      this.showDemo = locaShowDom;
      localStorage.setItem("locaShowDom", JSON.stringify(locaShowDom));
    },
    //存储总的消息
    GetlocaAllMsg(rs_num, rsm_num, data) {
      var locaMsg = localStorage.getItem("locaAllMsg");
      var locaShowDom = localStorage.getItem("locaShowDom");
      if (locaMsg == null || locaMsg == "") {
        locaMsg = {};
      } else {
        locaMsg = JSON.parse(locaMsg);
      }
      if (locaShowDom == null || locaShowDom == "") {
        locaShowDom = {};
      } else {
        locaShowDom = JSON.parse(locaShowDom);
      }
      if (locaMsg[rs_num] == undefined) {
        locaMsg[rs_num] = {};
      }

      if (locaShowDom[rs_num] == null) {
        locaShowDom[rs_num] = [];
      }
      locaMsg[rs_num][rsm_num] = data;
      locaShowDom[rs_num].push(data);
      this.showDemo = locaShowDom;
      // console.log(this.showDemo)
      localStorage.setItem("locaAllMsg", JSON.stringify(locaMsg));
      localStorage.setItem("locaShowDom", JSON.stringify(locaShowDom));
    },
    //同步历史消息
    GetMsgs(rs_num, rsm_num) {
      const that = this;
      //   console.log(rsm_num)
      if (rsm_num == undefined) {
        $.ajax({
          url: this.urlHost + "visitor/msgs",
          type: "post",
          data: {
            access_token: this.loginVisitor.access_token,
            rs_num: rs_num,
            page: 1,
            rows: 20
          },
          timeout: 10000,
          dataType: "json",
          success: res => {
            if (res.success === "00000000") {
              let data = res.obj.data;
              for (let i = 0; i < data.length; i++) {
                if (!(data[i].obj.rsm_num in that.locaAllMsg[rs_num])) {
                  that.locaAllMsg[rs_num][data[i].obj.rsm_num] = data[i];
                }
              }
              // console.log(that.locaAllMsg[rs_num])
              that.showDemo[rs_num] = [];
              for (let i in that.locaAllMsg[rs_num]) {
                that.$forceUpdate();
                that.showDemo[rs_num].unshift(that.locaAllMsg[rs_num][i]);
              }
              that.showDemo[rs_num] = that.showDemo[rs_num].sort(function(
                a,
                b
              ) {
                return a.date - b.date;
              });
              //   console.log(that.locaAllMsg[rs_num]);
              localStorage.setItem(
                "locaAllMsg",
                JSON.stringify(that.locaAllMsg)
              );
              localStorage.setItem(
                "locaShowDom",
                JSON.stringify(that.showDemo)
              );
              setTimeout(() => {
                that.scrollB();
              }, 300);
              that.historyMsgType[rs_num] = 1;
              localStorage.setItem(
                "historyMsg",
                JSON.stringify(that.historyMsgType)
              );
            } else {
              this.$base.err(res, this);
            }
          },
          error: err => {
            console.log(err);
          }
        });
      } else {
        // console.log(rsm_num)
        $.ajax({
          url: this.urlHost + "visitor/msgs",
          type: "post",
          data: {
            access_token: this.loginVisitor.access_token,
            rs_num: rs_num,
            rsm_num: rsm_num,
            page: 1,
            rows: 10
          },
          timeout: 10000,
          dataType: "json",
          success: res => {
            // console.log()
            if (res.success === "00000000") {
              let data = res.obj.data;
              for (let i = 0; i < data.length; i++) {
                if (!(data[i].obj.rsm_num in that.locaAllMsg[rs_num])) {
                  that.locaAllMsg[rs_num][data[i].obj.rsm_num] = data[i];
                  that.showDemo[rs_num].unshift(data[i]);
                }
              }
              // console.log(that.locaAllMsg[rs_num])
              // that.showDemo[rs_num] = []
              // that.showDemo[rs_num].splice(0)
              // for(let i in that.locaAllMsg[rs_num]){
              //     that.$forceUpdate()
              //     that.showDemo[rs_num].unshift(that.locaAllMsg[rs_num][i])
              // }
              that.showDemo[rs_num] = that.showDemo[rs_num].sort(function(
                a,
                b
              ) {
                return a.date - b.date;
              });
              localStorage.setItem(
                "locaAllMsg",
                JSON.stringify(that.locaAllMsg)
              );
              localStorage.setItem(
                "locaShowDom",
                JSON.stringify(that.showDemo)
              );
            } else {
              this.$base.err(res, this);
            }
          },
          error: err => {
            console.log(err);
          }
        });
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.date < Date.now()) {
        return "warning-row";
      }
    },
    say() {
      // console.log(this.$base.newMsg(this.newMsgLength))
      this.$emit(
        "say",
        this.$base.newMsg(this.newMsgLength[this.loginVisitor.access_num])
      );
    }
  }
};
</script>

<style lang="less">
@import "./../../../../static/css/emoji.css";
.msg {
  position: relative;
  background: #f3f3f3;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 0 8px 8px 0;
  display: flex;
  user-select: none;
  #origin-img1 {
    position: fixed;
    z-index: 111111;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    .swiper-slide {
      width: 100% !important;
      img {
        // width: 30%;
        vertical-align: middle;
      }
    }
    .swiper-pagination {
      top: 1em;
      bottom: auto;
      color: #fff;
    }
  }
  .msg-list {
    width: 302px;
    height: 100%;
    background: #f7f7f7;
    position: relative;
    .msg-search {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      padding: 0 6px 0 16px;
      input {
        // z-index: 0;
        position: relative;
        outline: none;
        width: 220px;
        // height: 58px;
        border: 0;
        background: #f7f7f7;
        font-size: 14px;
        padding: 5px 0;
      }
      > div:nth-child(3) {
        img {
          z-index: 2;
          position: relative;
          cursor: pointer;
          &:hover {
            opacity: 0.7;
          }
        }
      }
    }
    .msg-box {
      background: #fff;
      height: calc(100% - 60px);
      .box-nav {
        display: flex;
        justify-content: space-between;
        padding: 32px 16px 20px 16px;
        color: #999;
        font-size: 14px;
        max-height: 70px;
        div {
          cursor: pointer;
          &:hover {
            color: #666;
          }
          div {
            position: relative;
            width: 0;
            height: 0;
            div {
              position: absolute;
              top: 11px;
              left: 10px;
              width: 8px;
              height: 8px;
              background: #333;
              border-radius: 50%;
            }
          }
        }
        div:nth-child(4) {
          div {
            div {
              left: 16px;
            }
          }
        }
      }
      .box-list {
        position: relative;
        border-top: 1px solid #ddd;
        padding-top: 13px;
        // height: 100%;
        // background: red;
        height: calc(100% - 85px);
        overflow-y: auto;
        overflow-x: hidden;
        .titleTop {
          color: #999;
          text-align: center;
        }
        .box-list-item {
          border-bottom: 1px solid #fff;
          .top {
            position: relative;
            width: 0;
            height: 0;
            left: -35px;
            top: -50px;
            > div {
              width: 0;
              height: 0;
              border-width: 0 30px 30px;
              border-style: solid;
              border-color: transparent transparent rgba(0, 0, 0, 0); /*透明 透明  灰*/
              margin: 40px auto;
              position: relative;
              span {
                transform: scale(0.8) rotate(45deg);
                display: block;
                width: 0;
                height: 0;
                border-width: 0 28px 28px;
                border-style: solid;
                border-color: transparent transparent #3b9cf8; /*透明 透明  */
                position: absolute;
                top: 0px;
                left: 0px;
                font-size: 12px;
                white-space: nowrap;
                display: flex;
                line-height: 32px;
                justify-content: center;
                color: #fff;
                opacity: 0.8;
              }
            }
          }
          > div {
            // border-bottom: 1px solid #fff;
            > div {
              padding: 10px 15px;
              // cursor: pointer;
              display: flex;
              justify-content: space-between;
              // &:hover {
              //   background: #e2e2e2;
              // }
              > div:nth-child(1) {
                img {
                  width: 42px;
                  height: 42px;
                  border-radius: 6px;
                }
              }
              > div:nth-child(2) {
                flex: 1;
                margin-left: 12px;
                > div:nth-child(1) {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  div:nth-child(1) {
                    color: #333;
                    font-size: 16px;
                  }
                  div:nth-child(2) {
                    font-size: 12px;
                    color: #aaa;
                    overflow: hidden;
                    white-space: nowrap;
                    // width: 67px;
                    text-align: right;
                  }
                }
                > div:nth-child(2) {
                  margin-top: 2px;
                  color: #999;
                  font-size: 12px;
                  height: 20px;
                  line-height: 20px;
                  width: 200px;
                  overflow: hidden;
                  display: flex;
                  align-items: center;
                  flex-wrap: wrap;
                }
              }
            }
            .flex-c {
              // display: flex;
              // align-items: center;
              img {
                position: relative;
                margin-right: 3px;
                top: 4px;
                // margin-right: 3px;
              }
            }
          }
        }
        .newFirend-title {
          margin: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          > div:nth-child(1) {
            color: #aaa;
          }
          > div:nth-child(2) {
            border: 1px solid #666;
            color: #666;
            border-radius: 50px;
            font-size: 12px;
            padding: 5px 15px;
            cursor: pointer;
            &:hover {
              color: #fff;
              background: #3b9cf8;
              border-color: #3b9cf8;
            }
          }
        }
        .rexBtn {
          > div:nth-child(2) {
            // width: 80px;
            > span:nth-child(2) {
              color: #3b9cf8;
              margin-left: 10px;
            }
          }
        }
      }
    }
    .search-list {
      border-top: 1px solid #ddd;
      background: #fff;
      padding-top: 13px;
      // height: 681px;
      // height: 555px;
      height: calc(100% - 74px);
      overflow-y: auto;
      .box-list-item {
        cursor: pointer;
        > div {
          padding: 13px 15px;
          display: flex;
          justify-content: space-between;
          &:hover {
            background: #e2e2e2;
          }
          > div:nth-child(1) {
            img {
              width: 42px;
              height: 42px;
              border-radius: 6px;
            }
          }
          > div:nth-child(2) {
            flex: 1;
            margin-left: 12px;
            > div:nth-child(1) {
              display: flex;
              justify-content: space-between;
              align-items: center;
              div:nth-child(1) {
                color: #333;
                font-size: 14px;
              }
              div:nth-child(2) {
                font-size: 12px;
                color: #aaa;
              }
            }
            > div:nth-child(2) {
              margin-top: 2px;
              color: #999;
              font-size: 12px;
              width: 200px;
            }
          }
        }
        .item {
          background: #ccc;
          color: #fff;
          font-size: 12px;
          padding: 2px 5px;
          border-radius: 50px;
          margin-right: 3px;
        }
      }
      .newFirend-title {
        margin: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        > div:nth-child(1) {
          color: #aaa;
        }
        > div:nth-child(2) {
          border: 1px solid #666;
          color: #666;
          border-radius: 50px;
          font-size: 12px;
          padding: 5px 15px;
          cursor: pointer;
          &:hover {
            color: #fff;
            background: #3b9cf8;
            border-color: #3b9cf8;
          }
        }
      }
    }
  }
  .msg-send {
    // width: 702px;
    flex: 1;
    .msg-send-top {
      height: 60px;
      display: flex;
      padding: 0 34px 0 40px;
      align-items: center;
      justify-content: space-between;
      > div {
        cursor: pointer;
        &:hover {
          opacity: 0.7;
        }
      }
      > div:nth-child(1) {
        z-index: 2;
        position: relative;
        border-bottom: 1px solid #f3f3f3;
        cursor: pointer;
        user-select: text;
        span:nth-child(1) {
          font-size: 18px;
          color: #333;
        }
        span:nth-child(2) {
          font-size: 16px;
          color: #aaa;
        }
        &:hover {
          border-bottom: 1px solid #ccc;
        }
      }
      .top-tool {
        z-index: 2;
        position: relative;
      }
    }
    .msg-send-box {
      border-top: 1px solid #dedede;
      border-bottom: 1px solid #dedede;
      // height: 508px;
      // height: 388px;
      height: calc(100% - 242px);
      padding: 10px 40px;
      user-select: text;
      overflow: auto;
      .msgLoad {
        text-align: center;
        padding: 10px 0;
        font-size: 12px;
        color: #3b9cf8;
        height: 40px;
        line-height: 40px;
        img {
          width: 20px;
          height: 20px;
        }
      }
      .show-time,
      .show-system {
        text-align: center;
        padding: 10px 0;
        span {
          color: #fff;
          font-size: 14px;
          border-radius: 2px;
          text-align: center;
          background: #ccc;
          padding: 3px 10px;
          width: 450px;
        }
      }
      .show-time {
        margin-top: 30px;
      }
      .show-left {
        margin-bottom: 20px;
        display: flex;
        .leftJ:before {
          position: absolute;
          content: "";
          width: 0;
          height: 0;
          left: -9px;
          top: 5px;
          border-right: 9px solid #ccc;
          border-top: 9px solid transparent;
          border-bottom: 9px solid transparent;
        }
        .leftJ:after {
          position: absolute;
          content: "";
          width: 0;
          height: 0;
          left: -7px;
          top: 7px;
          border-right: 7px solid #fff;
          border-top: 7px solid transparent;
          border-bottom: 7px solid transparent;
        }
        > div:nth-child(2) {
          display: flex;
          flex-direction: column;
          margin-top: -5px;
        }
        .headIcon {
          width: 42px;
          height: 42px;
          margin-right: 10px;
          border-radius: 4px;
          // border-radius: 50%;
          user-select: none;
        }
        .msgImgs {
          max-height: 150px;
          max-width: 300px;
          border: 1px solid #fff;
          background: #fff;
          border-radius: 4px;
          cursor: pointer;
        }
        .audio {
          cursor: pointer;
          > div:nth-child(1) {
            height: 20px;
            flex: 1;
            color: #666;
            img {
              margin-right: 20px;
            }
            display: flex;
            align-items: center;
            justify-content: space-between;
            white-space: initial;
          }
        }
        .trip {
          display: flex;
          > div:nth-child(2) {
            margin-left: 10px;
            width: 180px;
            display: flex;
            font-size: 16px;
            flex-direction: column;
            justify-content: space-between;
            > div:nth-child(1) {
              color: #333;
            }
            > div:nth-child(2) {
              color: #aaa;
              display: flex;
            }
          }
        }
        .file {
          white-space: normal !important;
          display: block !important;
          > div:nth-child(1) {
            display: flex;
            > div:nth-child(2) {
              margin-left: 20px;
              width: 140px;
              display: flex;
              font-size: 16px;
              flex-direction: column;
              // justify-content: space-between;
              > div:nth-child(1) {
                color: #333;
              }
              > div:nth-child(2) {
                margin-top: 5px;
                font-size: 14px;
                color: #aaa;
              }
            }
          }
          > div:nth-child(2) {
            text-align: right;
            display: flex;
            justify-content: flex-end;
            p {
              color: #3b9cf8;
              cursor: pointer;
              font-size: 14px;
              margin-left: 20px;
            }
          }
        }
        .notice {
          cursor: pointer;
          flex-direction: column;
          width: 248px;
          > div:nth-child(1) {
            display: flex;
            align-items: center;
            border-bottom: 1px solid #ccc;
            padding-bottom: 20px;
            img {
              margin-right: 10px;
            }
          }
          > div:nth-child(2) {
            display: flex;
            align-items: center;
            margin-top: 10px;
            > div:nth-child(1) {
              width: 200px;
            }
            > div:nth-child(2) {
              margin-left: 10px;
              font-size: 14px;
              color: #999;
            }
          }
        }
        span:nth-child(1) {
          font-size: 16px;
          color: #666;
          display: flex;
          align-items: center;
          img {
            margin-right: 3px;
          }
        }
        span:nth-child(2) {
          display: flex;
          flex-wrap: wrap;
          margin-top: 2px;
          background: #fff;
          border-radius: 4px;
          border: 1px solid #ccc;
          font-size: 16px;
          color: #333;
          padding: 10px 11px;
          max-width: 470px;
          white-space: pre-wrap;
          word-break: break-all;
          position: relative;
        }
      }
      .show-right {
        margin-bottom: 20px;
        display: flex;
        justify-content: flex-end;
        .rightJ:before {
          position: absolute;
          content: "";
          width: 0;
          height: 0;
          left: 100%;
          top: 6px;
          border-left: 9px solid #ccc;
          border-top: 9px solid transparent;
          border-bottom: 9px solid transparent;
        }
        .rightJ:after {
          position: absolute;
          content: "";
          width: 0;
          height: 0;
          left: 100%;
          top: 8px;
          border-left: 7px solid #fff;
          border-top: 7px solid transparent;
          border-bottom: 7px solid transparent;
        }
        // align-items: center;
        .error {
          width: 20px;
          height: 20px;
          margin: 10px 10px 0 0;
        }
        .headIcon {
          width: 42px;
          height: 42px;
          margin-left: 10px;
          border-radius: 4px;
          // border-radius: 50%;
          user-select: none;
        }
        .msgImgs {
          max-height: 150px;
          max-width: 300px;
          border: 1px solid #fff;
          border-radius: 4px;
          cursor: pointer;
        }
        .file {
          cursor: pointer;
          white-space: normal !important;
          > div:nth-child(1) {
            display: flex;
            padding: 10px 0;
            > div:nth-child(2) {
              margin-left: 20px;
              width: 140px;
              display: flex;
              font-size: 16px;
              flex-direction: column;
              // justify-content: space-between;
              > div:nth-child(1) {
                color: #333;
              }
              > div:nth-child(2) {
                margin-top: 5px;
                font-size: 14px;
                color: #aaa;
              }
            }
          }
          > div:nth-child(2) {
            text-align: right;
            p {
              color: #3b9cf8;
              cursor: pointer;
            }
          }
        }
        .audio {
          cursor: pointer;
          > div:nth-child(1) {
            height: 20px;
            flex: 1;
            color: #666;
            img {
              margin-right: 20px;
            }
            display: flex;
            align-items: center;
            justify-content: space-between;
            white-space: initial;
          }
        }
        .notice {
          cursor: pointer;
          flex-direction: column;
          width: 248px;
          > div:nth-child(1) {
            display: flex;
            align-items: center;
            border-bottom: 1px solid #ccc;
            padding-bottom: 20px;
            img {
              margin-right: 10px;
            }
          }
          > div:nth-child(2) {
            display: flex;
            align-items: center;
            margin-top: 10px;
            > div:nth-child(1) {
              width: 200px;
            }
            > div:nth-child(2) {
              margin-left: 10px;
              font-size: 14px;
              color: #999;
            }
          }
        }
        > span {
          display: flex;
          flex-wrap: wrap;
          background: #fff;
          border-radius: 4px;
          border: 1px solid #ccc;
          font-size: 16px;
          color: #333;
          padding: 10px 11px;
          max-width: 470px;
          white-space: pre-wrap;
          word-break: break-all;
          position: relative;
        }
      }
      .trip {
        display: flex;
        cursor: pointer;
        > div:nth-child(2) {
          margin-left: 10px;
          width: 180px;
          display: flex;
          font-size: 16px;
          flex-direction: column;
          justify-content: space-between;
          > div:nth-child(1) {
            color: #333;
          }
          > div:nth-child(2) {
            color: #aaa;
            display: flex;
            font-size: 14px;
          }
        }
      }
    }
    .msg-send-input {
      .contentedit {
        // user-modify: read-write-plaintext-only;
        // -webkit-user-modify: read-write-plaintext-only;
        // -ms-user-modify: read-write-plaintext-only;
        -webkit-user-select: text;
        word-break: break-all;
        padding: 10px;
        height: 100px;
        overflow-y: auto;
        outline: none;
        img {
          height: 70px;
          width: 120px;
          margin-right: 1px;
          cursor: move;
        }
        span {
          background: #f3f3f3 !important;
          color: #333 !important;
          font-size: 16px !important;
        }
        input {
          border: 0;
          background: #ccc;
          padding: 1px 3px;
          margin: 0 5px;
          border-radius: 4px;
          user-select: none;
          text-align: center;
        }
      }
      .contentedit::selection {
        background: #ccc;
        // color:#ff645d;
      }
      .contentedit[contenteditable]:empty:not(:focus):before {
        content: attr(placeholder);
        color: #ccc;
      }
      .iconbtn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px 34px 0 36px;
        .icon-item {
          img {
            margin-right: 30px;
            margin-bottom: 10px;
            cursor: pointer;
          }
          .ml52 {
            margin-left: 22px;
          }
        }

        .send-btn {
          width: 62px;
          height: 27px;
          font-size: 14px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #3b9cf8;
          color: #fff;
          font-size: 16px;
          border-radius: 2px;
          cursor: pointer;
          // &:hover{
          //     background: #3B9CF8;
          //     color: #fff;
          // }
        }
        .send-none {
          width: 62px;
          height: 27px;
          font-size: 14px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #888;
          color: #fff;
          font-size: 16px;
          border-radius: 2px;
          cursor: pointer;
        }
      }
    }
  }
  @keyframes myOpacity {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .dialogs {
    .listTrip {
      .el-dialog__headerbtn {
        display: none;
      }
      .el-dialog__header,
      .el-dialog__body {
        padding: 0;
      }
      .el-dialog__wrapper {
        display: flex;
        align-items: center;
      }
      .el-dialog {
        width: 500px;
        height: 700px;
        background: #f9f9f9;
        // margin-top: 0 !important;
        position: relative !important;
        top: 0;
        left: 230px;
      }
      .listTrip-box {
        font-size: 16px;
        color: #333;
        background: #f3f3f3;
        border-radius: 4px;
        > div:nth-child(1) {
          display: flex;
          justify-content: space-between;
          padding: 15px 24px;
          background: #fff;
          border-bottom: 1px solid #ccc;
          border-radius: 4px 4px 0 0;
          cursor: move;
        }
        > div:nth-child(2) {
          height: 647px;
          overflow-y: auto;
          > div {
            margin: 20px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background: #fff;
            user-select: text;
            .trip-title {
              border-bottom: 1px solid #ccc;
              padding: 13px;
              cursor: pointer;
              transition: all 0.1s;
              &:hover {
                background: #efefef;
              }
              &:active {
                background: #fefefe;
              }
              > div:nth-child(2) {
                margin-top: 6px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                color: #999;
                .ac {
                  color: #3b9cf8;
                }
              }
            }
            .trip-content {
              padding: 20px 15px;
              font-size: 14px;
              color: #333;
              > div {
                > div:nth-child(2) {
                  margin: 8px 0 22px 0;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
              }
              > div:last-child {
                > div:nth-child(2) {
                  margin-bottom: 0;
                }
              }
              .col_9 {
                color: #999;
              }
            }
          }
        }
      }
    }
    .listNotice {
      .el-dialog__headerbtn {
        display: none;
      }
      .el-dialog__header,
      .el-dialog__body {
        padding: 0;
      }
      .el-dialog__wrapper {
        display: flex;
        align-items: center;
      }
      .el-dialog {
        width: 500px;
        height: 700px;
        background: #f9f9f9;
        // margin-top: 0!important;
        position: relative !important;
        top: 0;
        left: 230px;
      }
      .listNotice-box {
        font-size: 16px;
        color: #333;
        background: #f3f3f3;
        border-radius: 4px;
        > div:nth-child(1) {
          display: flex;
          justify-content: space-between;
          padding: 15px 24px;
          background: #fff;
          border-bottom: 1px solid #ccc;
          border-radius: 4px 4px 0 0;
          cursor: move;
        }
        > div:nth-child(2) {
          height: 647px;
          border-radius: 0 0 4px 4px;
          overflow-y: auto;
          padding: 0 20px;
          > div {
            margin-top: 20px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background: #fff;
            > div:nth-child(1) {
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 59px;
              padding-left: 13px;
              border-bottom: 1px solid #ccc;
              > div:nth-child(1) {
                color: #333;
              }
              > div:nth-child(2) {
                margin-top: 6px;
                font-size: 12px;
                color: #999;
              }
            }
            > div:nth-child(2) {
              padding: 24px 14px;
              > div:nth-child(1) {
                height: 50px;
                line-height: 24px;
                overflow: hidden;
              }
              .noticeVoice {
                display: flex;
                align-items: center;
                > div:nth-child(1) {
                  background: url(https://anygo-imag.oss-cn-beijing.aliyuncs.com/webImg/bg_voice.png);
                  width: 342px;
                  height: 41px;
                }
                > div:nth-child(2) {
                  line-height: 41px;
                  margin-left: 20px;
                }
                img {
                  margin-left: 10px;
                }
              }
              .noticeImg {
                margin-top: 24px;
                img {
                  width: auto;
                  max-height: 200px;
                }
              }
              > div:last-child {
                margin-top: 24px;
                font-size: 12px;
                color: #999;
              }
            }
          }
          > div:last-child {
            margin-bottom: 20px;
          }
        }
      }
    }
    .infoTrip {
      .el-dialog__headerbtn {
        display: none;
      }
      .el-dialog__header,
      .el-dialog__body {
        padding: 0;
      }
      .el-dialog__wrapper {
        display: flex;
        align-items: center;
      }
      .el-dialog {
        width: 500px;
        height: 650px;
        background: #f9f9f9;
        // margin-top: 0!important;
        position: relative !important;
        top: 0;
        left: 230px;
      }
      .infoTrip-box {
        font-size: 16px;
        color: #333;
        height: 683px;
        user-select: text;
        background: #f3f3f3;
        border-radius: 4px;
        > div:nth-child(1) {
          display: flex;
          justify-content: space-between;
          padding: 15px 24px;
          background: #fff;
          border-radius: 4px 4px 0 0;
          cursor: move;
          > div:nth-child(2) {
            cursor: pointer;
            &:hover {
              opacity: 0.7;
            }
          }
        }
        .infoTrips {
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #fff;
          user-select: text;
          margin: 24px;
          .infoTrip-title {
            border-bottom: 1px solid #ccc;
            padding: 12px;
            > div:nth-child(2) {
              margin-top: 6px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 12px;
              color: #999;
              .ac {
                color: #3b9cf8;
              }
            }
            .ac {
              color: #3b9cf8;
            }
          }
          .infoTrip-content {
            height: 433px;
            overflow-y: auto;
            padding: 0 14px 20px 14px;
            .dateY {
              position: relative;
              text-align: center;
              margin: 25px 0;
              .rel-hr {
                position: absolute;
                top: 11px;
                border-block-end: 1px solid #e2e2e2;
                width: calc(100% - 40px);
                z-index: 1;
              }
              > span {
                position: relative;
                z-index: 2;
                background: #fff;
                padding: 0 10px;
                color: #ccc;
                font-size: 12px;
              }
            }
            .item-content {
              // padding: 20px 15px;
              font-size: 14px;
              color: #333;
              > div:nth-child(1) {
                color: #999;
              }
              > div:nth-child(2) {
                margin: 8px 0 22px 0;
                word-break: break-all;
                white-space: pre-wrap;
              }
              > div:last-child {
                > div:nth-child(2) {
                  margin-bottom: 0;
                }
              }
              .col_9 {
                color: #999;
              }
            }
          }
        }
        .tripEdit {
          display: flex;
          justify-content: center;
          .el-button {
            padding: 8px 20px;
          }
        }
      }
    }
    .noticeInfo {
      .el-dialog__headerbtn {
        display: none;
      }
      .el-dialog__header,
      .el-dialog__body {
        padding: 0;
      }
      .el-dialog__wrapper {
        display: flex;
        align-items: center;
      }
      .el-dialog {
        width: 478px;
        height: 683px;
        background-color: #ffffff;
        box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.24);
        border-radius: 4px;
        margin-top: 0 !important;
        position: relative !important;
        top: 0;
        left: 230px;
      }
      .noticeInfo-box {
        font-size: 16px;
        color: #333;
        width: 478px;
        height: 683px;
        user-select: text;
        background: #f3f3f3;
        border-radius: 4px;
        > div:nth-child(1) {
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          padding: 20px;
          background: #fff;
          border-bottom: 1px solid #ccc;
          cursor: move;
          > div:nth-child(2) {
            cursor: pointer;
            &:hover {
              opacity: 0.7;
            }
          }
        }
        > div:nth-child(2) {
          padding: 20px;
          .noticeInfo-title {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 0 13px;
            height: 60px;
            border: 1px solid #ccc;
            border-bottom: 0 !important;
            border-radius: 4px 4px 0 0;
            > div:nth-child(2) {
              margin-top: 6px;
              font-size: 12px;
              color: #999;
            }
          }
          .noticeInfo-content {
            border: 1px solid #ccc;
            border-radius: 0 0 4px 4px;
            height: 445px;
            overflow-y: auto;
            padding: 13px 14px;
            > div:nth-child(1) {
              // margin-top: 30px;
              // padding-right: 15px;
              word-break: break-all;
            }
            .noticeVoice {
              margin-top: 30px;
              display: flex;
              > div:nth-child(1) {
                background: url(https://anygo-imag.oss-cn-beijing.aliyuncs.com/webImg/bg_voice.png);
                width: 310px;
                height: 41px;
                border-radius: 0 4px 4px 0;
                display: flex;
                align-items: center;
              }
              > div:nth-child(2) {
                line-height: 41px;
                margin-left: 20px;
              }
              img {
                margin-left: 10px;
              }
            }
            .noticeImg {
              margin-top: 30px;
              display: flex;
              flex-wrap: wrap;
              .imgOne {
                width: 100%;
                height: 100%;
                cursor: pointer;
              }
              div {
                width: 128px;
                height: 130px;
                overflow: hidden;
                margin: 0 8px 8px 0;
                background: rgba(0, 0, 0, 0.1);
              }
              div:nth-child(3n) {
                margin-right: 0 !important;
              }
              img {
                cursor: pointer;
                width: 100%;
                min-height: 100%;
              }
            }
            .operate {
              margin-top: 20px;
              font-size: 12px;
              color: #666;
              display: flex;
              align-items: center;
              img {
                margin-right: 10px;
              }
            }
          }
          .del {
            text-align: center;
            margin-top: 21px;
          }
        }
      }
    }
    .addTrip {
      position: relative;
      .el-dialog__headerbtn {
        display: none;
      }
      .el-dialog__header,
      .el-dialog__body {
        padding: 0;
      }
      .el-dialog__wrapper {
        display: flex;
        align-items: center;
      }
      .el-dialog {
        width: 400px;
        height: 550px;
        background: #f9f9f9;
        margin-top: 0 !important;
        position: relative !important;
        top: 0;
        left: 230px;
      }
      .addTrip-box {
        font-size: 16px;
        color: #333;
        > div:nth-child(1) {
          display: flex;
          justify-content: space-between;
          padding: 15px 24px;
          background: #fff;
          cursor: move;
        }
        > div:nth-child(2) {
          border-top: 1px solid #ccc;
          height: 340px;
          overflow-y: auto;
          padding: 30px 24px;
          > div:nth-child(1) {
            border: 1px solid #ccc;
            background: #fff;
            height: 36px;
            line-height: 36px;
            span:nth-child(1) {
              padding: 0 16px;
              border-right: 1px solid #ccc;
            }
            input {
              margin-left: 16px;
              width: 200px;
              height: 24px;
              border: 0;
              outline: none;
            }
            span:nth-child(3) {
              // margin-left: 10px;
              color: #999;
              font-size: 12px;
            }
          }
          > div:nth-child(2) {
            margin: 20px 0;
            .el-date-editor.el-input,
            .el-date-editor.el-input__inner {
              width: 100%;
            }
          }
          > div:nth-child(3) {
            > div {
              border: 1px solid #ccc;
              border-bottom: 0;
              display: flex;
              align-items: center;
              height: 72px;
              img {
                width: 9px;
                height: 42px;
              }
              input {
                border: 0;
                background: #f9f9f9;
              }
              > div:nth-child(1) {
                .el-date-editor.el-input,
                .el-date-editor.el-input__inner {
                  width: 100px;
                }
              }
              > div:nth-child(3) {
                margin-left: 10px;
              }
              > div:nth-child(4) {
                white-space: nowrap;
                font-size: 12px;
                color: #999;
                margin-right: 10px;
              }
            }
            > div:last-child {
              border-bottom: 1px solid #ccc;
            }
          }
        }
        > div:nth-child(3) {
          height: 84px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rel {
          position: relative;
          height: 0;
          width: 0;
          > div {
            position: absolute;
            top: -28px;
            left: 200px;
            color: #999;
            font-size: 12px;
            width: 120px;
          }
        }
      }
    }
    .addNotice {
      .el-dialog__headerbtn {
        display: none;
      }
      .el-dialog__header,
      .el-dialog__body {
        padding: 0;
      }
      .el-dialog__wrapper {
        display: flex;
        align-items: center;
      }
      .el-dialog {
        width: 478px;
        height: 683px;
        background: #fff;
        margin-top: 0 !important;
        position: relative !important;
        box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.24);
        border-radius: 4px;
        top: 0;
        left: 230px;
      }
      .addNotice-box {
        position: relative;
        width: 478px;
        height: 683px;
        font-size: 16px;
        color: #333;
        > div:nth-child(1) {
          display: flex;
          justify-content: space-between;
          padding: 20px;
          background: #fff;
          border-radius: 4px;
          cursor: move;
        }
        > div:nth-child(2) {
          border-top: 1px solid #ccc;
          padding: 20px;
          > div:nth-child(1) {
            > div:nth-child(1) {
              span:nth-child(1) {
                color: red;
              }
              span:nth-child(2) {
                color: #aaa;
              }
            }
            > div:nth-child(2) {
              margin-top: 14px;
              .el-input__inner {
                height: 36px;
                line-height: 36px;
                font-size: 16px;
              }
            }
          }
          > div:nth-child(2) {
            height: 306px;
            overflow-y: auto;
            margin: 30px 0 24px 0;
            border: 1px solid #e2e2e2;
            background: #fff;
            > div:nth-child(1) {
              padding: 10px;
              textarea {
                width: 100%;
                height: 180px;
                resize: none;
                outline: none;
                border: 0;
                background: #fff;
                font-size: 15px;
                color: #333;
              }
            }
            > div:nth-child(2) {
              display: flex;
              justify-content: space-between;
              padding: 10px;
              > div:nth-child(2) {
                width: 330px;
                height: 82px;
                display: flex;
                overflow: hidden;
                overflow-x: auto;
                > div {
                  background: #eee;
                  margin: 0 2px 2px 0;
                  float: left;
                  img {
                    width: 80px;
                    height: 80px;
                    border: 1px solid #ccc;
                  }
                  &:hover .file-remove {
                    display: block;
                  }
                  .file-remove {
                    display: none;
                    position: relative;
                    width: 0;
                    height: 0;
                    > div {
                      position: absolute;
                      top: -82px;
                      left: 62px;
                      border-radius: 50%;
                      width: 20px;
                      height: 20px;
                      line-height: 18px;
                      text-align: center;
                      color: #fff;
                      transform: rotate(45deg);
                      background: red;
                    }
                  }
                }
              }
              > div:nth-child(1) {
                width: 82px;
                height: 82px;
                margin-right: 2px;
                img {
                  width: 100%;
                }
              }
            }
          }
          > div:nth-child(3),
          > div:nth-child(4) {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          > div:nth-child(4) {
            margin-top: 20px;
          }
        }
        .notice-box-send {
          position: absolute;
          left: 20px;
          bottom: 20px;
          width: 436px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          background: #3b9cf8;
          color: #fff;
          border-radius: 4px;
          transition: 0.2s;
          cursor: pointer;
          &:hover {
            opacity: 0.9;
          }
        }
      }
    }
    .firendInfo {
      .el-dialog__header {
        padding: 0;
      }
      .el-dialog {
        width: 350px;
      }
      .el-dialog__headerbtn {
        display: none;
      }
      .el-dialog__body {
        padding: 0;
      }
      .firendInfo-box {
        &:hover .fx_rel > div {
          display: block;
          background: rgba(243, 243, 243, 0.8);
        }
        font-size: 16px;
        color: #333;
        user-select: text;
        padding: 20px;
        span {
          color: #999;
          margin-right: 20px;
          font-size: 15px;
          user-select: none;
        }
        > div:nth-child(1) {
          display: flex;
          align-items: center;
          padding-bottom: 15px;
          border-bottom: 1px solid #ddd;
          > div:nth-child(1) {
            img {
              width: 80px;
              height: 80px;
              border-radius: 4px;
            }
          }
          > div:nth-child(2) {
            > div:nth-child(1) {
              font-size: 18px;
            }
            height: 80px;
            margin-left: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        }
        > div:nth-child(2),
        > div:nth-child(3),
        > div:nth-child(4) {
          font-size: 14px;
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }
        .fx_rel {
          position: relative;
          width: 0;
          height: 0;
          > div {
            display: none;
            position: absolute;
            top: -26px;
            left: -20px;
            width: 350px;
            height: 46px;
            line-height: 46px;
            text-align: center;
            color: red;
            cursor: pointer;
            &:hover {
              color: rgba(255, 0, 0, 0.8);
            }
          }
        }
      }
    }
    .itemInfo {
      .el-dialog__header {
        padding: 0;
      }
      .el-dialog {
        width: 350px;
      }
      .el-dialog__headerbtn {
        display: none;
      }
      .el-dialog__body {
        padding: 0;
      }
      .itemInfo-box {
        font-size: 16px;
        color: #333;
        user-select: text;
        > div:nth-child(1) {
          padding: 12px;
          // border-bottom: 1px solid #ccc;
          text-align: right;
          img {
            cursor: pointer;
            &:hover {
              opacity: 0.7;
            }
          }
          img:nth-child(2) {
            margin-left: 20px;
          }
        }
        .itemInfoList {
          margin: 0 12px;
          background: #f9f9f9;
          display: flex;
          justify-content: start;
          flex-wrap: wrap;
          height: 200px;
          overflow-y: auto;
          > div {
            margin: 14px 6px 0 12px;
            // height: 65px;
            > div:nth-child(1) {
              img {
                width: 42px;
                height: 42px;
                border-radius: 4px;
              }
            }
            > div:nth-child(2) {
              font-size: 12px;
              text-align: center;
              width: 42px;
            }
          }
          .removeFirend {
            position: relative;
            width: 0;
            height: 0;
            div {
              z-index: 999;
              position: absolute;
              top: -70px;
              left: 30px;
              background: red;
              width: 15px;
              height: 15px;
              line-height: 12.5px;
              text-align: center;
              color: #fff;
              border-radius: 50%;
              cursor: pointer;
            }
          }
        }
        > div:nth-child(3),
        > div:nth-child(4) {
          > div {
            cursor: pointer;
            transition: all 0.2s;
            &:hover {
              color: #3b9cf8;
            }
          }
        }
        > div:nth-child(3),
        > div:nth-child(4),
        > div:nth-child(5),
        > div:nth-child(6),
        > div:nth-child(7),
        > div:nth-child(8) {
          height: 25px;
          font-size: 14px;
          span {
            color: #999;
          }
          margin: 10px 24px 0 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        > div:nth-child(5) {
          img {
            width: 25px;
            height: 25px;
          }
        }
        > div:nth-child(9) {
          margin-top: 26px;
          border-top: 1px solid #ddd;
          text-align: center;
          color: red;
          height: 52px;
          line-height: 52px;
          span {
            cursor: pointer;
            &:hover {
              opacity: 0.7;
            }
          }
        }
        .editMyItemName {
          .el-input__inner {
            height: 25px;
            line-height: 25px;
            width: 150px;
          }
        }
      }
    }
    .itemInfoAdd {
      .el-dialog__header {
        padding: 0;
      }
      .el-dialog {
        width: 350px;
      }
      .el-dialog__headerbtn {
        display: none;
      }
      .el-dialog__body {
        padding: 0;
      }
      .itemInfoAdd-box {
        > div:nth-child(1) {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #36465f;
          color: #fff;
          padding: 0 15px;
          height: 36px;
          border-radius: 4px 4px 0 0;
          img {
            margin-right: 5px;
          }
          > div:nth-child(2) {
            border: 1px solid #fff;
            width: 20px;
            height: 20px;
            line-height: 17px;
            text-align: center;
            border-radius: 50%;
            cursor: pointer;
            &:hover {
              opacity: 0.7;
            }
          }
        }
        > div:nth-child(2) {
          user-select: text;
          padding: 20px 0;
          .el-input {
            margin-left: 15px;
          }
          input {
            outline: none;
            width: 310px;
            padding-left: 30px;
          }
        }
        > div:nth-child(3) {
          height: 500px;
          overflow-y: auto;
          > div {
            > div {
              display: flex;
              padding: 5px 20px;
              img {
                width: 42px;
                height: 42px;
                border-radius: 4px;
              }
              > div:nth-child(2) {
                margin-left: 20px;
                display: flex;
                flex: 1;
                justify-content: space-between;
                align-items: center;
              }
            }
            > div:nth-child(1) {
              background: #ddd;
              font-size: 16px;
              padding: 5px 20px;
            }
          }
        }
      }
    }
  }
}

.createItem {
  .el-dropdown-menu__item {
    color: #333 !important;
  }
  li {
    div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 10px;
      span {
        margin-left: 8px;
      }
    }
  }
  > div {
    cursor: pointer;
    padding: 0 20px;
    > div {
      padding: 10px 0;
      img {
        margin-right: 10px;
      }
    }
    &:hover {
      background: #ddd;
      // color: #3B9CF8
    }
  }
  > div:nth-child(1) {
    > div {
      border-bottom: 1px solid #ccc;
    }
  }
}
.addRel_div {
  z-index: 1;
  position: relative;
  width: 0;
  height: 0;
  .addRel_item {
    position: absolute;
    top: 15px;
    left: -130px;
    width: 378px;
    height: 168px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    > div:nth-child(1) {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #36465f;
      color: #fff;
      padding: 0 15px;
      height: 36px;
      border-radius: 4px 4px 0 0;
      img {
        margin-right: 5px;
      }
      > div:nth-child(2) {
        border: 1px solid #fff;
        width: 20px;
        height: 20px;
        line-height: 17px;
        text-align: center;
        border-radius: 50%;
        cursor: pointer;
        &:hover {
          opacity: 0.7;
        }
      }
    }
    > div:nth-child(2) {
      user-select: text;
      text-align: center;
      margin: 20px 0;
      input {
        width: 350px;
        padding-left: 14px;
      }
    }
    > div:nth-child(3) {
      // text-align: right;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 15px;
      > span {
        color: #999;
        font-size: 14px;
      }
    }
  }
  .addRel_firend {
    position: absolute;
    top: 15px;
    left: -130px;
    width: 378px;
    height: 500px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    > div:nth-child(1) {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #36465f;
      color: #fff;
      padding: 0 15px;
      height: 36px;
      border-radius: 4px 4px 0 0;
      img {
        margin-right: 5px;
      }
      > div:nth-child(2) {
        border: 1px solid #fff;
        width: 20px;
        height: 20px;
        line-height: 17px;
        text-align: center;
        border-radius: 50%;
        cursor: pointer;
        &:hover {
          opacity: 0.7;
        }
      }
    }
    > div:nth-child(2) {
      user-select: text;
      text-align: center;
      margin: 20px 0;
      input {
        width: 350px;
        padding-left: 14px;
      }
    }
    .createFirendSearch {
      display: flex;
      justify-content: space-around;
      .el-input {
        margin-left: 15px;
      }
      input {
        display: flex;
        padding-left: 35px !important;
        // width: 250px !important;
        padding-left: 14px;
      }
    }
    .createFirendList {
      height: 384px;
      overflow-y: auto;
      border-radius: 0 0 4px 4px;
      .titleTop {
        text-align: center;
        color: #999;
      }
      .firendItem {
        &:hover {
          background: #ddd;
        }
        padding: 15px 0 15px 20px;
        display: flex;
        // align-items: center;
        > div:nth-child(1) {
          cursor: pointer;
          img {
            width: 42px;
            height: 42px;
            border-radius: 2px;
          }
        }
        > div:nth-child(2) {
          margin-left: 20px;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #ddd;
          padding-bottom: 10px;
          span {
            cursor: pointer;
          }
          .el-button {
            margin-right: 15px;
          }
        }
      }
    }
  }
}

.nav-active {
  color: #333;
}
.item-cative {
  background: #efefef !important;
}
.item-cative1 {
  background: #e2e2e2 !important;
}
.lengthd {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rel_newMsg {
  position: relative;
  width: 0;
  height: 0;
  .el-badge {
    top: -55px;
    left: 27px;
  }
}
.nav_rel {
  position: relative;
  width: 0;
  height: 0;
  .el-badge {
    top: -23px;
    left: -10px;
  }
}
.cur {
  cursor: pointer;
  transition: 0.1s;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 1;
  }
}
.el-table .warning-row {
  color: #ccc !important;
}
.anlig-c {
  text-align: center;
  color: #ccc;
  cursor: default !important;
  margin-top: 20px;
}
.iconExpressionbtn1 {
  display: flex;
  flex-wrap: wrap;
  width: 300px;
  > div {
    cursor: pointer;
    width: 23px;
    height: 23px;
    &:hover {
      background: #666;
    }
  }
}
.iconExpressionbtn {
  display: flex;
  flex-wrap: wrap;
  width: 300px;
  height: 200px;
  overflow-y: auto;
  > div {
    // background: url(https://anygo-imag.oss-cn-beijing.aliyuncs.com/webImg/emoji.png);
    // background-position: 60px 80px;
    cursor: pointer;
    width: 20px;
    height: 20px;
    border: 1px solid #fff;
    &:hover {
      border-color: #ccc;
    }
  }
}
ul {
  .el-dropdown-menu__item {
    border-bottom: 1px solid #ccc;
  }
  .el-dropdown-menu__item:last-child {
    border-bottom: 0;
  }
}
.zzd {
  overflow: hidden;
  display: flex;
  align-items: center;
  // flex-wrap: wrap;
}
.AltBox {
  position: relative;
  width: 0;
  height: 0;
  > div {
    position: absolute;
    left: 10px;
    top: -100px;
    border: 1px solid #aaa;
    width: 120px;
    height: 100px;
    overflow-y: auto;
    background: #fff;
    cursor: pointer;
    > div {
      display: flex;
      &:hover {
        background: #ccc;
      }
    }
    img {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
