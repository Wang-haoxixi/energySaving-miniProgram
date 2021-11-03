<template>
	<view class="container">
		<view class="flexRow containerTitle" @click="goSoCard(soInfo)">
			<view class="flexRowStart" style="flex: 1;">
				<image class="img" :src="org.avatar" mode="aspectFill"></image>
				<view class="titleWrap" style="flex: 1;">
					<view class="bold orgName flexRowStart">
						<view class="singleEllipsis" style="flex:1;">
							{{ $isEmpty(org.name)?'':org.name }}
						</view>
						<!-- <image class="levelImg" v-if="oss && org.redness==1" :src="oss+'icon_ican_newLevelOne.png'"></image>
						<image class="levelImg" v-if="oss && org.redness==2" :src="oss+'icon_ican_newLevelTwo.png'"></image>
						<image class="levelImg" v-if="oss && org.redness==3" :src="oss+'icon_ican_newLevelThree.png'"></image>
						<image class="levelImg" v-if="oss && org.redness==4" :src="oss+'icon_ican_newLevelFour.png'"></image>
						<image class="levelImg" v-if="oss && org.redness==5" :src="oss+'icon_ican_newLevelFive.png'"></image> -->
					</view>
					<view class="color_919397 singleEllipsis orgSlogan">
						{{ $isEmpty(org.slogan)?'暂无口号':org.slogan }}
					</view>
					<view class="">
						<view v-if="org.abilityTag && org.abilityTag.length==0" class="color_666769 tagList">
							暂无标签
						</view>
						<view v-else class="color_666769 flexRowStart">
							<view class="tagList singleEllipsis" v-if="index<3" style="margin-right: 20rpx;" v-for="(item,index) of org.abilityTag" :key="index">
								{{$isEmpty(item)?'':item}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<image v-if="oss" class="rightImg" :src="oss+'icon_right_gray.png'"></image>
		</view>
		<view class="flexRowStart moduleContent">
			<view class="" style="width: 20%;margin-bottom: 24rpx;" v-for="(item,index) of soInfo.orgModule" :key='index' v-if="item.moduleId==10||item.moduleId==1||item.moduleId==2||item.moduleId==5||item.moduleId==6||item.moduleId==7||item.moduleId==8||item.moduleId==9">
				<view class="flexColumn" @tap="goActivity(soInfo,item)">
					<image :src="item.imageUrl" class="moduleImg" mode="aspectFill"></image>
					<text style="color: #565B5F; font-size: 24rpx;line-height: 34rpx;">{{ $isEmpty(item.name)?'':item.name }}</text>
				</view>
			</view>
		</view>
		<view class="">
			<view class="memberWrap">
				<view class="flexRow" style="margin-bottom: 32rpx;margin-right: -16rpx;" @tap="goMemberManagement()">
					<view class="color_303031 bold" style="font-size: 32rpx;line-height: 44rpx;">
						成员
					</view>
					<view class="flexRowStart">
						<view class="color_919397" style="font-size: 28rpx;line-height: 40rpx;">
							共{{$isEmpty(memberNum)?'':memberNum}}人
						</view>
						<image v-if="oss" class="memberRight" :src="oss+'icon_right_gray.png'"></image>
					</view>
				</view>
				<view class=" memberContent">
					<view class="flexColumn" style="padding: 16rpx 0rpx;" v-for="(item,index) of memberList" :key="index"
					 @tap="goCannerCard(item)">
						<view class="" style="position: relative;">
							<image :src=" item.avatar" class="memberAvatar"></image>
							<image :src="$ossUrl('soCard_owner.png')" mode="" v-if="item.isAdmin==2" class="onwer"></image>
							<image :src="$ossUrl('soCard_manager.png')" mode="" v-if="item.isAdmin==1" class="manager"></image>
						</view>
						<view class="color_666769 singleEllipsis realName">
							{{$isEmpty(item.realName)?'':item.realName}}
						</view>
					</view>
					<view class="" style="padding: 16rpx 0rpx;text-align: center;">
						<image :src="$ossUrl('soWorkbench_addMember.png')" class="addImg" @tap="addMember"></image>
					</view>
				</view>
			</view>
			<view class="actionsWrap">
				<view class=" noticeTitle">
					组织公告
				</view>
				<view class="flexRow noticeContent" @tap="goNewestNotice">
					<view class="singleEllipsis color_919397" style="flex: 1;">
						{{ $isEmpty(newestNotice.title)?'':newestNotice.title }}
					</view>
					<image v-if="oss" class="rightImg" :src="oss+'icon_right_gray.png'"></image>
				</view>
				<view class="flexRow assetsContent" @tap="goDataAssets">
					<view class="">
						数据资产
					</view>
					<image v-if="oss" class="rightImg" :src="oss+'icon_right_gray.png'"></image>
				</view>
				<view class="flexRow" style="padding-top: 36rpx;padding-bottom: 34rpx;border-bottom: 1px solid #EFF0F150;" @tap='goDonate'>
					<view class="" style="font-size: 30rpx;line-height: 42rpx;color: #272727;">
						捐赠
					</view>
					<image v-if="oss" class="rightImg" :src="oss+'icon_right_gray.png'"></image>
				</view>
				<view v-if="adminStatus!=0" class="flexRow assetsContent" @tap="goEdit">
					<view class="">
						编辑
					</view>
					<image v-if="oss" class="rightImg" :src="oss+'icon_right_gray.png'"></image>
				</view>
				<view v-if="adminStatus!=0" class="flexRow assetsContent" @tap="goManageEdit">
					<view class="">
						管理设置
					</view>
					<image v-if="oss" class="rightImg" :src="oss+'icon_right_gray.png'"></image>
				</view>
				<view class="flexRow assetsContent" @tap="goSoCode">
					<view class="flexRow" style="flex: 1;">
						<view class="">
							组织二维码
						</view>
						<image v-if="oss" :src="oss+'icon_qrCode.png'" class="qrCodeImg"></image>
					</view>
					<image v-if="oss" class="rightImg" :src="oss+'icon_right_gray.png'"></image>
				</view>
				<view class="flexRow assetsContent">
					<view class="">
						设为置顶
					</view>
					<view style="margin-right: -16rpx;">
						<switch color="#F74437" :checked="org.isTop==1" @change="switchChange" style="transform:scale(0.7)" />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		imageError,
		soImageError
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				id: '',
				soInfo: '',
				org: '',
				memberList: [],
				memberNum: '',
				newestNotice: '',
				oss: '',
				userId: '',
				adminStatus: ''
			}
		},
		onLoad(options) {
			this.oss = this.$oss
			const {
				id
			} = options
			this.id = id
		},
		onShow() {
			this.$http.get(`admin/app/org/workplace/v2/${this.id}`).then(res => {
				this.soInfo = res.data.data;
				this.org = res.data.data.org;
				// console.log(this.org.avatar)
				this.org.avatar = soImageError(this.org.avatar, this.oss)
				// console.log(this.org.avatar)
				this.memberList = res.data.data.members
				this.memberList.forEach(item => {
					item.avatar = imageError(item.avatar, this.oss)
				})
				this.memberNum = res.data.data.memberNum
				this.adminStatus = this.org.isAdmin;
				this.newestNotice = res.data.data.newestNotice;
			})
		},
		onShareAppMessage(res) {
			this.$http.post('admin/mark/save', {
				section: 'org', //板块
				relationId: this.org.orgId,
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
				console.log(res.target)
			}
			return {
				title: '我分享了【' + this.org.name + '】的名片，快去看看吧',
				path: '/pages/find/soCard/soCard?id=' + this.org.orgId
			}
		},
		methods: {
			goDonate(){
				uni.navigateTo({
					url:`/pages/contacts/soWorkbench/soDonate/soDonate?orgId=${this.soInfo.org.orgId}&name=${this.soInfo.org.name}&avatar=${this.soInfo.org.avatar}`
				})
			},
			goDataAssets() {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/dataAssets/dataAssets?orgId=${this.soInfo.org.orgId}&isAdmin=${this.soInfo.org.isAdmin}`
				})
			},
			goSoCode() {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soCode/soCode?avatar=${this.soInfo.org.avatar}&name=${this.soInfo.org.name}&slogan=${this.soInfo.org.slogan}&orgId=${this.soInfo.org.orgId}`
				})
			},
			goManageEdit() {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/manageEdit/manageEdit?id=${this.org.orgId}`
				})
			},
			goMemberManagement() {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soMoreInfo/memberManagement/memberManagement?orgId=${this.org.orgId}&isAdmin=${this.soInfo.org.isAdmin}`
				})
			},
			goEdit() {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/editSoInfo/editSoInfo?id=${this.org.orgId}`
				})
			},
			goCannerCard(item) {
				uni.navigateTo({
					url: `/pages/find/cannerCard/cannerCard?id=${item.id}`
				})
			},
			addMember() {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soMoreInfo/memberManagement/addMembers/addMembers?id=${this.org.orgId}`
				})
			},
			goNewestNotice() {
				if (this.newestNotice.title == '神秘的组织还未发布第一条通知' && this.adminStatus == 0) {
					uni.showToast({
						title: '负责人很懒,还未发布通知',
						icon: "none"
					})
				} else if (this.newestNotice.title == '神秘的组织还未发布第一条通知' && this.adminStatus != 0) {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/addNotice/addNotice?id=${this.org.orgId}&adminStatus=${this.adminStatus}`
					})
				} else {
					uni.navigateTo({
						// url: `/pages/contacts/soWorkbench/soNotice/soNotice?id=${this.newestNotice.sysInfoId}&adminStatus=${this.adminStatus}`
						url: `/pages/contacts/soWorkbench/soNotice/noticeList/noticeList?orgId=${this.org.orgId}&adminStatus=${this.adminStatus}`
					})
				}
			},
			goSoCard(soInfo) {
				uni.navigateTo({
					url: `/pages/find/soCard/soCard?id=${soInfo.org.orgId}`
				})
			},
			goActivity(soInfo, item) {
				if (item.moduleId == 1) {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soActivity/soActivity?orgId=${soInfo.org.orgId}`
					})
				}
				if (item.moduleId == 2) {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soMaterial/soMaterial?orgId=${soInfo.org.orgId}`
					})
				}
				if (item.moduleId == 5) {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/soQuestionnaire?orgId=${soInfo.org.orgId}`
					})
				}
				if (item.moduleId == 6) {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soSummary/soSummary?orgId=${soInfo.org.orgId}`
					})
				}
				if (item.moduleId == 7) {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soRecruit/soRecruit?orgId=${soInfo.org.orgId}`
					})
				}
				if (item.moduleId == 8) {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soExamination/soExamination?orgId=${soInfo.org.orgId}`
					})
				}
				if (item.moduleId == 9) {
					uni.navigateTo({
						url: `/pages/ican/publishService/publishService?orgName=${this.org.name}&orgId=${this.org.orgId}`
					})
				}
				if(item.moduleId == 10){
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soCooperation/soCooperation?orgId=${soInfo.org.orgId}&name=${soInfo.org.name}&isAdmin=${soInfo.org.isAdmin}`
					})
				}
			},
			switchChange() {
				if (this.org.isTop == 0) {
					this.$http.get('admin/app/top/so/' + this.org.orgId).then(res => {
						this.org.isTop = 1
						uni.$emit('topStatus',true)
					})
				} else {
					this.$http.get('admin/app/top/so/' + this.org.orgId).then(res => {
						this.org.isTop = 0
						uni.$emit('topStatus',true)
					})
				}
			}
		}
	}
</script>
<style lang="scss">
	.onwer{
		width: 70rpx;
		height: 26rpx;
		position: absolute;
		top: -8rpx;
		right: -44rpx;
	}
	.manager{
		width: 60rpx;
		height: 26rpx;
		position: absolute;
		top: -8rpx;
		right: -36rpx;
	}
	.memberWrap{
		padding: 32rpx 32rpx 16rpx;
		margin-bottom: 16rpx;
		border-radius: 16rpx;
		background-color: #FFFFFF;
	}
	.actionsWrap{
		padding: 0px 32rpx;
		border-radius: 16rpx;
		background-color: #FFFFFF;
	}
	.qrCodeImg {
		width: 36rpx;
		height: 36rpx;
		margin-right: -16rpx;
	}

	.assetsContent {
		padding-top: 36rpx;
		padding-bottom: 34rpx;
		border-bottom: 1rpx solid #EFF0F150;
		font-size: 30rpx;
		line-height: 42rpx;
		color: #272727;
	}

	.noticeContent {
		padding-bottom: 36rpx;
		border-bottom: 1rpx solid #EFF0F150;
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.noticeTitle {
		font-size: 30rpx;
		line-height: 42rpx;
		margin-bottom: 48rpx;
		padding-top: 34rpx;
		color: #272727;
	}

	.memberContent {
		display: grid;
		grid-template-columns: repeat(5,1fr);
		grid-column-gap: 44rpx;

		.memberAvatar {
			width: 92rpx;
			height: 92rpx;
			border-radius: 50%;
			margin-bottom: 16rpx;
			vertical-align: top;
		}

		.realName {
			font-size: 24rpx;
			line-height: 34rpx;
			width: 92rpx;
			text-align: center;
		}

		.addImg {
			width: 92rpx;
			height: 92rpx;
		}
	}

	.moduleContent {
		flex-wrap: wrap;
		background-color: #FFFFFF;
		margin-bottom: 16rpx;
		padding:24rpx 10rpx 8rpx 12rpx;
		border-radius: 16rpx;

		.moduleImg {
			width: 136rpx;
			height: 120rpx;
		}
	}

	.tagList {
		font-size: 20rpx;
		line-height: 28rpx;
		background-color: #F4F5F6;
		padding: 4rpx 10rpx;
		border-radius: 10rpx;
		max-width: 120rpx;
	}

	.levelImg {
		width: 40rpx;
		height: 44rpx;
	}

	.container {
		background-color: #F5F7F8;
		padding: 16rpx 24rpx;
		.containerTitle {
			// padding-top:40rpx;
			padding: 32rpx;
			background-color: #FFFFFF;
			border-radius: 16rpx;
			margin-bottom: 16rpx;

			.flexRowStart {
				.img {
					width: 132rpx;
					height: 132rpx;
					border-radius: 50%;
					margin-right: 24rpx;
				}

				.titleWrap {
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: space-between;
					height: 132rpx;

					.orgName {
						font-size: 32rpx;
						line-height: 44rpx;
						color: #272727;
						// max-width: 440rpx;
					}

					.orgId {
						font-size: 24rpx;
						margin-bottom: 10rpx;
					}

					.orgSlogan {
						font-size: 24rpx;
						line-height: 34rpx;
						margin-top: 8rpx;
						margin-bottom: 12rpx;
						width: 440rpx;
					}
				}
			}

		}

		.rightImg {
			width: 44rpx;
			height: 44rpx;
			margin-right: -16rpx;
			margin-left: 20rpx;
		}

		.memberRight {
			width: 44rpx;
			height: 44rpx;
		}

		.newestNotice {
			margin-top: 60rpx;

			.newestNoticeTitle {
				font-size: 32rpx;
				margin-bottom: 40rpx;
			}

			.newestNoticeInfo {
				margin-bottom: 20rpx;
				background-color: #F4F5F6;
				border-radius: 30rpx;

				.title {
					padding: 30rpx;
					line-height: 2;
					font-size: 28rpx;
				}
			}
		}


		.addBtn {
			position: fixed;
			bottom: 200rpx;
			right: 6rpx;

			image {
				height: 152rpx;
				width: 152rpx;
			}
		}
	}
</style>
