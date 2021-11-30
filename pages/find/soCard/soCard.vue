<template>
	<view class="container" v-if="data.bgImg" :style="{background:'url('+data.bgImg+') no-repeat',backgroundSize: '100% 548rpx'}">
		<view :style="{ height: systemInfo.statusBarHeight + 'px' }"></view>
		<view class="flexRowStart"
			:style="{height:menuButton.height +(menuButton.bottom -systemInfo.statusBarHeight -menuButton.height) *2 +'px',width:systemInfo.safeArea.width -(systemInfo.safeArea.width - menuButton.left) +'px',padding:'0 0 ' +(menuButton.bottom -systemInfo.statusBarHeight -menuButton.height +'px'),lineHeight: menuButton.height + 'px',}">
			<view class="flexRowStart">
				<image :src="$ossUrl('soCard_back.png')" mode="" style="width: 56rpx;height: 56rpx;margin-left: 18rpx;" @tap="back"></image>
				<view class="card_title">
					组织名片
				</view>
			</view>
		</view>
		<view class="page" style="margin-top: 126rpx;margin-bottom: 22rpx;">
			<view class="flexRow" style="justify-content: flex-end;margin-right: 8rpx;" @tap="changeBg" v-if="data.createBy == userId">
				<view class="change" style="margin-bottom: 32rpx;">
					更换
				</view>
			</view>
			<view class="baseContainer">
				<view class="title">
					<view>
						<view class="titlename">
							<view class="name">{{$isEmpty(data.name)?'暂无':data.name}}</view>
						</view>
						<view class="profession">
							{{$isEmpty(data.industry)?'暂无行业':data.industry.split('-')[0]}}
						</view>
						<view class="tag" v-if="data.abilityTag && data.abilityTag.length>0"><text v-for="(item,index) in data.abilityTag" :key="index" v-if="index<3">{{item}} <text class="tag-point"
								 v-if="index<data.abilityTag.length-1 && index<2">/</text></text></view>
						<view class="tag" v-if="$isEmpty(data.abilityTag)">
							暂无标签
						</view>
					</view>
					<image v-if="data.avatar" class="avatar" mode="aspectFill" :src="soImageError(data.avatar,$oss)">
					</image>
				</view>
				<view class="content">
					<!-- <image class="content-topimg" :src="$ossUrl('bg_find_card_tab.png')"></image> -->
					<view class="content-text">
						{{$isEmpty(data.slogan)?'精彩组织名片，未来组织窗口':data.slogan}}
					</view>
				</view>
				<view class="end">
					<view class="location">
						<image class="icon" :src="$ossUrl('soCard_location.png')"></image>
						<view class="text">{{$isEmpty(data.region)?'暂无':data.region}}</view>
					</view>
					<view class="button-list">
						<view v-if="data.isFollowed == 1" class="attentioned" @tap="attentionSo">已关注</view>
						<view v-else class="attention" @tap="attentionSo">+关注</view>
					</view>
				</view>
			</view>
			<view class="moreContainer">
				<view class="title">
					<image class="title-icon" :src="$ossUrl('soCard_intro.png')"></image>
					<view class="title-text">
						组织介绍
					</view>
					<view v-if="!$isEmpty(data.introduction)" class="more" @tap="soIntroduction(data)">
						<view class="more-text">查看更多</view>
						<image class="more-icon" :src="$ossUrl('contact_arrowright.png')"></image>
					</view>
				</view>
				<view class="content-text introduction">
					{{$isEmpty(data.introduction)?'暂无介绍':data.introduction}}
				</view>
			</view>
			<view class="moreContainer">
				<view class="title">
					<image class="title-icon" :src="$ossUrl('soCard_data.png')"></image>
					<view class="title-text">
						数据
					</view>
					<!-- <view class="more">
						<view class="more-text">查看更多</view>
						<image class="more-icon" :src="$ossUrl('contact_arrowright.png')"></image>
					</view> -->
				</view>
				<view class="sodata">
					<view class="sodata-item">
						<view class="sodata-item-top">
							{{$isEmpty(data.product)?'0':data.product}}
						</view>
						<view class="sodata-item-end">
							服务
						</view>
					</view>
					<view class="sodata-item">
						<view class="sodata-item-top">
							{{$isEmpty(data.material)?'0':data.material}}
						</view>
						<view class="sodata-item-end">
							材料
						</view>
					</view>
					<view class="sodata-item">
						<view class="sodata-item-top">
							{{$isEmpty(data.bellAssets)?'0':data.bellAssets}}
						</view>
						<view class="sodata-item-end">
							能贝
						</view>
					</view>
					<view class="sodata-item">
						<view class="sodata-item-top">
							{{$isEmpty(data.taskCount)?'0':data.taskCount}}
						</view>
						<view class="sodata-item-end">
							任务
						</view>
					</view>
					<!-- <view class="sodata-item">
						<view class="sodata-item-top">
							{{$isEmpty(data.recruit)?'0':data.recruit}}
						</view>
						<view class="sodata-item-end">
							职位
						</view>
					</view> -->
				</view>
			</view>
			<view class="moreContainer">
				<view class="title">
					<image class="title-icon" :src="$ossUrl('soCard_member.png')"></image>
					<view class="title-text">
						成员
					</view>
					<view class="more">
						<view class="more-text">{{$isEmpty(data.memberNum)?'':'共' + data.memberNum + '人'}}</view>
					</view>
				</view>
				<view class="members">
					<view class="members-item" v-for="(item,index) in data.members" :key="index" v-if="index<4" @tap="goCannerCard(item.userId)">
							<view class="" style="position: relative;">
								<image :src="imageError(item.avatar,$oss)" class="members-avatar"></image>
								<image :src="$ossUrl('soCard_owner.png')" mode="" v-if="item.type==2" class="onwer"></image>
								<image :src="$ossUrl('soCard_manager.png')" mode="" v-if="item.type==1" class="manager"></image>
							</view>
							
						<view class="members-item-name">
							<view class="members-item-name-text singleEllipsis">
								{{item.realName}}
							</view>
						</view>
					</view>
					<view class="members-other" v-if="data.members && data.members.length>=5">
						<view class="other-view">
							<image class="other-icon" :src="$ossUrl('soCard_more_member.png')"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="safe-bottom" style="height: 148rpx;">
		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="popup_input">
				<textarea :placeholder="placeholder" placeholder-class="inputDefault" v-model="input" fixed="true" adjust-position="true"
				 show-confirm-bar="false" cursor-spacing="80"></textarea>
				<view v-if="input.length>0" class="color_F74437" style="margin-left: 20rpx;" @tap="sendInput">发送</view>
				<view v-else style="margin-left: 20rpx;color: #F7443780;">发送</view>
			</view>
		</uni-popup>
		<bottom-button>
			<button class=" share" open-type="share">分享</button>
			<view v-if="data.isJoin == 0" class=" join" @tap="commentsOpen('forward',0,0)">申请加入</view>
			<view v-if="data.isJoin == 1" class=" join" @tap="goWork">进入组织</view>
		</bottom-button>
	</view>
</template>

<script>
	import {
		goCannerCard,
		soImageError,
		imageError
	} from '@/common/utils.js';
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import bottomButton from '@/components/bottomButton/bottomButton.vue';
	export default {
		components: {
			uniPopup,
			bottomButton
		},
		data() {
			return {
				data: '',
				modal: '',
				avatar: '',
				abilityTagSize: '',
				isLogin: false,
				userId: '',
				status: false,
				input: '',
				placeholder: '请输入申请理由',
				id: '',
				systemInfo: '',
				menuButton: '',
			};
		},
		methods: {
			soImageError,
			imageError,
			changeBg(){
				let that = this
				uni.chooseImage({
					count: 1, //默认9
					// sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album','camera'],
					success: function(res) {
						uni.uploadFile({
							// src: res.tempFilePaths[0],
							// success: function(image) {
							// 	that.soInfo.org.avatar = image.path
							// }
							url: `${that.$http_url}admin/file/app/sftp/upload`,//开发者服务器地址
							header: {
								"Content-Type": "multipart/form-data",
								"Authorization":uni.getStorageSync('token')
							},
							filePath: res.tempFilePaths[0], //要上传文件资源的路径
							name: "file", //文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
							success: (res) => {
								// console.log(JSON.parse(res.data).data[0])
								if(res.statusCode==200){
									let url = JSON.parse(res.data).data[0]
									that.$http.post('admin/org/set_bg_img',{
										orgId:that.data.orgId,
										bgImg:url
									}).then(res=>{
										that.data.bgImg =url
									})
									// uni.$emit('avatarStatus',true)
								}
							}
						});
					}
				});
			},
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
			goWork(){
				uni.navigateTo({
					url:'/pages/contacts/soWorkbench/soWorkbench?id=' +this.data.orgId
				})
			},
			goCannerCard,
			commentsOpen(type, commentId, reReplyId, info) {
				if(this.isLogin){
					uni.navigateTo({
						url: "/pages/getUserInfo/getUserInfo"
					})
				}else{
					if(this.data.isCharge == true){
						uni.navigateTo({
							url:`/pages/find/soCard/soCharge/soCharge?cost=${this.data.cost}&orgId=${this.data.orgId}`
						})
					}else{
						this.$refs.popup.open()
					}
				}
			},
			sendInput() {
				let that = this
				// console.log(this.input)
				that.$http.post('admin/org/apply', {
					orgId: that.data.orgId,
					message: that.input
				}).then(res => {
					// console.log(res)
					if (res.data.code == 0) {
						uni.showToast({
							title: '申请成功',
							icon: "success",
							duration: 1000,
							success: () => {
								setTimeout(() => {
									that.input = ''
									that.$refs.popup.close()
								}, 1000)
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
			},
			attentionSo() {
				if (this.data.isFollowed == 0) {
					this.$http.post('admin/follow/user', {
						userId: this.userId,
						followId: this.data.orgId,
						sign: 0,
						type: 2
					}).then(res => {
						if (res.data.code == 0) {
							this.data.isFollowed = 1;
						}
					})
				} else if (this.data.isFollowed == 1) {
					this.$http.post('admin/follow/user', {
						userId: this.userId,
						followId: this.data.orgId,
						sign: 1,
						type: 2
					}).then(res => {
						if (res.data.code == 0) {
							this.data.isFollowed = 0;
							uni.showToast({
								title: "取消关注成功",
								icon: "none",
							})
						}
					})

				}

			},
			soIntroduction() {
				uni.navigateTo({
					url: 'soIntroduction/soIntroduction?introduction=' + this.data.introduction
				})
			}
		},
		onLoad(options) {
			const {
				id
			} = options
			this.id = id;
			this.userId = uni.getStorageSync('userinfo').user_id
			this.menuButton = uni.getMenuButtonBoundingClientRect();
			this.systemInfo = uni.getSystemInfoSync();
		},
		onShow() {
			this.isLogin=this.$isEmpty(uni.getStorageSync('token'))
			this.$http.get('admin/app/open/org/so/' + this.id).then(res => {
				// console.log(res)
				this.data = res.data.data
				this.avatar = res.data.data.avatar;
			});
		},
		onShareAppMessage(res) {
			this.$http.post('admin/mark/save', {
				section: 'org', //板块
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
			});
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '我分享了【' + this.data.name + '】的名片，快去看看吧',
				path: '/pages/find/soCard/soCard?id=' + this.id
			}
		},
		onShareTimeline(res) {
			this.$http.post('admin/mark/save', {
				section: 'org', //板块
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
			});
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '我分享了【' + this.data.name + '】的名片，快去看看吧',
				imageUrl: this.avatar
			}
		}
	};
</script>

<style lang="scss">
	.change{
		width: 100rpx;
		height: 42rpx;
		font-size: 24rpx;
		line-height: 42rpx;
		background:rgba(255,255,255,.17);
		color: #FFFFFF;
		border-radius: 38rpx;
		text-align: center;
	}
	page{
		background-color: #f5f7f8;
	}
	.card_title{
		font-size: 36rpx;
		line-height: 50rpx;
		font-weight: bold;
		color: #FFFFFF;
		margin-left: 230rpx;
	}
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
	page {
		background-color: #F4F5F6;
	}

	.share {
		flex: 1;
		color: #272727;
		background-color: #ECEEF0;
		height: 92rpx;
		font-size: 30rpx;
		line-height: 92rpx;
		border-radius: 64rpx;
		text-align: center;
		padding: 0rpx;
	}

	.join {
		flex: 1;
		margin-left: 22rpx;
		// background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
		background-color: #46B28B;
		border-radius: 64rpx;
		height: 92rpx;
		line-height: 92rpx;
		font-size: 30rpx;
		text-align: center;
		
		color: #FFFFFF;
	}

	.page {
		padding: 0 24rpx;

		.baseContainer {
			padding: 32rpx;
			background-color: #FFFFFF;
			box-shadow: 0px 6rpx 28rpx rgba(161, 193, 237, 0.16);
			border-radius: 16rpx;

			.icon {
				height: 24rpx;
				width: 20rpx;
			}

			.title {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.titlename {
					display: flex;

					.name {
						font-size: 32rpx;
						line-height: 44rpx;
						color: #303031;
						font-weight: bold;
					}

					.levelImg {
						margin-left: 10rpx;
						width: 40rpx;
						height: 44rpx;
					}
				}

				.profession {
					margin-top: 16rpx;
					color: #919397;
					font-size: 24rpx;
					line-height: 34rpx;
				}

				.tag {
					margin-top: 16rpx;
					color: #919397;
					font-size: 24rpx;
					line-height: 34rpx;

					.tag-point {
						margin: 0 12rpx;
					}
				}

				.avatar {
					width: 132rpx;
					height: 132rpx;
					border-radius: 50%;
				}
			}

			.content {
				border-radius: 12rpx;
				// width: 610rpx;
				margin-top: 24rpx;
				background-color: #F5F7F8;

				.content-topimg {
					width: 610rpx;
					height: 40rpx;
				}

				.content-text {
					padding: 24rpx;
					color: #9AA1A7;
					font-size: 24rpx;
					line-height: 34rpx;

					// .company {
					// 	color: #666769;
					// 	font-size: 28rpx;
					// 	line-height: 40rpx;
					// }
				}
			}

			.end {
				margin-top: 32rpx;
				display: flex;
				justify-content: space-between;

				.location {
					display: flex;
					align-items: center;

					.text {
						margin-left: 10rpx;
						font-size: 22rpx;
						line-height:32rpx;
						color: #565B5F;
					}
				}

				.button-list {
					display: flex;
					align-items: center;
					font-size: 26rpx;
					line-height: 52rpx;

					.share {
						color: #919397;
						font-weight: bold;
						width: 136rpx;
						background-color: #F4F5F6;
						border-radius: 33rpx;
						text-align: center;
						padding: 8rpx 0;
					}

					.attention {
						margin-left: 20rpx;
						color: #FFFFFF;
						width: 140rpx;
						border-radius: 42rpx;
						text-align: center;
						height: 52rpx;
						// background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
						background-color: #46B28B;
					}

					.attentioned {
						margin-left: 20rpx;
						color: #FFFFFF;
						width: 140rpx;
						// background-color: #FFD6D6;
						background-color: #C7E8DC;
						border-radius: 42rpx;
						text-align: center;
						height: 52rpx;
					}
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
					color: #303031;
					font-size: 32rpx;
					line-height: 44rpx;
					flex: 1;
				}

				.more {
					display: flex;
					align-items: center;

					.more-text {
						color: #BABEC0;
						font-size: 28rpx;
						line-height: 40rpx;
					}

					.more-icon {
						width: 14rpx;
						height: 40rpx;
						margin-left: 16rpx;
					}
				}
			}

			.sodata {
				margin-top: 32rpx;
				margin-left: -40rpx;
				margin-right: -40rpx;
				padding: 16rpx 0;
				display: flex;
				justify-content: center;
				align-items: center;

				.sodata-item {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;

					.sodata-item-top {
						line-height: 42rpx;
						font-size: 36rpx;
						color: #303031;
						font-weight: bold;
					}

					.sodata-item-end {
						margin-top: 10rpx;
						font-size: 24rpx;
						color: #919397;
						line-height: 34rpx;
					}
				}
			}

			.members {
				margin-top: 32rpx;
				display: flex;

				.members-item {
					width: 92rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					margin-right: 44rpx;
					
						.members-avatar {
							height: 92rpx;
							width: 92rpx;
							border-radius: 50%;
						}
					


					.members-item-name {
						color: #666769;
						font-size: 20rpx;
						line-height: 28rpx;
						display: flex;
						margin-top: 16rpx;
						align-items: center;
						justify-content: center;

						.members-item-name-text {
							max-width: 92rpx;
						}

						.levelImg {
							margin-left: 2rpx;
							width: 24rpx;
							height: 24rpx;
						}
					}
				}

				.members-other {
					display: flex;
					justify-content: center;

					.other-view {
						height: 92rpx;
						width: 92rpx;
						border-radius: 50%;
						margin-left: 8rpx;

						.other-icon {
							width: 92rpx;
							height: 92rpx;
						}
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
					height: 76rpx;
					width: 76rpx;
					border-radius: 20rpx;
				}

				.so-name {
					margin-left: 20rpx;
					color: #666769;
					font-size: 28rpx;
					line-height: 40rpx;
					width: 504rpx;
				}
			}

			.content-text {
				color: #666769;
				font-size: 28rpx;
				line-height: 48rpx;
				margin-top: 30rpx;
			}

			.introduction {
				display: block;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 5;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
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
</style>
