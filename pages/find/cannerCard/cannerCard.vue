<template>
	<view class="container" style="background: url(https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/moduleStore/cannerCard_bg.png) no-repeat;background-size: 100% 548rpx;">
		<view :style="{ height: systemInfo.statusBarHeight + 'px' }"></view>
		<view class="flexRowStart"
			:style="{height:menuButton.height +(menuButton.bottom -systemInfo.statusBarHeight -menuButton.height) *2 +'px',width:systemInfo.safeArea.width -(systemInfo.safeArea.width - menuButton.left) +'px',padding:'0 0 ' +(menuButton.bottom -systemInfo.statusBarHeight -menuButton.height +'px'),lineHeight: menuButton.height + 'px',}">
			<view class="flexRowStart">
				<image :src="$ossUrl('soCard_back.png')" mode="" style="width: 56rpx;height: 56rpx;margin-left: 18rpx;" @tap="back"></image>
				<view class="card_title">
					个人风采页
				</view>
			</view>
		</view>
		<view class="page" >
			<view class="baseContainer">
				<view class="title">
					<view style="flex: 1;">
						<view class="titlename">
							<view class="name">{{$isEmpty(data.realName)?'暂无':data.realName}}</view>
							<!-- <image v-if="data.redness==1 && oss" class="levelImg" :src="oss+'icon_ican_newLevelOne.png'"></image>
							<image v-if="data.redness==2 && oss" class="levelImg" :src="oss+'icon_ican_newLevelTwo.png'"></image>
							<image v-if="data.redness==3 && oss" class="levelImg" :src="oss+'icon_ican_newLevelThree.png'"></image>
							<image v-if="data.redness==4 && oss" class="levelImg" :src="oss+'icon_ican_newLevelFour.png'"></image>
							<image v-if="data.redness==5 && oss" class="levelImg" :src="oss+'icon_ican_newLevelFive.png'"></image> -->
						</view>
						<view class="profession">
							{{$isEmpty(profession)?'暂未填写':profession}}
						</view>
					</view>
					<image v-if="data.avatar" class="avatar" mode="aspectFill" :src="imageError(data.avatar,$oss)">
					</image>
				</view>
				<view class="content">
					<!-- <image v-if="oss" class="content-topimg" :src="oss + 'bg_find_card_tab.png'"></image> -->
					<view class="content-text">
						<view class="company">{{$isEmpty(data.company)?'暂未填写工作单位':data.company}}</view>
						<view class="tag" v-if="data.abilityTag && data.abilityTag.length>0">
							<text v-for="(item,index) in data.abilityTag" :key="index" v-if="index<3">{{item}} 
								<text class="tag-point"
								 v-if="index<data.abilityTag.length-1 && index<2">·</text>
							</text>
						</view>
						 <view class="tag" v-else>
							暂未填写个人标签
						 </view>
					</view>
				</view>
				<view class="end">
					<view class="location">
						<image v-if="oss" style="width: 20rpx;height: 24rpx;" :src="$ossUrl('soCard_location.png')"></image>
						<view class="text">{{$isEmpty(data.workPlace)?'暂未填写工作地':data.workPlace}}</view>
					</view>
					<view class="button-list">
						<button class="share button" open-type="share">分享</button>
						<view v-if="data.isFollowed == 0" class="attention" @tap="changeAttention">+关注</view>
						<view v-if="data.isFollowed == 1" class="attentioned" @tap="changeAttention">已关注</view>
					</view>
				</view>
			</view>
			<view v-if="data.canSee || fromSo || fromRecruit">
				<view class="infoContainer">
					<view class="item">
						<image v-if="oss" class="icon" :src="$ossUrl('cannerCard_phone.png')"></image>
						<view class="item-text">{{$isEmpty(data.mobile)?'暂无':data.mobile}}</view>
						<view class="cell bg_color_FFFFFF" v-if="data.isFriend == 0 && (id!=userId)">
							仅好友可查看
						</view>
						<!-- <view class="cell" @tap="cell" v-else>立即拨打</view> -->
					</view>
					<view class="item">
						<image v-if="oss" class="icon" :src="$ossUrl('cannerCard_email.png')"></image>
						<view class="item-text">{{$isEmpty(data.mail)?'暂无':data.mail}}</view>
					</view>
					<view class="item">
						<image v-if="oss" class="icon" :src="$ossUrl('cannerCard_lang.png')"></image>
						<view class="item-text" v-if="data.languageAbilityList">
							<text v-for="(item,index) in data.languageAbilityList" :key="index">{{item}}<text v-if="index<data.languageAbilityList.length-1">、</text></text>
						</view>
						<view v-else class="item-text">暂无</view>
					</view>
					<view class="item">
						<image v-if="oss" class="icon" :src="$ossUrl('cannerCard_mark.png')"></image>
						<view class="item-text">{{$isEmpty(data.sign)?'暂无':data.sign}}</view>
					</view>
				</view>
				<view class="moreContainer">
					<view class="title">
						<image v-if="oss" class="title-icon" :src="$ossUrl('soCard_intro.png')"></image>
						<view class="title-text">
							自我描述
						</view>
					</view>
					<view class="content-text">
						{{$isEmpty(data.introduction)?'暂无':data.introduction}}
					</view>
				</view>
				<view class="moreContainer">
					<view class="title">
						<image v-if="oss" class="title-icon" :src="$ossUrl('cannerCard_exp.png')"></image>
						<view class="title-text">
							工作经历
						</view>
						<view class="more" v-if="data.workExperience.length>1" @tap="goWorkMore(data)">
							<view class="more-text">查看更多</view>
							<image v-if="oss" class="more-icon" :src="oss + 'icon_right_gray.png'"></image>
						</view>
					</view>
					<view v-if="!$isEmpty(data.workExperience)">
						<view class="subtitle" v-if="data.workExperience.length>0">
							{{$isEmpty(data.workExperience[0].company)?'暂无':data.workExperience[0].company}}
						</view>
						<view class="subheading singleEllipsis" v-if="data.workExperience.length>0">
							{{$isEmpty(data.workExperience[0].department)?'暂无':data.workExperience[0].department}} ·
							{{$isEmpty(data.workExperience[0].position)?'暂无':data.workExperience[0].position}} |
							{{$isEmpty(data.workExperience[0].starTime)?'暂无':data.workExperience[0].starTime}} -
							{{$isEmpty(data.workExperience[0].endTime)?'暂无':data.workExperience[0].endTime}}
						</view>
						<view class="content-text" v-if="data.workExperience.length>0">
							{{$isEmpty(data.workExperience[0].describe)?'暂无':data.workExperience[0].describe}}
						</view>
					</view>
					<view v-else class="content-text">
						暂无
					</view>
				</view>
				<view class="moreContainer">
					<view class="title">
						<image v-if="oss" class="title-icon" :src="$ossUrl('cannerCard_edu.png')"></image>
						<view class="title-text">
							教育经历
						</view>
						<view class="more" v-if="data.learningSituation.length>1" @tap="goEducationMore(data)">
							<view class="more-text">查看更多</view>
							<image v-if="oss" class="more-icon" :src="oss + 'icon_right_gray.png'"></image>
						</view>
					</view>
					<view v-if="!$isEmpty(data.learningSituation)">
						<view v-if="data.learningSituation.length>0" class="subtitle">
							{{$isEmpty(data.learningSituation[0].school)?'暂无':data.learningSituation[0].school}}
						</view>
						<view v-if="data.learningSituation.length>0" class="subheading singleEllipsis">
							{{$isEmpty(data.learningSituation[0].education)?'暂无':data.learningSituation[0].education}} ·
							{{$isEmpty(data.learningSituation[0].content)?'暂无':data.learningSituation[0].content}} |
							{{$isEmpty(data.learningSituation[0].starTime)?'暂无':data.learningSituation[0].starTime}} -
							{{$isEmpty(data.learningSituation[0].endTime)?'暂无':data.learningSituation[0].endTime}}
						</view>
						<view v-if="data.learningSituation.length>0" class="content-text">
							{{$isEmpty(data.learningSituation[0].describe)?'暂无':data.learningSituation[0].describe}}
						</view>
					</view>
					<view v-else class="content-text">
						暂无
					</view>
				</view>
				<view class="moreContainer">
					<view class="title">
						<image v-if="oss" class="title-icon" :src="$ossUrl('cannerCard_group.png')"></image>
						<view class="title-text">
							加入的组织
						</view>
						<view class="more" v-if="data.orgVOS.length>3" @tap="goSoMore(data)">
							<view class="more-text">查看更多</view>
							<image v-if="oss" class="more-icon" :src="oss + 'icon_right_gray.png'"></image>
						</view>
					</view>
					<view class="so-item" v-for="(item,index) in data.orgVOS" :key="index" v-if="index<3" @tap="goSoCard(item.orgId)">
						<image class="so-avatar" mode="aspectFill" :src="soImageError(item.avatar,$oss)"></image>
						<view class="so-name singleEllipsis">
							{{$isEmpty(item.name)?'':item.name}}
						</view>
					</view>
					<view v-if="data.orgVOS.length<1 || !data.orgVOS" class="content-text">
						暂无
					</view>
				</view>
				<view class="moreContainer">
					<view class="title">
						<image v-if="oss" class="title-icon" :src="$ossUrl('cannerCard_thought.png')"></image>
						<view class="title-text">
							TA的动态
						</view>
						<view v-if="thought.total>3" class="more" @tap="goThoughtsMore(data)">
							<view class="more-text">查看更多</view>
							<image v-if="oss" class="more-icon" :src="oss + 'icon_right_gray.png'"></image>
						</view>
					</view>
					<view class="talk">
						<view class="talk-item" v-for="(item,index) in thought.records" :key="index" @tap="goThoughtsDetails(item)">
							<view class="talk-item-title flexRowStart">
								<image class="avatar" :src="imageError(item.avatar,$oss)" mode="aspectFill" style="margin-right:16rpx;" @tap.stop="goCannerCard(item)"></image>
								<view class="talk-item-title-text">
									<view class="name color_303031 bold talk-item-title-text-name">{{ $isEmpty(item.userName)?'':item.userName }}</view>
									<view class="" style="font-size: 22rpx;line-height: 32rpx;margin-top: 2rpx;color: #BCC4CB;">{{$isEmpty(item.createTime)?'':item.createTime}}</view>
								</view>
							</view>
							<view v-if="item.content" class="talk-text quadraEllipsis color_303031">
								{{ $isEmpty(item.content)?'':item.content }}
							</view>
							<view v-if="item.images.length == 1" class="talk-imgs">
								<image mode="aspectFill" class="talk-img-single" :src="item.images[0]" @tap.stop="previewImage(item.images,0)"></image>
							</view>
							<view v-else class="talk-imgs">
								<image mode="aspectFill" class="talk-img" :src="item2" v-for="(item2,index2) in item.images" :key="index2"
								 @tap.stop="previewImage(item.images,index2)"></image>
							</view>
							<view class="attachContent" v-if="item.attach" @tap.stop="goRelationDetails(item)">
								<view class="flexRowStart wrapAttach" style="background-color: #F4F5F6">
									<image class="attachImg" v-if="item.attach.type== 'material' && oss" :src="oss+'icon_icanThought_material.png'"></image>
									<image class="attachImg" v-else-if="item.attach.type== 'activity' && oss" :src="oss+'icon_icanThought_activity.png'"></image>
									<image class="attachImg" v-else-if="item.attach.type=='task' && oss" :src="oss+'icon_thoughtsRelation_task.png'"></image>
									<image class="attachImg" v-else-if="item.attach.type=='questionnaire' && oss" :src="oss+'icon_icanThought_questionnaire.png'"></image>
									<image class="attachImg" v-else-if="item.attach.type =='products' || item.attach.type =='program' && oss" :src="oss+'icon_icanThought_magicBox.png'"></image>
									<view class="attachInfo">
										<view class="color_303031 bold" v-if="item.attach.type== 'material'">
											材料
										</view>
										<view class="color_303031 bold" v-else-if="item.attach.type== 'activity'">
											活动
										</view>
										<view class="color_303031 bold" v-else-if="item.attach.type=='task'">
											任务
										</view>
										<view class="color_303031 bold" v-else-if="item.attach.type=='questionnaire'">
											问卷
										</view>
										<view class="color_303031 bold" v-else-if="item.attach.type =='products' ">
											魔方
										</view>
										<view class="singleEllipsis attachTitle">
											{{item.attach.title}}
										</view>
									</view>
								</view>
							</view>
							<view class="reply" v-if="!$isEmpty(item.transmittedThoughts)">
								<view class="talk-text quadraEllipsis">
									<text @tap.stop="goCannerCard(item.transmittedThoughts)" class="color_2F80FF" style="margin-right: 20rpx;">@{{item.transmittedThoughts.userName}}:</text>
									{{item.transmittedThoughts.content}}
								</view>
								<view v-if="item.transmittedThoughts.images.length == 1" class="talk-imgs">
									<image mode="aspectFill" class="talk-img-single" :src="item.transmittedThoughts.images[0]" @tap.stop="previewImage(item.transmittedThoughts.images,0)"></image>
								</view>
								<view v-else class="talk-imgs">
									<image mode="aspectFill" class="talk-img" :src="item2" v-for="(item2,index2) in item.transmittedThoughts.images"
									 :key="index2" @tap.stop="previewImage(item.transmittedThoughts.images,index2)"></image>
								</view>
								<view class="attachContent" v-if="item.transmittedThoughts.attach" @tap.stop="goTransmittedThoughtsRelationDetails(item)">
									<view class="flexRowStart wrapAttach">
										<image class="attachImg" v-if="item.transmittedThoughts.attach.type== 'material' && oss" :src="oss+'icon_icanThought_material.png'"></image>
										<image class="attachImg" v-else-if="item.transmittedThoughts.attach.type== 'activity' && oss" :src="oss+'icon_icanThought_activity.png'"></image>
										<image class="attachImg" v-else-if="item.transmittedThoughts.attach.type=='task' && oss" :src="oss+'icon_thoughtsRelation_task.png'"></image>
										<image class="attachImg" v-else-if="item.transmittedThoughts.attach.type=='questionnaire' && oss" :src="oss+'icon_icanThought_questionnaire.png'"></image>
										<image class="attachImg" v-else-if="item.transmittedThoughts.attach.type =='products' || item.attach.type == 'program' && oss"
										 :src="oss+'icon_icanThought_magicBox.png'"></image>
										<view class="attachInfo">
											<view class="color_303031 bold" v-if="item.transmittedThoughts.attach.type== 'material'">
												材料
											</view>
											<view class="color_303031 bold" v-else-if="item.transmittedThoughts.attach.type== 'activity'">
												活动
											</view>
											<view class="color_303031 bold" v-else-if="item.transmittedThoughts.attach.type=='task'">
												任务
											</view>
											<view class="color_303031 bold" v-else-if="item.transmittedThoughts.attach.type=='questionnaire'">
												问卷
											</view>
											<view class="color_303031 bold" v-else-if="item.transmittedThoughts.attach.type =='products' || item.attach.type == 'program'">
												魔方
											</view>
											<view class="singleEllipsis color_666769 attachTitle">
												{{item.transmittedThoughts.attach.title}}
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="talk-end">
								<view class="center" v-if="$isEmpty(item.transmittedThoughts)" @tap.stop="commentsOpen('share',item)">
									<image v-if="oss" class="talk-icon" :src="oss+'thought_share.png'"></image>
									<view class="talk-end-text">{{ $isEmpty(item.transmittedTimes)?'0':item.transmittedTimes}}</view>
								</view>
								<view class="center">
									<image v-if="oss" class="talk-icon" :src="oss+'thought_comment.png'"></image>
									<view class="talk-end-text">{{ $isEmpty(item.commentNum)?'0':item.commentNum}}</view>
								</view>
								<view class="center" @tap.stop="addThumbsUp(item)">
									<image v-if="oss && item.praiseStatus == 1" class="talk-icon" :src="oss+'thought_praise.png'"></image>
									<image v-else-if="oss" class="talk-icon" :src="oss+'thought_unPraise.png'"></image>
									<view class="talk-end-text">{{ $isEmpty(item.thumbsUpCount)?0:item.thumbsUpCount}}</view>
								</view>
							</view>
						</view>
					</view>
					<view v-if="thought.total<1 || !thought" class="content-text">
						暂无
					</view>
				</view>
			</view>
			<view v-else-if="!isLogin" class="loginContainer">
				<view class="text">登录查看更多</view>
				<view class="button" @tap="login">去登录</view>
			</view>
			<view v-else class="privacy">用户未开放个人详情</view>
			<view class="safe-bottom"></view>
		</view>
		<view class="bottom" v-if="!fromSo&& (id!=userId)">
			<view class="bottom-item">
				<view class="invieBtn" @tap="inviteSo()" style="flex: 1;">
					邀请+组织
				</view>
				<!-- <view v-if="data.isApprentice==0&&data.isMaster==0" class="bg_color_F4F5F6 color_666769 button" @tap="addMaster(data)">
					拜师
				</view>
				<view v-else class="bg_color_919397 color_FFFFFF button">
					拜师
				</view> -->
				<view class="" style="width: 22rpx;height: 92rpx;" v-if="data.isFriend==0">
					
				</view>
				<view v-if="data.isFriend==0" class="addBtn" @tap="addFriend(data)" style="flex: 1;">
					加好友
				</view>
			</view>
		</view>
		<view class="bottom" v-if="fromSo">
			<view class="bottom-item">
				<view class="button" @tap="toInvite(data)">
					邀请投递
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="popup_input">
				<textarea :placeholder="placeholder" placeholder-style="inputDefault" v-model="input" fixed="true" adjust-position="true"
				 show-confirm-bar="false" cursor-spacing="80"></textarea>
				<view v-if="input.length>0" class="color_F74437" style="margin-left: 20rpx;" @tap="sendInput">发送</view>
				<view v-else style="margin-left: 20rpx;color: #F7443780;">发送</view>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	import {
		getCompanyStation,
		previewImage,
		imageError,
		soImageError,
		goSoCard,
		mark
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				data: '',
				userId: '',
				id: '',
				oss: '',
				thought: '',
				input: '',
				inputType: '',
				placeholder: '请输入申请理由',
				profession: '',
				isLogin: false,
				isMine: false,
				fromSo: false,
				fromRecruit: false,
				orgId: '',
				systemInfo: '',
				menuButton: '',
			};
		},
		methods: {
			back(){
				let pages = getCurrentPages()
				if(!(pages.length>1)){
					uni.switchTab({
						url:'/pages/tabbar/ican'
					})
				}else{
					uni.navigateBack({
						delta:1
					})
				}
			},
			imageError,
			login() {
				uni.navigateTo({
					url: '../../getUserInfo/getUserInfo'
				})
			},
			addThumbsUp(item) {
				this.$http.get('dms/app/add_thumbs_up/' + item.thoughtsId).then(res => {
					if (res.data.data == true) {
						if (item.praiseStatus == 0) {
							item.praiseStatus = 1;
							item.thumbsUpCount++
						} else if (item.praiseStatus == 1) {
							item.praiseStatus = 0;
							item.thumbsUpCount--
						}
					}
				});
			},
			sendInput() {
				let that = this
				if (that.inputType == 'share') {
					that.$http.post('dms/thoughts/create', {
						content: that.input,
						transmitId: that.thoughtsId,
						status: 0
					}).then(res => {
						that.$refs.popup.close();
						that.input = ''
						if (res.data.code == 1) {
							uni.showToast({
								icon: 'none',
								title: res.data.message
							})
						} else {
							uni.showToast({
								title: "分享成功",
								icon: "success",
								duration: 1000
							});
							this.$http.get('dms/thoughts/page', {
								params: {
									id: 1044,
									size: 3,
									current: 1
								}
							}).then(res => {
								this.thought = res.data.data;
							});
						}
					});
				}
			},
			commentsOpen(type, item) {
				if (type == 'apply') {
					this.placeholder = '请输入申请理由';
					this.orgId = item.orgId
				} else if (type == 'share') {
					this.placeholder = '请输入分享内容';
					this.thoughtsId = item.thoughtsId
				}
				this.inputType = type;
				this.$refs.popup.open()
			},
			goRelationDetails(item) {
				if (item.attach.type == 'activity') {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/soActivityDetails?id=${item.attach.relationId}`
					})
				} else if (item.attach.type == 'questionnaire') {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireDetails?id=${item.attach.relationId}`
					})
				} else if (item.attach.type == 'material') {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soMaterial/materialKind/materialDetails/materialDetails?id=${item.attach.relationId}`
					})
				} else if (item.attach.type == 'products' || item.attach.type == 'program') {
					uni.navigateTo({
						url: `/pages/find/magicBox/detail/detail?id=${item.attach.relationId}`
					})
				} else if (item.attach.type == 'task') {
					uni.navigateTo({
						url: `/pages/ican/taskDetail/taskDetail?taskId=${item.attach.relationId}`
					})
				}
			},
			previewImage,
			soImageError,
			goThoughtsDetails(item) {
				uni.navigateTo({
					url: `/pages/find/attention/detail/detail?id=${item.thoughtsId}`
				})
			},
			goCannerCard(item) {
				uni.navigateTo({
					url: `/pages/find/cannerCard/cannerCard?id=${item.userId}`
				})
			},
			cell() {
				uni.makePhoneCall({
					phoneNumber: this.data.mobile //仅为示例
				});
			},
			getCompanyStation,
			more() {
				uni.navigateTo({
					url: 'detail/detail?id=' + this.data.userId
				});
			},
			changeAttention() {
				if (this.data.isFollowed == 0) {
					this.$http.post('admin/follow/user', {
						userId: this.userId,
						followId: this.data.userId,
						sign: 0,
						type: 1
					}).then(res => {
						if (res.data.code == 0) {
							this.data.isFollowed = 1
						}
					})
				} else {
					this.$http.post('admin/follow/user', {
						userId: this.userId,
						followId: this.data.userId,
						sign: 1,
						type: 1
					}).then(res => {
						if (res.data.code == 0) {
							this.data.isFollowed = 0
						}
					})
				}
			},
			addFriend() {
				uni.navigateTo({
					url: `/pages/find/cannerCard/relationEdit/relationEdit?id=${this.data.userId}&name=friend`
				})
			},
			toInvite () {
				//Cross-module
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soRecruit/soRecruitInvite/soRecruitInvite?userId=${this.data.userId}&userName=${this.data.realName}&orgId=${this.orgId}`
				})
			},
			addMaster() {
				uni.navigateTo({
					url: `/pages/find/cannerCard/relationEdit/relationEdit?id=${this.data.userId}&name=master`
				})
			},
			inviteSo() {
				uni.navigateTo({
					url: `/pages/find/cannerCard/inviteAddSo/inviteAddSo?id=${this.data.userId}`
				})
			},
			goWorkMore() {
				uni.navigateTo({
					url: `/pages/find/cannerCard/wordExperienceList/wordExperienceList?id=${this.id}`
				})
			},
			goEducationMore() {
				uni.navigateTo({
					url: `/pages/find/cannerCard/educationList/educationList?id=${this.id}`
				})
			},
			goSoMore() {
				uni.navigateTo({
					url: `/pages/find/cannerCard/ownSoList/ownSoList?id=${this.id}`
				})
			},
			goThoughtsMore(data) {
				uni.navigateTo({
					url: `/pages/find/cannerCard/thoughtsList/thoughtsList?id=${data.userId}`
				})
			},
			goSoCard
		},
		onLoad(options) {
			const {
				id,
				fromRecruit,
				orgId,
				fromSo
			} = options
			this.oss = this.$oss
			this.id = id;
			this.orgId = orgId;
			this.fromSo = fromSo
			this.fromRecruit = fromRecruit
			this.menuButton = uni.getMenuButtonBoundingClientRect();
			this.systemInfo = uni.getSystemInfoSync();
		},
		onShow() {
			this.userId = uni.getStorageSync('userinfo').user_id;
			this.isLogin = !this.$isEmpty(uni.getStorageSync('token'));
			this.$http.get('admin/app/user/style/' + this.id).then(res => {
				this.data = res.data.data
				let industry = this.$isEmpty(this.data.industry) ? '' :this.data.industry;
				let point = (!this.$isEmpty(this.data.industry) && !this.$isEmpty(this.data.position)) ? ' · ' : ''
				let position = this.$isEmpty(this.data.position) ? '' : this.data.position.split('-')[(this.data.position
					.split('-').length - 1)];
				this.profession = industry + point + position;
				// this.data = res.data.data.card;
			});
			this.$http.get('dms/thoughts/page', {
				params: {
					id: this.id,
					size: 3,
					current: 1
				}
			}).then(res => {
				this.thought = res.data.data;
			});
		},
		onShareAppMessage(res) {
			this.$http.post('admin/mark/save', {
				section: 'user', //板块
				relationId: this.id,
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
			})
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '我分享了【' + this.data.realName + '】的名片，快去看看吧',
				path: '/pages/find/cannerCard/cannerCard?id=' + this.id
			}
		},
		onShareTimeline(res) {
			this.$http.post('admin/mark/save', {
				section: 'user', //板块
				relationId: this.id,
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
			})
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '我分享了【' + this.data.realName + '】的名片，快去看看吧',
				imageUrl: this.data.avatar
			}
		}
	};
</script>
<style lang="scss">
	.invieBtn{
		height: 92rpx;
		font-size: 30rpx;
		line-height: 92rpx;
		color: #272727;
		text-align: center;
		background-color: #ECEEF0;
		border-radius: 64rpx;
	}
	.addBtn{
		height: 92rpx;
		font-size: 30rpx;
		line-height: 92rpx;
		color: #FFFFFF;
		text-align: center;
		background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
		border-radius: 64rpx;
	}
	.card_title{
		font-size: 36rpx;
		line-height: 50rpx;
		font-weight: bold;
		color: #FFFFFF;
		margin-left: 212rpx;
	}
	.privacy {
		font-size: 28rpx;
		line-height: 40rpx;
		color: #919397;
		margin-top: 40rpx;
		text-align: center;
	}

	page {
		background-color: #F4F5F6;
	}

	::v-deep button::after {
		border: none;
	}

	.popup_input {
		padding: 32rpx;
		background-color: #FFFFFF;
		display: flex;
		font-size: 28rpx;
		align-items: flex-end;
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

	.reply {
		margin-top: 30rpx;
		background-color: #F4F5F6;
		padding: 20rpx;
		border-radius: 30rpx;

		.attachContent {
			margin-top: 20rpx;

			.wrapAttach {
				padding: 0;
			}
		}

		.talk-imgs {
			margin-right: -20rpx !important;

			.talk-img {
				width: 176rpx !important;
				height: 176rpx !important;
				margin-top: 20rpx !important;
				margin-right: 20rpx !important;
			}

			.talk-img-single {
				margin-top: 20rpx !important;
				margin-right: 20rpx !important;
			}
		}


	}

	.center {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.attachContent {
		margin-top: 30rpx;

		.wrapAttach {
			padding: 30rpx;
			border-radius: 30rpx;

			.attachImg {
				width: 76rpx;
				height: 76rpx;
			}

			.attachInfo {
				flex: 1;
				min-width: 0;
				margin-left: 20rpx;
				font-size: 28rpx;
				line-height: 40rpx;

				.attachTitle {
					margin-top: 10rpx;
					font-size: 24rpx;
					line-height: 34rpx;
				}
			}
		}
	}

	.talk {
		.talk-item {
			padding-top: 46rpx;
			border-bottom: 0.3rpx solid #EFF0F1;

			.talk-item-title {
				display: flex;
				align-items: center;
				margin-bottom: 30rpx;

				.avatar {
					width: 64rpx;
					height: 64rpx;
					border-radius: 50%;
				}

				.talk-item-title-text {

					.talk-item-title-text-name {
						font-size: 28rpx;
						line-height: 40rpx;
					}

					.talk-item-title-text-company {
						font-size: 24rpx;
						line-height: 34rpx;
						margin-top: 10rpx;
					}

					.name {
						color: #303031;
						font-size: 28rpx;
						line-height: 38rpx;
					}

					.company {
						color: #919397;
						font-size: 22rpx;
						line-height: 32rpx;
					}
				}

			}

			.talk-text {
				color: #303031;
				font-size: 28rpx;
				line-height: 48rpx;
			}

			.talk-imgs {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				margin-right: -30rpx;

				.talk-img {
					margin-top: 30rpx;
					margin-right: 30rpx;
					width: 182rpx;
					height: 182rpx;
					border-radius: 20rpx;
				}

				.talk-img-single {
					margin-top: 30rpx;
					width: 460rpx;
					height: 616rpx;
					border-radius: 20rpx;
				}
			}

			.talk-end {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 26rpx;
				color: #565B5F;
				line-height: 36rpx;

				.talk-icon {
					padding: 30rpx 0 40rpx;
					height: 44rpx;
					width: 44rpx;
				}

				.talk-end-text {
					margin-left: 10rpx;
					padding: 30rpx 0 40rpx;
				}
			}
		}
	}

	.page {
		padding: 0 24rpx;

		.loginContainer {
			margin-top: 40rpx;
			padding: 30rpx;
			background-color: #FFFFFF;
			border-radius: 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.text {
				color: #666769;
				font-size: 28rpx;
				line-height: 40rpx;
			}

			.button {
				width: 136rpx;
				border-radius: 33rpx;
				padding: 8rpx 0;
			}
		}

		.baseContainer {
			margin-top: 104rpx;
			padding: 32rpx;
			background-color: #FFFFFF;
			box-shadow: 0px 6rpx 28rpx rgba(161, 193, 237, 0.16);
			border-radius: 16rpx;

			.icon {
				height: 40rpx;
				width: 40rpx;
			}

			.title {
				display: flex;
				justify-content: space-between;
				align-items: flex-start;

				.titlename {
					display: flex;

					.name {
						font-size: 36rpx;
						line-height: 50rpx;
						color: #272727;
						font-weight: bold;
						margin-bottom: 16rpx;
					}

					.levelImg {
						margin-left: 10rpx;
						width: 40rpx;
						height: 44rpx;
					}
				}

				.profession {
					color: #9AA1A7;
					font-size: 24rpx;
					line-height: 34rpx;
				}

				.avatar {
					width: 132rpx;
					height: 132rpx;
					border-radius: 50%;
				}
			}

			.content {
				margin-top: 24rpx;
				background-color: #F5F7F8;
				border-radius: 12rpx;
				padding: 24rpx;

				.content-topimg {
					width: 610rpx;
					height: 40rpx;
				}

				.content-text {
					.company {
						color: #272727;
						font-size: 30rpx;
						line-height: 42rpx;
						margin-bottom: 8rpx;
					}

					.tag {
						color: #9AA1A7;
						font-size: 24rpx;
						line-height: 34rpx;

						.tag-point {
							margin: 0 12rpx;
						}
					}
				}
			}

			.end {
				margin-top: 24rpx;
				display: flex;
				justify-content: space-between;

				.location {
					display: flex;
					align-items: center;

					.text {
						margin-left: 10rpx;
						font-size: 22rpx;
						line-height: 32rpx;
						color: #565B5F;
					}
				}

				.button-list {
					display: flex;
					align-items: center;
					font-size: 28rpx;
					line-height: 40rpx;

					.share {
						width: 140rpx;
						background-color: #F4F5F6;
						border-radius: 42rpx;
						text-align: center;
						// padding: 8rpx 0;
						height: 52rpx;
						font-size: 26rpx;
						line-height: 52rpx;
					}

					.attention {
						margin-left: 20rpx;
						color: #FFFFFF;
						width: 140rpx;
						border-radius: 42rpx;
						text-align: center;
						height: 52rpx;
						background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
						font-size: 26rpx;
						line-height: 52rpx;
					}

					.attentioned {
						margin-left: 20rpx;
						color: #FFFFFF;
						width: 140rpx;
						background-color: #FFD6D6;
						border-radius: 42rpx;
						text-align: center;
						height: 52rpx;
						font-size: 26rpx;
						line-height: 52rpx;
					}
				}
			}
		}

		.infoContainer {
			background-color: #FFFFFF;
			border-radius: 16rpx;
			margin-top: 24rpx;
			padding:0px 32rpx 16rpx;

			.item {
				display: flex;
				align-items: center;
				padding: 24rpx 0px;

				.item-text {
					font-size: 26rpx;
					line-height: 36rpx;
					color: #565B5F;
					margin-left: 16rpx;
					flex: 1;
				}

				.icon {
					width: 40rpx;
					height: 40rpx;
				}

				.cell {
					width: 160rpx;
					height: 52rpx;
					line-height: 52rpx;
					background-color: #ECEEF0;
					border-radius: 42rpx;
					font-size: 24rpx;
					color: #272727;
					text-align: center;
				}
			}
		}

		.moreContainer {
			padding: 32rpx;
			background-color: #FFFFFF;
			border-radius: 16rpx;
			margin-top: 24rpx;

			.title {
				display: flex;
				align-items: center;

				.title-icon {
					height: 40rpx;
					width: 40rpx;
				}

				.title-text {
					margin-left: 16rpx;
					font-weight: bold;
					color: #333333;
					font-size: 32rpx;
					line-height: 44rpx;
					flex: 1;
				}

				.more {
					display: flex;
					align-items: center;

					.more-text {
						color: #BABEC0;
						font-size: 24rpx;
						line-height: 34rpx;
					}

					.more-icon {
						width: 44rpx;
						height: 44rpx;
						margin-left: 2rpx;
						margin-right: -14rpx;
					}
				}
			}

			.subtitle {
				color: #303031;
				font-size: 28rpx;
				line-height: 40rpx;
				font-weight: bold;
				margin-top: 30rpx;
			}

			.subheading {
				color: #919397;
				font-size: 24rpx;
				line-height: 34rpx;
				margin-top: 10rpx;
				margin-bottom: 10rpx;
			}

			.so-item {
				margin-top: 40rpx;
				display: flex;
				align-items: center;

				.so-avatar {
					height: 92rpx;
					width: 92rpx;
					border-radius: 50%;
				}

				.so-name {
					flex: 1;
					min-width: 0;
					margin-left: 24rpx;
					color: #272727;
					font-weight: bold;
					font-size: 30rpx;
					line-height: 44rpx;
				}
			}

			.content-text {
				color: #666769;
				font-size: 28rpx;
				line-height: 48rpx;
				margin-top: 30rpx;
			}
		}
	}

	.safe-bottom {
		height: 112rpx;
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		/* #endif */
	}

	.bottom {
		width: 750rpx;
		position: fixed;
		bottom: 0rpx;
		background-color: #FFFFFF;
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		/* #endif */
		.bottom-item {
			display: flex;
			padding: 24rpx 32rpx 32rpx;
			justify-content: space-between;

			.button {
				flex: 1;
				font-size: 28rpx;
				line-height: 92rpx;
				text-align: center;
				font-weight: bold;
				height: 92rpx;
				border-radius: 64rpx;
			}
		}
	}
</style>
