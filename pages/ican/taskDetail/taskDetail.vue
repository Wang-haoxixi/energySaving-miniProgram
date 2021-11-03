<template>
	<view class="container">
		<view class="contentWrap">
			<view class="personInfo flexRowStart" @tap="goPresonInfo">
				<image v-if="list.publisherAvatar" :src="imageError(list.publisherAvatar,$oss)" mode="" style="width: 76rpx;height: 76rpx;border-radius: 50%;margin-right: 24rpx;"></image>
				<view class="flexRow" style="flex: 1">
					<view class="flexColumnStart" style="flex: 1;min-width: 0;">
						<view class="" style="margin-bottom: 4rpx;color: #272727;font-size: 32rpx;line-height: 44rpx;">
							{{$isEmpty(list.publisherRealName)?'':list.publisherRealName}}
						</view>
						<view class="" style="padding: 2rpx 16rpx; color: #FFFFFF; border-radius: 32rpx;background: linear-gradient(90deg, #5EE5BB 0%, #29C998 100%);font-size: 22rpx;line-height: 32rpx;font-weight: bold;">
							<text style="margin-right: 8rpx;">信用值</text>{{$isEmpty(list.publisherCredit)?'0':list.publisherCredit}}
						</view>
					</view>
					<image :src="$ossUrl('home_arrowright.png')" mode="" style="width: 14rpx;height: 40rpx;"></image>
				</view>
			</view>
			<view class="officialImg" v-if="list.isOfficial==1">
				<image v-if="oss" class="img" :src="oss+'icon_find_magicBox_official.png'" mode="aspectFit"></image>
			</view>
			<view class="flexRow wrapTitle">
				<view class=" bold title">
					{{$isEmpty(list.title)?'':list.title}}
				</view>
			</view>
			<view class="flexRow wrapFinishTime" v-if="list.type==0">
				<view class="" style="color: #9AA1A7;">
					截止时间:{{$isEmpty(finishTime)?'':finishTime}}
				</view>
				<view v-if="list.state==1 && list.taskState==0 && list.surplusTime==0" class="color_F74437">
					任务已过期
				</view>
				<view v-else-if="list.taskState==0 && list.surplusTime!=0&& surplusTime!=''" style="color: #57DBB1;">
					还剩<text v-if="surplusTime.day!=''">{{$isEmpty(surplusTime.day)?'0':surplusTime.day}}天</text><text v-if="surplusTime.hour!=''">{{$isEmpty(surplusTime.hour)?'0':surplusTime.hour}}小时</text><text
					 v-if="surplusTime.min!=''">{{$isEmpty(surplusTime.min)?'0':surplusTime.min}}分钟</text>
				</view>
			</view>
			<view class="wrapRepeatTime" v-else>
				<view class="color_919397 repeatTime">
					已重复{{$isEmpty(list.repeatTime)?'0':list.repeatTime}}次
				</view>
			</view>
			<view class="flexRow wrapPlan">
				<view class="flexRowStart orgInfo">
					<image v-if="oss" class="img" :src="$ossUrl('createTask_addSo.png')" mode=""></image>
					<view class=" singleEllipsis orgName">
						{{$isEmpty(list.orgName)?'':list.orgName}}
					</view>
				</view>
				<view class="plan">
					当前进度:{{$isEmpty(list.plan)?'0':list.plan}}%
				</view>
			</view>
			<view class="flexRow wrapMember" @tap="goTaskMember(list)">
				<view class="flexRowStart memberList" style="flex: 1;">
					<image v-if="oss" class="img" :src="$ossUrl('createTask_addMember.png')" mode=""></image>
					<view class="flexRow" style="flex: 1;">
						<view class="flexRowStart memberListAvatar" style="flex: 1;">
							<image class="avatarImg" v-for="(item,index) of list.cooperationTaskUserVOList" :key="index" :src="item.avatar"
							 mode="aspectFill"></image>
						</view>
						<view class="">
							<text v-if="list.countNum<=5" class="" style="color: #565B5F;font-size: 28rpx;line-height: 40rpx;">{{$isEmpty(list.countNum)?'0':list.countNum}}人</text>
							<text v-else style="color: #565B5F;font-size: 28rpx;line-height: 40rpx;">等{{$isEmpty(list.countNum)?'0':list.countNum}}人</text>
						</view>
					</view>
				</view>
				<view class="goMemberDetails">
					<image v-if="oss" class="img" :src="oss+'icon_right_gray.png'"></image>
				</view>
			</view>
			<view class="flexRow wrapUrgency">
				<image v-if="oss" class="img" :src="$ossUrl('createTask_urgency.png')"></image>
				<view class="flexRow urgencyStatus">
					<text class="urgencyStatusInfo">紧急度</text>
					<view class="uni-input  urgency">
						<text v-if="list.urgency==0">一般</text>
						<text v-else-if="list.urgency==1">紧急</text>
						<text v-else>非常紧急</text>
					</view>
				</view>
			</view>
			<view class="flexRow wrapUrgency">
				<image v-if="oss" class="img" :src="$ossUrl('createTask_award.png')"></image>
				<view class="flexRow urgencyStatus">
					<view class="flexRowStart">
						<view class="urgencyStatusInfo">奖励分配</view>
						<view class="color_2F80FF questionMark" @tap.stop="showMessage">
							?
						</view>
					</view>
					<view class="uni-input urgency">
						<text v-if="list.allocationType==0">不设置奖励</text>
						<text v-else-if="list.allocationType==1">手动分配</text>
						<text v-else-if="list.allocationType==2">平均分配{{$isEmpty(list.allocationAmount)?'':list.allocationAmount}}贝</text>
					</view>
				</view>
			</view>
			<view class="wrapRelation" v-show="list.material.length!=0">
				<view class="flexRow relation">
					<image v-if="oss" class="img" :src="$ossUrl('createTask_relation.png')" mode="aspectFit"></image>
					<view class=" flexRow addRelation">
						<text>添加关联</text>
					</view>
				</view>
				<view class="flexRow relationList" v-for="(item,index) of list.material" :key="index" @tap="goDetail(item)">
					<view class="" style="width: 8rpx;height: 8rpx;background: #5F5F5F;border-radius: 50%;margin-right: 16rpx;">
						
					</view>
					<view class="singleEllipsis relationName">
						·{{$isEmpty(item.name)&&$isEmpty(item.materialName)?'':item.name || item.materialName}}
					</view>
					<image v-if="oss" class="img" :src="oss+'icon_createTask_grayRight.png'" mode="aspectFit"></image>
				</view>
			</view>
			<view class="wrapRemark">
				<view class="flexRowStart remarkInfo">
					<image v-if="oss" class="img" :src="$ossUrl('createTask_description.png')" mode="aspectFit"></image>
					<view class="remark">
						任务详情
					</view>
				</view>
				<view class=" remarkTitle">
					<view v-if="list.description" class="description">
						{{$isEmpty(list.description)?'':list.description}}
					</view>
					<view class="description" v-else>
						暂无
					</view>
				</view>
			</view>
			<view class="commentList" v-for="(item,index) of commentList" :key="item.id" @tap.stop="goCommentDetail(item)">
				<view class="flexRowStart">
					<view class="commentMember">
						<image class="img" :src="imageError(item.avatar,$oss)" mode="aspectFill" @tap.stop="goCannerCard(item)"></image>
					</view>
					<view class="" style="flex:1;">
						<view class="color_303031 bold commentInfoName">
							{{$isEmpty(item.name)?'':item.name}}
						</view>
						<view class="color_BABEC0 createTime">
							{{$isEmpty(item.createTime)?'':item.createTime.substring(0,16)}}
						</view>
					</view>
				</view>
				<view class="color_303031 commentInfocontent">
					{{$isEmpty(item.content)?'':item.content}}
				</view>
				<view class="commentInfo">
					<view class="flexRow commentCreateTime">
						<view class="flexRowStart addcomment" @tap.stop="reply('forward',0,0,item)">
							<image v-if="oss" class="img" :src="oss+'thought_comment.png'" mode="aspectFit"></image>
							<text>评论</text>
						</view>
					</view>
					<view class="wrapReply" v-if="item.reply">
						<view class="replyList" v-for="(items,index) of item.reply.records" :key="index" @tap.stop="replyPerson(items)">
							<text class="color_2F80FF">{{$isEmpty(items.createName)?'':items.createName}}</text> <text class="color_666769">回复</text> <text class="color_2F80FF">{{$isEmpty(items.replyName)?'':items.replyName}}:</text><text
							 class="color_666769 txt">{{$isEmpty(items.content)?'':items.content}}</text>
						</view>
						<view v-if="item.reply.records.length>=10" class="color_2F80FF replyMore" @tap.stop="goCommentDetail(item)">
							查看全部{{item.reply.total}}条回复 >
						</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="commentStatus" v-if="commentList.length!=0"></uni-load-more>
			<view class="bottom-safe" style="height: 112rpx;"></view>
		</view>
		<view v-if="isLogin==true && list.authority==1" class="btns">
			<view class="flexRow wrapBtns">
				<view class="commentBtn flexColumn" @tap.stop="actionsShow">
					<image v-if="oss" :src="oss+'icon_taskDetails_taskActions.png'" class="taskActionsImg"></image>
					<text class="taskActionsItem">更多</text>
				</view>
				<view class="commentBtn flexColumn" @tap="comment('forward',0,0)">
					<image v-if="oss" :src="oss+'thought_comment.png'" class="taskActionsImg"></image>
					<text class="taskActionsItem">评论</text>
				</view>
				<button class="btn" open-type="share">
					分享
				</button>
				<view v-if="list.taskState!=2 && list.state==1" class="button doComplete" @click="completeTask()">确认完成</view>
				<view v-else-if="list.allocationStatus!=1 && (list.state==2 || list.taskState==1)" class="button completed">已完成</view>
				<view v-else-if="list.allocationStatus==1 && userId != list.publisher && (list.state==2 || list.taskState==1)" class="button completed">已完成</view>
				<view v-else-if="list.allocationStatus==1 && userId == list.publisher && (list.state==2 || list.taskState==1) && list.cooperationTaskUserVOList.length==1" class="button completed" @tap="confirmAllocation">已完成</view>
				<view v-else-if="list.allocationStatus==1 && userId == list.publisher && (list.state==2 || list.taskState==1) && list.cooperationTaskUserVOList.length>1" class="button doComplete" @tap="confirmAllocation">去分配</view>
				<view v-else-if="list.state==4 || list.taskState==2" class=" button closed">已关闭</view>
			</view>
		</view>
		<view v-else-if="isLogin==true && list.soMember==false && list.taskState==0" class="btns">
			<view class="flexRow wrapBtns">
				<view class="joinTask" @tap="joinTask()">
					加入任务
				</view>
			</view>
		</view>
		<view v-else-if="isLogin==true && list.soMember==true && list.taskState==0" class="btns">
			<view class="flexRow wrapBtns">
				<view class="commentBtn flexColumn" @tap="comment('forward',0,0)">
					<image v-if="oss" :src="oss+'thought_comment.png'" mode="" class="taskActionsImg"></image>
					<text style="font-size: 18rpx;line-height: 26rpx;">评论</text>
				</view>
				<view class="button  joinTask" @tap="joinTask()">
					加入任务
				</view>
			</view>
		</view>
		<view v-else-if="isLogin==false && taskId!=0" class="btns">
			<view class="flexRow wrapBtns">
				<view class="button  joinTask" @tap="joinTask()">
					加入任务
				</view>
			</view>
		</view>
		<!-- 假数据任务 -->
		<view v-else-if="isLogin==false && taskId==0" class="btns">
			<view class="flexRow wrapBtns">
				<view class="commentBtn flexColumn" @tap="comment('forward',0,0)">
					<image v-if="oss" :src="oss+'thought_comment.png'" mode="" class="taskActionsImg"></image>
					<text style="font-size: 18rpx;line-height: 26rpx;">评论</text>
				</view>
				<view class="completeTask" @tap="completeTask()">确认完成</view>
			</view>
		</view>
		<view class="btns" v-else>
			<view class="flexRow wrapBtns">
				<view class="joinTask" @tap="comment('forward',0,0)">评论</view>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="popup_input">
				<textarea :placeholder="placeholder" placeholder-class="inputDefault" v-model="input" maxlength="250" fixed="true"
				 adjust-position="true" show-confirm-bar="false" cursor-spacing="80"></textarea>
				<view class="sendBtn" v-if="input.length>0" @tap="sendInput">发送</view>
				<view class="notSendBtn" v-else>发送</view>
			</view>
		</uni-popup>
		<uni-popup ref="allocationDialog" type="bottom">
			<view class="popDialog">
				<view class="color_666769 message">
					是否确认完成任务并进行奖励分配
				</view>
				<view class="flexRow">
					<view class="button noRepeat" @tap="cancelAllocation">
						取消
					</view>
					<view class="button repeatNow" @tap="confirmAllocation">
						确定
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="completeDialog" type="bottom">
			<view class="popDialog">
				<view class="color_303031 bold title">
					提示
				</view>
				<view class="color_666769 message">
					当前任务正处于奖励分配状态已被系统锁定，无法进行确认完成操作，请稍后再试
				</view>
				<view class="flexRow">
					<view class="button" style="flex: 1;" @tap="completeDialogHide">
						确定
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- 接口返回了信息，弹窗可以取消掉 -->
		<!-- <uni-popup ref="editDialog" type="bottom">
			<view class="popDialog">
				<view class="color_303031 bold title">
					提示
				</view>
				<view class="color_666769 message">
					当前任务尚存在未分配完成的奖励，无法关闭/删除
				</view>
				<view class="flexRow">
					<view class="button" style="flex: 1;" @tap="editDialogHide">
						确定
					</view>
				</view>
			</view>
		</uni-popup> -->
		<uni-popup ref="dialog" type="bottom">
			<view class="popDialog">
				<view class="color_666769 message">
					是否完成重复任务
				</view>
				<view class="flexRow">
					<view class="button noRepeat" @tap="repeatNoMore">
						不再重复
					</view>
					<view class="button repeatNow" @tap="repeatNowTime">
						完成本次
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="actions" type="bottom">
			<view class="actions">
				<view class="" v-if="list.publisher!=userId">
					<view class="color_666769 bold actionsList" @tap="quitTask">
						<view class="flexColumn actionItem">
							<image class="actionImg" v-if="oss" :src="oss+'icon_taskDetails_quitAction.png'"></image>
							<text>退出</text>
						</view>
					</view>
				</view>
				<view class="" v-else>
					<view class="color_666769 bold actionsList" v-if="list.taskState==2">
						<!-- <view class="flexColumn actionItem" @tap="editTask">
							<image v-if="oss" class="actionImg" :src="oss+'icon_taskDetails_editAction.png'"></image>
							<text>编辑</text>
						</view> -->
						<!-- <view class="flexColumn actionItem" @tap="scanTask">
							<image v-if="oss" class="actionImg" :src="oss+'icon_taskDetails_scanAction.png'"></image>
							<text>二维码</text>
						</view> -->
						<view class="flexColumn actionItem" @tap="deleteTask">
							<image v-if="oss" class="actionImg" :src="oss+'icon_taskDetails_deleteAction.png'"></image>
							<text>删除</text>
						</view>
						<view class="flexColumn actionItem" @tap="restartTask">
							<image v-if="oss" class="actionImg" :src="oss+'icon_taskDetails_restartAction.png'"></image>
							<text>重启</text>
						</view>
					</view>
					<view class="color_666769 bold actionsList" v-else-if="list.taskState==1 || list.state==2">
						<!-- <view class="flexColumn actionItem" @tap="editTask">
							<image v-if="oss" :src="oss+'icon_taskDetails_editAction.png'" class="actionImg"></image>
							<text>编辑</text>
						</view> -->
						<!-- <view class="flexColumn actionItem" @tap="scanTask">
							<image v-if="oss" :src="oss+'icon_taskDetails_scanAction.png'" class="actionImg"></image>
							<text>二维码</text>
						</view> -->
						<view class="flexColumn actionItem" @tap="closeTask">
							<image class="actionImg" v-if="oss" :src="oss+'icon_taskDetails_closeAction.png'"></image>
							<text>关闭</text>
						</view>
						<view class="flexColumn actionItem" @tap="deleteTask">
							<image class="actionImg" v-if="oss" :src="oss+'icon_taskDetails_deleteAction.png'"></image>
							<text>删除</text>
						</view>
					</view>
					<view class="color_666769 bold actionsList" v-else-if="list.taskState==0 && list.state==1">
						<view class="flexColumn actionItem" @tap="editTask">
							<image class="actionImg" v-if="oss" :src="oss+'icon_taskDetails_editAction.png'"></image>
							<text>编辑</text>
						</view>
						<view class="flexColumn actionItem" @tap="scanTask">							
							<image class="actionImg"  v-if="oss" :src="oss+'icon_taskDetails_scanAction.png'"></image>
							<text>二维码</text>
						</view>
						<view class="flexColumn actionItem" v-if="list.isWorkshop==0 && list.admin == true" @tap="shopTask">
							<image class="actionImg" v-if="oss" :src="oss+'icon_taskDetails_shopAction.png'"></image>
							<text>同步至工场</text>
						</view>
						<view class="flexColumn actionItem" @tap="closeTask">
							<image class="actionImg" v-if="oss" :src="oss+'icon_taskDetails_closeAction.png'"></image>
							<text>关闭</text>
						</view>
						<view class="flexColumn actionItem" @tap="deleteTask">
							<image class="actionImg" v-if="oss" :src="oss+'icon_taskDetails_deleteAction.png'"></image>
							<text>删除</text>
						</view>
					</view>
				</view>
				<view class="button cancelAction" @tap="cancelActions">
					取消
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="message" type="center">
			<view class="messageDialog flexColumn">
				<image v-if="oss" :src="oss+'pic_exclamation.png'" mode="aspectFit" style="width: 160rpx;height: 160rpx;margin-top: 16rpx;"></image>
				<view class="color_303031 bold messageTitle">
					风险提示
				</view>
				<view class="color_666769" style="font-size: 28rpx;line-height: 52rpx;margin: 48rpx 0;">
					<view class="">
						1、该奖励任务以个人名义进行发布，加入任务时请注意规避风险；
					</view>
					<view class="">
						2、若后续对分配的奖励有异议，建议直接与任务发布人联系；
					</view>
				</view>
				<view class="button knowBtn" style="width: 494rpx;" @tap="hideMessage">
					我知道了
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import {
		isEmpty,
		imageError
	} from '@/common/utils.js';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				list: {},
				taskId: '',
				status: 1,
				completeStatus: 0,
				deadline: '',
				commentStatus: 'more',
				commentInfo: '',
				commentList: [],
				isLogin: false,
				input: '',
				placeholder: '请输入申请理由',
				commentId: '',
				finishTime: '',
				surplusTime: '',
				timer: '',
				oss: '',
				userId: ''
			}
		},
		onLoad(options) {
			const {
				taskId
			} = options
			this.oss = this.$oss
			this.taskId = taskId
			this.userId = uni.getStorageSync('userinfo').user_id
			// console.log(this.taskId)
			// console.log(taskId)
			let url = 'qms/cooperation_list/select_detail';
			if (taskId == 0) {
				url = 'qms/cooperation_list/select_detail_appletr'
			}
			this.$http.get(url, {
					params: {
						taskId: taskId
					}
				})
				.then(res => {
					// console.log(res)
					if (res.data.code == 1) {
						uni.showToast({
							title: res.data.message,
							icon: "none",
							duration: 1000,
							success: () => {
								setTimeout(() => {
									uni.navigateBack({
										delta: 1
									})
								}, 1000)
							}
						})
					} else {
						this.list = res.data.data
						var index = this.list.finishTime.lastIndexOf(":");
						this.finishTime = this.list.finishTime.substring(0, index)
					}
				})
			if (taskId != 0) {
				this.$http.get('qms/cooperation_comment/select', {
					params: {
						taskId: taskId
					}
				}).then(res => {
					// console.log(res)
					this.commentInfo = res.data.data
					this.commentList = res.data.data.records
					if (this.commentInfo.current == this.commentInfo.pages) {
						this.commentStatus = 'noMore';
					} else if (this.commentInfo.pages == 0) {
						this.commentStatus = 'noMore';
					}
				})
			}
		},
		onShow() {
			this.isLogin = !isEmpty(uni.getStorageSync('token'));
			let url = 'qms/cooperation_list/select_detail';
			if (this.taskId == 0) {
				url = 'qms/cooperation_list/select_detail_appletr'
			}
			this.$http.get(url, {
					params: {
						taskId: this.taskId
					}
				})
				.then(res => {
					// console.log(res)
					this.list = res.data.data
					if (this.list.surplusTime > 0) {
						// this.timeStamp(this.list.surplusTime)
						// this.timer=setInterval(()=>{
						// 	this.timeStamp(this.list.surplusTime--)
						// },3000)
						this.timeStamp(this.list.surplusTime)
						this.timer = setInterval(() => {
							if (this.list.surplusTime == 0) {
								clearInterval(this.timer)
							} else {
								this.timeStamp(this.list.surplusTime--)
							}
						}, 1000)
					}
				})
			if (this.taskId != 0) {
				this.$http.get('qms/cooperation_comment/select', {
					params: {
						taskId: this.taskId
					}
				}).then(res => {
					// console.log(res)
					this.commentInfo = res.data.data
					this.commentList = res.data.data.records
					if (this.commentInfo.current == this.commentInfo.pages) {
						this.commentStatus = 'noMore';
					} else if (this.commentInfo.pages == 0) {
						this.commentStatus = 'noMore';
					}
				})
			}
		},
		onUnload() {
			clearInterval(this.timer)
		},
		onReachBottom() {
			// console.log(666)
			let that = this;
			if (that.commentInfo.current < that.commentInfo.pages) {
				// console.log(6)
				that.commentStatus = 'loading';
				that.$http.get('qms/cooperation_comment/select', {
					params: {
						taskId: that.taskId,
						current: that.commentInfo.current + 1
					}
				}).then(res => {
					// console.log(res)
					that.commentInfo.current = res.data.data.current;
					// console.log(that.joinCurrent)
					that.commentList = that.commentList.concat(res.data.data.records);
					that.commentStatus = 'more';
				});
			} else {
				// console.log(9)
				that.commentStatus = 'noMore';
			}
		},
		onShareAppMessage(res) {
			this.$http.post('admin/mark/save', {
				section: 'task', //板块
				relationId: this.taskId,
				// #ifdef  MP-WEIXIN
				markSource: 'wechat', //留痕来源
				// #endif
				// #ifdef  MP-QQ
				markSource: 'qq',
				// #endif
				markTarget: 'wechat', //留痕目标
				markType: 'share', //留痕类型
				remark: '',
			}).then(res => {
				console.log(res)
			});
			if (res.from === 'button') { // 来自页面内分享按钮
				// console.log(res.target)
			}
			return {
				title: '我分享了【' + this.list.title + '】任务，快去看看吧',
				path: '/pages/ican/taskDetail/taskDetail?taskId=' + this.taskId
			}
		},
		onShareTimeline(res) {
			this.$http.post('admin/mark/save', {
				section: 'task', //板块
				relationId: this.taskId,
				// #ifdef  MP-WEIXIN
				markSource: 'wechat', //留痕来源
				// #endif
				// #ifdef  MP-QQ
				markSource: 'qq',
				// #endif
				markTarget: 'moments', //留痕目标
				markType: 'share', //留痕类型
				remark: '',
			}).then(res => {
				console.log(res)
			});
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '我分享了【' + this.list.title + '】任务，快去看看吧',
			}
		},
		methods: {
			imageError,
			goPresonInfo(){
				uni.navigateTo({
					url: `/pages/find/cannerCard/cannerCard?id=${this.list.publisher}`
				})
			},
			showMessage(){
				this.$refs.message.open()
			},
			hideMessage(){
				this.$refs.message.close()
			},
			completeDialogHide(){
				this.$refs.completeDialog.close()
			},
			editDialogHide(){
				this.$refs.editDialog.close()
			},
			cancelAllocation(){
				this.$refs.allocationDialog.close()
			},
			confirmAllocation(){
				if(this.list.allocationStatus==1){
					uni.navigateTo({
						url:`/pages/ican/taskDetail/manualAllocationList/manualAllocationList?taskId=${this.taskId}`
					})
				}else {
					this.$http.post('qms/cooperation_task/operation', {
						type: 1,
						taskId: this.taskId,
						repeatType:1
					}).then(res => {
						// console.log(res)
						if (res.data.data == true) {
							let url = 'qms/cooperation_list/select_detail';
							if (this.taskId == 0) {
								url = 'qms/cooperation_list/select_detail_appletr'
							}
							this.$http.get(url, {
									params: {
										taskId: this.taskId
									}
								})
								.then(res => {
									// console.log(res)
									this.list = res.data.data
								})
							uni.showToast({
								title: '操作成功',
								duration: 1000,
								icon: 'success',
								success: () => {
									setTimeout(() => {
										this.$http.get('qms/cooperation_comment/select', {
											params: {
												taskId: this.taskId
											}
										}).then(res => {
											// console.log(res)
											this.commentInfo = res.data.data
											this.commentList = res.data.data.records
											if (this.commentInfo.current == this.commentInfo.pages) {
												this.commentStatus = 'noMore';
											} else if (this.commentInfo.pages == 0) {
												this.commentStatus = 'noMore';
											}
											uni.navigateTo({
												url:`/pages/ican/taskDetail/manualAllocationList/manualAllocationList?taskId=${this.taskId}`
											})
										})
									}, 1000)
								}
							})
						} else if (res.data.code == 1) {
							uni.showToast({
								title: `${res.data.message}`,
								duration: 2000,
								icon: "none"
							})
						}
					})
				}
				this.$refs.allocationDialog.close()
			},
			actionsShow() {
				this.$refs.actions.open()
			},
			cancelActions() {
				this.$refs.actions.close()
			},
			quitTask() {
				let id = ''
				let array = []
				this.$http.get('/qms/cooperation_task/task_user', {
						params: {
							taskId: this.taskId
						}
					})
					.then(res => {
						// console.log(res)
						let list = res.data.data
						array = list.filter(item => {
							return item.userId == this.userId
						})
						console.log(array)
						id = array[0].id
						this.$http.post(`qms/cooperation_task/exit_task?taskUserId=${id}`).then(res => {
							if (res.data.code == 0) {
								uni.showToast({
									title: "退出成功",
									icon: "none",
									success: () => {
										setTimeout(() => {
											uni.navigateBack({
												delta:1
											})
										}, 1000)
									}
								})
							} else {
								uni.showToast({
									title: res.data.message,
									icon: "none"
								})
							}
						})
					})
			},
			deleteTask() {
			
					this.$http.post('qms/cooperation_task/operation', {
						type: 2,
						taskId: this.taskId
					}).then(res => {
						// console.log(res)
						if (res.data.code == 0) {
							this.$refs.actions.close()
							uni.showToast({
								title: '删除成功',
								icon: 'none',
								success: () => {
									setTimeout(() => {
										uni.navigateBack({
											delta:1
										})
									}, 1000)
								}
							})
						} else if (res.data.code == 1) {
							uni.showToast({
								title: `${res.data.message}`,
								duration: 2000,
								icon: "none"
							})
						}
					})
				
			},
			closeTask() {
					this.$http.post('qms/cooperation_task/operation', {
						type: 3,
						taskId: this.taskId
					}).then(res => {
						// console.log(res)
						if (res.data.code == 0) {
							this.$refs.actions.close()
							uni.showToast({
								title: '关闭成功',
								icon: 'none',
								success: () => {
									setTimeout(() => {
										uni.navigateBack({
											delta:1
										})
									}, 1000)
								}
							})
						} else if (res.data.code == 1) {
							uni.showToast({
								title: `${res.data.message}`,
								duration: 2000,
								icon: "none"
							})
						}
					})
				
			},
			shopTask() {
				this.$http.post(`qms/cooperation_task/publish_workshop?taskId=${this.taskId}`).then(res => {
					if (res.data.code == 1) {
						uni.showToast({
							title: res.data.message,
							icon: "none"
						})
					} else {
						uni.showToast({
							title: "同步成功",
							icon: "none",
							duration: 1000,
							success: () => {
								this.$refs.actions.close()
							}
						})
					}
				})
			},
			restartTask() {
				let that = this
				that.$http.post('qms/cooperation_task/restart', {
					taskId: that.taskId
				}).then(res => {
					if (res.data.code == 0) {
						uni.showToast({
							title: "重启成功",
							icon: "none",
							success: () => {
								setTimeout(() => {
									let url = 'qms/cooperation_list/select_detail';
									that.$http.get(url, {
											params: {
												taskId: that.taskId
											}
										})
										.then(res => {
											// console.log(res)
											that.list = res.data.data
										})
									that.$http.get('qms/cooperation_comment/select', {
										params: {
											taskId: that.taskId
										}
									}).then(res => {
										// console.log(res)
										that.commentInfo = res.data.data
										that.commentList = res.data.data.records
										if (that.commentInfo.current == that.commentInfo.pages) {
											that.commentStatus = 'noMore';
										} else if (that.commentInfo.pages == 0) {
											that.commentStatus = 'noMore';
										}
									})
									this.$refs.actions.close()
								}, 1000)
							}
						})
					} else {
						uni.showToast({
							title: res.data.message,
							icon: "none"
						})
					}
				})
			},
			editTask() {
				uni.navigateTo({
					url: `/pages/ican/createTask/createTask?taskId=${this.taskId}&isAdmin=${this.list.isAdmin}`
				})
				uni.setStorageSync('editTask', this.list)
			},
			scanTask() {
				uni.navigateTo({
					url: `/pages/ican/taskDetail/taskScanCode/taskScanCode?id=${this.taskId}&avatar=${this.list.publisherAvatar}&name=${this.list.publisherRealName}`
				})
			},
			commentsOpen(type, commentId, reReplyId, info) {
				// console.log(info)
				this.input = ''
				this.$refs.popup.open()
			},
			comment(type, commentId, reReplyId, info) {
				// console.log(info)
				this.placeholder = "我来说两句"
				this.input = ''
				this.$refs.popup.open()
			},
			reply(type, commentId, reReplyId, info) {
				// console.log(info)
				this.placeholder = `回复@${info.name}`
				this.commentId = info.id
				this.input = ''
				this.$refs.popup.open()
			},
			replyPerson(info) {
				// console.log(info)
				this.placeholder = `回复@${info.createName}`
				this.commentId = info.id
				this.input = ''
				this.$refs.popup.open()
			},
			sendInput() {
				let that = this
				if (that.placeholder == "请输入申请理由") {
					that.$http.post('qms/cooperation_task/apply_join', {
						"applyReason": that.input,
						"taskId": that.taskId
					}).then(res => {
						// console.log(res)
						if (res.data.code == 0) {
							uni.showToast({
								title: '申请成功',
								icon: "success",
								duration: 1000,
								success: () => {
									that.input = ''
									that.$refs.popup.close()
								}
							})
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none",
								duration: 1000,
								success: () => {
									setTimeout(() => {
										that.input = ''
										that.$refs.popup.close()
									}, 1000)
								}
							})
						}
					})
				} else if (that.placeholder == "我来说两句") {
					that.$http.post('qms/cooperation_comment/publish', {
						content: that.input,
						taskId: that.taskId
					}).then(res => {
						// console.log(res)
						if (res.data.code == 0) {
							uni.showToast({
								title: "评论成功",
								icon: "success",
								duration: 1000,
								success: () => {
									setTimeout(() => {
										that.input = ''
										that.$refs.popup.close()
										that.$http.get('qms/cooperation_comment/select', {
											params: {
												taskId: that.taskId
											}
										}).then(res => {
											// console.log(res)
											that.commentInfo = res.data.data
											that.commentList = res.data.data.records
											if (that.commentInfo.current == that.commentInfo.pages) {
												that.commentStatus = 'noMore';
											} else if (that.commentInfo.pages == 0) {
												that.commentStatus = 'noMore';
											}else{
												that.commentStatus = 'more';
											}
										})
									}, 1000)
								}
							})
						}
					})
				} else if (this.placeholder.includes('回复')) {
					that.$http.post('qms/cooperation_comment/reply', {
						commentId: that.commentId,
						content: that.input
					}).then(res => {
						if (res.data.code == 0) {
							uni.showToast({
								title: "评论成功",
								icon: "success",
								duration: 1000,
								success: () => {
									setTimeout(() => {
										that.input = ''
										that.$refs.popup.close()
										that.$http.get('qms/cooperation_comment/select', {
											params: {
												taskId: that.taskId
											}
										}).then(res => {
											// console.log(res)
											that.commentInfo = res.data.data
											that.commentList = res.data.data.records
											if (that.commentInfo.current == that.commentInfo.pages) {
												that.commentStatus = 'noMore';
											} else if (that.commentInfo.pages == 0) {
												that.commentStatus = 'noMore';
											}else{
												that.commentStatus = 'more';
											}
										})
									}, 1000)
								}
							})
						}
					})
				}
			},
			goDetail(item) {
				if (item.type == 0) {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soMaterial/materialKind/materialDetails/materialDetails?id=${item.id}`
					})
				} else if (item.type == 1) {
					if (item.participate == 2) {
						let status = true
						uni.navigateTo({
							url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireDetails?id=${item.id}&status=${status}`
						})
					} else {
						uni.navigateTo({
							url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireDetails?id=${item.id}`
						})
					}
				} else if (item.type == 2) {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/soActivityDetails?id=${item.id}`
					})
				}
			},
			goCommentDetail(item) {
				uni.navigateTo({
					url: `/pages/ican/taskDetail/TaskCommentDetail/TaskCommentDetail?id=${item.id}`
				})
			},
			goTaskMember(list) {
				uni.navigateTo({
					url: `/pages/ican/taskDetail/taskMember/taskMember?taskId=${list.id}&publisher=${list.publisher}`
				})
			},
			completeTask() {
				let that = this
				if(that.list.allocationStatus == 1) {
					//任务处于锁定状态
					that.$refs.completeDialog.open()
				}else if(that.list.type != 0 && that.list.publisher==that.list.userId){
					that.$refs.dialog.open()
				}else if((that.list.allocationType==1) && that.list.publisher==that.list.userId && that.list.cooperationTaskUserVOList.length>1){
					// console.log(666)
					that.$refs.allocationDialog.open()
				}else{
					that.$http.post('qms/cooperation_task/operation', {
						type: 1,
						taskId: that.taskId,
						repeatType:1
					}).then(res => {
						// console.log(res)
						if (res.data.data == true) {
							let url = 'qms/cooperation_list/select_detail';
							if (that.taskId == 0) {
								url = 'qms/cooperation_list/select_detail_appletr'
							}
							that.$http.get(url, {
									params: {
										taskId: that.taskId
									}
								})
								.then(res => {
									// console.log(res)
									that.list = res.data.data
								})
							uni.showToast({
								title: '操作成功',
								duration: 1000,
								icon: 'success',
								success: () => {
									setTimeout(() => {
										that.$http.get('qms/cooperation_comment/select', {
											params: {
												taskId: that.taskId
											}
										}).then(res => {
											// console.log(res)
											that.commentInfo = res.data.data
											that.commentList = res.data.data.records
											if (that.commentInfo.current == that.commentInfo.pages) {
												that.commentStatus = 'noMore';
											} else if (that.commentInfo.pages == 0) {
												that.commentStatus = 'noMore';
											}
										})
									}, 1000)
								}
							})
						} else if (res.data.code == 1) {
							uni.showToast({
								title: `${res.data.message}`,
								duration: 2000,
								icon: "none"
							})
						}
					})
				}
			},
			repeatNoMore() {
				this.$http.post('qms/cooperation_task/operation', {
					repeatType: 2,
					type: 1,
					taskId: this.taskId
				}).then(res => {
					// console.log(res)
					if (res.data.code == 0) {
						uni.showToast({
							title: '操作成功',
							duration: 1000,
							icon: 'success',
							success: () => {
								setTimeout(() => {
									let url = 'qms/cooperation_list/select_detail';
									this.$http.get(url, {
											params: {
												taskId: this.taskId
											}
										})
										.then(res => {
											// console.log(res)
											this.list = res.data.data
										})
									this.$http.get('qms/cooperation_comment/select', {
										params: {
											taskId: this.taskId
										}
									}).then(res => {
										// console.log(res)
										this.commentInfo = res.data.data
										this.commentList = res.data.data.records
										if (this.commentInfo.current == this.commentInfo.pages) {
											this.commentStatus = 'noMore';
										} else if (this.commentInfo.pages == 0) {
											this.commentStatus = 'noMore';
										}
									})
									this.$refs.dialog.close()
								}, 1000)
							}
						})
						if(this.list.allocationType==1 && this.list.publisher==this.list.userId&& this.list.cooperationTaskUserVOList.length>1){
							// uni.navigateTo({
							// 	url:`/pages/ican/taskDetail/manualAllocationList/manualAllocationList?taskId=${this.taskId}`
							// })
							this.$refs.allocationDialog.open()
						}else{
						
						}
					}else{
						uni.showToast({
							title: `${res.data.message}`,
							duration: 2000,
							icon: "none"
						})
					}
					this.$refs.dialog.close()
				})
			},
			repeatNowTime() {
				this.$http.post('qms/cooperation_task/operation', {
					repeatType: 1,
					type: 1,
					taskId: this.taskId
				}).then(res => {
					// console.log(res)
					if (res.data.code == 0) {
						uni.showToast({
							title: '操作成功',
							duration: 1000,
							icon: 'success',
							success: () => {
								setTimeout(() => {
									let url = 'qms/cooperation_list/select_detail';
									this.$http.get(url, {
											params: {
												taskId: this.taskId
											}
										})
										.then(res => {
											// console.log(res)
											this.list = res.data.data
										})
									this.$http.get('qms/cooperation_comment/select', {
										params: {
											taskId: this.taskId
										}
									}).then(res => {
										// console.log(res)
										this.commentInfo = res.data.data
										this.commentList = res.data.data.records
										if (this.commentInfo.current == this.commentInfo.pages) {
											this.commentStatus = 'noMore';
										} else if (this.commentInfo.pages == 0) {
											this.commentStatus = 'noMore';
										}
									})
									this.$refs.dialog.close()
								}, 1000)
							}
						})
						if(this.list.allocationType==1  && this.list.publisher==this.list.userId&& this.list.cooperationTaskUserVOList.length>1){
							// uni.navigateTo({
							// 	url:`/pages/ican/taskDetail/manualAllocationList/manualAllocationList?taskId=${this.taskId}`
							// })
							this.$refs.allocationDialog.open()
						}else{
							
						}
					}else{
						uni.showToast({
							title: `${res.data.message}`,
							duration: 2000,
							icon: "none"
						})
					}
						this.$refs.dialog.close()
					})
			},
			isEmpty,
			joinTask() {
				this.placeholder = '请输入申请理由'
				this.$refs.popup.open()
			},
			timeStamp(times) {
				// console.log(times)
				// let timestamp = Date.parse(new Date());
				let letime = times;;
				let time = parseInt(letime);
				if (time > 60) {
					let second = time % 60;
					let min = parseInt(letime / 60);
					// 直接返回字符串格式：
					// time = min + "分" + second + "秒";  
					// 返回对象格式：
					time = {
						min: min,
						second: second
					};
					if (min > 60) {
						min = parseInt(letime / 60) % 60;
						let hour = parseInt(parseInt(letime / 60) / 60);
						// 直接返回字符串格式：
						// time = hour + "时" + min + "分" + second + "秒";
						// 返回对象格式：
						time = {
							hour: hour,
							min: min,
							second: second
						}
						if (hour >= 24) {
							hour = parseInt(parseInt(letime / 60) / 60) % 24;
							let day = parseInt(parseInt(parseInt(letime / 60) / 60) / 24);
							// 直接返回字符串格式：
							// time = day + "天" + hour + "时" + min + "分" + second + "秒";
							// 返回对象格式：
							time = {
								day: day,
								hour: hour,
								min: min,
								second: second
							}
						}
					}
				} else {
					time = {
						second: times
					};
				}
				// 判断是否小于10，小于10就补零
				if (time.day < 10) {
					// time.day = '0' + time.day
				} else if (time.day == undefined) {
					time.day = ''
				}
				if (time.hour < 10) {
					// time.hour = '0' + time.hour
				} else if (time.hour == undefined) {
					time.hour = ''
				}
				if (time.min < 10) {
					// time.min = '0' + time.min
				} else if (time.min == undefined) {
					time.min = "0"
				}
				// if(time.second < 10) {
				// 	time.second = '0' + time.second
				// }
				// 输出结果：
				// console.log(time)
				this.surplusTime = time
			},
			goCannerCard(item){
				uni.navigateTo({
					url: `/pages/find/cannerCard/cannerCard?id=${item.createBy}`
				})
			}
		}
	}
</script>
<style lang="scss">
	.createTime {
		font-size: 22rpx;
		line-height: 32rpx;
	}
	.personInfo{
		background-color: #F5F7F8;
		border-radius: 8rpx;
		padding: 32rpx;
		margin-bottom: 36rpx;
	}
	.messageDialog{
		padding:32rpx 32rpx 48rpx;
		width: 590rpx;
		.messageTitle{
			margin-top: 32rpx;
			font-size: 36rpx;
			line-height: 52rpx;
		}
	}
	.message{
		font-size: 28rpx;
		line-height: 52rpx;
		margin: 48rpx 0;
		text-align: center;
	}
	.taskActionsItem{
		font-size: 18rpx;
		line-height: 26rpx;
	}
	.taskActionsImg{
		width: 56rpx;
		height: 56rpx;
		margin-bottom: 4rpx;
	}
	.questionMark{
		width: 26rpx;
		height: 26rpx;
		border: 2rpx solid #2F80FF;
		margin-left: 14rpx;
		border-radius: 50%;
		font-size: 24rpx;
		line-height: 24rpx;
		text-align: center;
	}
	.cancelAction {
		width: 100%;
		font-size: 28rpx;
		color: #FFFFFF;
		// font-weight: bold;
		line-height: 40rpx;
	}

	.actionsList {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		font-size: 24rpx;
		line-height: 34rpx;

		.actionItem {
			width: 25%;
			margin-bottom: 40rpx;

			.actionImg {
				width: 100rpx;
				height: 100rpx;
				margin-bottom: 10rpx;
			}
		}
	}

	.actions {
		padding: 32rpx;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: column;
	}

	.container {
		height: 100%;

		.contentWrap {
			padding: 48rpx 32rpx 32rpx;

			.officialImg {
				margin-bottom: 20rpx;

				.img {
					width: 184rpx;
					height: 50rpx;
				}
			}

			.wrapTitle {
				width: 100%;

				.title {
					flex: 1;
					font-size: 36rpx;
					line-height: 56rpx;
					color: #272727;
				}
			}

			.wrapFinishTime {
				margin-top: 24rpx;
				margin-bottom: 32rpx;

				view {
					font-size: 24rpx;
					line-height: 40rpx;
				}
			}

			.wrapRepeatTime {
				margin-top: 30rpx;

				.repeatTime {
					font-size: 24rpx;
				}
			}

			.wrapPlan {
				padding: 32rpx 0px;

				.orgInfo {
					flex: 1;
					min-width: 0;
					.img {
						width: 44rpx;
						height: 44rpx;
					}

					.orgName {
						font-size: 30rpx;
						margin-left: 20rpx;
						flex: 1;
						color: #272727;
					}
				}

				.plan {
					margin-left: 24rpx;
					font-size: 28rpx;
					color: #57DBB1;
					line-height: 40rpx;
				}
			}

			.wrapMember {
				padding: 24rpx 0px;
				border-top: 0.3rpx solid #EFF0F1;
				border-bottom: 0.3rpx solid #EFF0F1;

				.memberList {
					.img {
						width: 44rpx;
						height: 44rpx;
					}

					.memberListAvatar {
						margin-left: 20rpx;

						.avatarImg {
							width: 64rpx;
							height: 64rpx;
							margin-right: 16rpx;
							border-radius: 50%;
						}
					}

					text {
						font-size: 28rpx;
					}
				}

				.goMemberDetails {
					// flex: 1;
					text-align: right;

					.img {
						width: 44rpx;
						height: 44rpx;
						margin-right: -16rpx;
					}
				}
			}

			.wrapUrgency {
				padding: 32rpx 0px;
				border-bottom: 0.3rpx solid #EFF0F1;

				.img {
					width: 44rpx;
					height: 44rpx;
					margin-right: 20rpx;
				}

				.urgencyStatus {
					flex: 1;

					.urgencyStatusInfo {
						font-size: 30rpx;
						color: #272727;
						line-height: 40rpx;
					}

					.urgency {
						color: #565B5F;
						font-size: 28rpx;
						line-height: 40rpx;
					}
				}
			}

			.wrapRelation {
				padding-top: 32rpx;
				padding-bottom: 16rpx;
				border-bottom: 0.3rpx solid #EFF0F1;

				.relation {
					margin-bottom: 32rpx;
					.img {
						width: 44rpx;
						height: 44rpx;
						margin-right: 20rpx;
					}

					.addRelation {
						flex: 1;
						font-size: 30rpx;
						line-height: 40rpx;
						color: #272727;
					}
				}

				.relationList {
					margin-bottom: 16rpx;
					padding: 24rpx; 
					border-radius:8rpx;
					font-size: 26rpx;
					line-height: 40rpx; 
					background-color: #F5F7F8;

					.relationName {
						color: #272727;
						flex: 1;
					}

					.img {
						width: 44rpx;
						height: 44rpx;
						margin-left: 20rpx;
					}
				}
			}

			.wrapRemark {
				padding: 32rpx 0 ;

				.remarkInfo {
					margin-bottom: 32rpx;

					.img {
						width: 44rpx;
						height: 44rpx;
					}

					.remark {
						margin-left: 20rpx;
						font-size: 30rpx;
						line-height: 40rpx;
						color: #272727;
					}
				}

				.remarkTitle {
					padding: 32rpx;
					background-color: #F5F7F8;
					border-radius: 8rpx;

					.description {
						font-size: 28rpx;
						line-height: 56rpx;
						color: #272727;
					}
				}
			}

			.commentList {
				// display: flex;
				// justify-content: flex-start;
				// align-items: flex-start;
				padding-top: 32rpx;

				.commentMember {
					margin-right: 24rpx;

					.img {
						width: 64rpx;
						height: 64rpx;
						border-radius: 50%;
					}
				}
				.commentInfocontent {
					font-size: 30rpx;
					line-height: 42rpx;
					margin-bottom: 24rpx;
					margin-top: 24rpx;
				}
				.commentInfoName {
					font-size: 28rpx;
					line-height: 40rpx;
					margin-bottom: 2rpx;
				}
				
				
				.commentCreateTime {
					margin-bottom: 32rpx;
					justify-content: flex-end;
				
				
					.addcomment {
						font-size: 26rpx;
						line-height: 36rpx;
						color: #565B5F;
				
						.img {
							width: 44rpx;
							height: 44rpx;
							margin-right: 8rpx;
						}
					}
				}

				.commentInfo {
					word-break: break-all;
					border-bottom: 0.3rpx solid #EFF0F1;
					flex: 1;

					.wrapReply {
						font-size: 28rpx;
						padding: 20rpx 20rpx 0rpx 20rpx;
						background-color: #F4F5F6;
						border-radius: 20rpx;
						margin-bottom: 40rpx;

						.replyList {
							padding-bottom: 20rpx;
							line-height: 48rpx;

							.txt {
								margin-left: 20rpx;
							}
						}

						.replyMore {
							font-size: 24rpx;
							line-height: 48rpx;
							text-align: right;
							margin-right: -20rpx;
							padding-bottom: 20rpx;
						}
					}
				}
			}
		}

		.btns {
			width: 100%;
			background-color: #FFFFFF;
			position: fixed;
			bottom: 0rpx;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);

			.wrapBtns {
				width: 686rpx;
				margin: 24rpx 32rpx 32rpx;

				.commentBtn {
					color: #919397;
					font-size: 28rpx;
					padding:0rpx 28rpx;
					text-align: center;
				}

				.commentBtnShare {
					color: #919397;
					font-size: 28rpx;
					line-height: 40rpx;
					padding:0rpx 28px;
					text-align: center;
				}

				.doComplete {
					flex: 1;
					background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
				}

				.completed {
					flex: 1;
					background: #FFD6D6;
					
				}

				.closed {
					flex: 1;
					background: #666769;
				}

				.joinTask {
					flex: 1;
					height: 92rpx;
					line-height: 92rpx;
					background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
					border-radius: 64rpx;
					text-align: center;
					color: #FFFFFF;
					font-weight: bold;
				}

				.completeTask {
					flex: 1;
					height: 92rpx;
					line-height: 92rpx;
					background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
					border-radius: 64rpx;
					text-align: center;
					color: #FFFFFF;
					font-weight: bold;
				}
			}
		}
	}

	.popDialog {
		padding: 32rpx;
		background-color: #FFFFFF;
		.message{
			font-size: 28rpx;
			line-height: 52rpx;
			margin: 48rpx 0;
			text-align: center;
		}

		.title {
			font-size: 36rpx;
			line-height: 52rpx;
			margin-top: 32rpx;
			text-align: center;
		}

		.noRepeat {
			flex: 1;
			background: #F5f7f8;
			color: #565B5F;
			margin-right: 30rpx;
		}

		.repeatNow {
			flex: 1;
		}
	}

	.popup_input {
		padding: 32rpx;
		background-color: #FFFFFF;
		display: flex;
		font-size: 28rpx;
		align-items: flex-end;

		.sendBtn {
			margin-left: 20rpx;
			color: #F74437;
		}

		.notSendBtn {
			margin-left: 20rpx;
			color: #F7443780;
		}
	}

	.inputDefault {
		color: #919397;
		padding: 20rpx;
		line-height: 48rpx;
	}

	textarea {
		flex: 1;
		padding: 20rpx;
		line-height: 48rpx;
		background-color: #F4F5F6;
		color: #666769;
		border-radius: 20rpx;
		height: 184rpx;
	}

	::v-deep .btn {
		color: #F74437;
		font-size: 28rpx;
		font-weight: normal;
		margin:0rpx 30rpx;
		height: 92rpx;
		line-height: 92rpx;
		border-radius: 64rpx;
		text-align: center;
		background-color: #FFFFFF;
		border: 2rpx solid #F74437;
		width: 204rpx;
	}

	::v-deep .btn::after {
		border: none;
	}

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
</style>
