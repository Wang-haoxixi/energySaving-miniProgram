<template>
	<view class="container" v-if="oss" :style="{background: 'url('+ $ossUrl('soCode_bg.png')+') no-repeat',backgroundSize: '100% 100%'}">
		<view :style="{ height: systemInfo.statusBarHeight + 'px' }"></view>
		<view class="flexRowStart"
			:style="{height:menuButton.height +(menuButton.bottom -systemInfo.statusBarHeight -menuButton.height) *2 +'px',width:systemInfo.safeArea.width -(systemInfo.safeArea.width - menuButton.left) +'px',padding:'0 0 ' +(menuButton.bottom -systemInfo.statusBarHeight -menuButton.height +'px'),lineHeight: menuButton.height + 'px',}">
			<view class="flexRowStart">
				<image :src="$ossUrl('black_back.png')" mode="" style="width: 56rpx;height: 56rpx;margin-left: 16rpx;" @tap="back"></image>
				<view class="card_title">
					组织二维码
				</view>
			</view>
		</view>
		<view class="" style="padding: 0 48rpx;">
			<view class="content flexColumn">
				<image :src="avatar" class="avatarImg"></image>
				<view class="" style="flex: 1;margin-top: 104rpx">
					<view class="color_303031 bold nameInfo">
						{{$isEmpty(name)?'':name}}
					</view>
					<view class="color_919397" style="font-size: 28rpx;line-height: 40rpx;margin-bottom: 48rpx;text-align: center;">
						{{$isEmpty(slogan)?'做APP，就上组件宝':slogan}}
					</view>
				</view>
				<view class="" style="">
					<image v-if="!$isEmpty(codeUrl)" :src="codeUrl" style="width: 211px;height: 211px;" />
					<canvas class="canvas-hide" canvas-id="qrcode" style="width: 211px;height: 211px;" />
				</view>
				<view class="color_919397 titleInfo">
					扫描上方二维码，加入组织
				</view>
			</view>
			<view class="flexRow">
				<view class="button saveBtn flexRowStart" @tap='saveCode' style="margin-right: 30rpx;">
					<image :src="$ossUrl('soCode_savePhoto.png')" mode="" style="width: 28rpx;height: 28rpx;margin-right: 8rpx;"></image>
					<view class="">
						保存至相册
					</view>
				</view>
				<button class="button saveBtn flexRowStart" open-type="share">
					<image :src="$ossUrl('soCode_sharePhoto.png')" mode="" style="width: 28rpx;height: 28rpx;margin-right: 8rpx;"></image>
					<view class="">
						分享给微信好友
					</view>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import uQRCode from '@/common/uqrcode.js'
	export default {
		data() {
			return {
				orgId: '',
				name: '',
				slogan: '',
				avatar: '',
				codeUrl: '',
				systemInfo: '',
				menuButton: '',
				oss:''
			};
		},
		onLoad(options) {
			this.oss =this.$oss
			this.orgId = options.orgId
			// console.log(this.orgId)
			this.name = options.name
			this.slogan = options.slogan
			this.avatar = options.avatar
			this.make(this.orgId)
			this.menuButton = uni.getMenuButtonBoundingClientRect();
			this.systemInfo = uni.getSystemInfoSync();
		},
		onShareAppMessage(res) {
			this.$http.post('admin/mark/save', {
				section: 'org', //板块
				relationId: this.orgId,
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
				title: '我分享了【' + this.name + '】的二维码，快去看看吧',
				path: `/pages/contacts/soWorkbench/soCode/soCode?orgId=${this.orgId}&name=${this.name}&slogan=${this.slogan}&avatar=${this.avatar}`
			}
		},
		onShareTimeline(res) {
			this.$http.post('admin/mark/save', {
				section: 'user', //板块
				relationId: this.orgId,
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
				title: '我分享了【' + this.name + '】的二维码，快去看看吧',
				imageUrl: this.avatar
			}
		},
		methods: {
			saveCode(){
				uni.saveImageToPhotosAlbum({
					filePath:this.codeUrl,
					success:function(res){
						console.log(res)
						uni.showToast({
							title:"保存成功",
							icon:"none"
						})
					}
				})
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
			make(orgId) {
				uQRCode.make({
					canvasId: 'qrcode',
					componentInstance: this,
					text: `http://www.modulestore.cn:63083/?type=soShare&id=${orgId}`,
					size: 211,
					margin: 0,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					// correctLevel: uQRCode.defaults.correctLevel,
					success: res => {
						// console.log(res)
						this.codeUrl = res
						// console.log(this.codeUrl)
					}
					
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.card_title{
		font-size: 36rpx;
		line-height: 50rpx;
		font-weight: bolder;
		color: #272727;
		margin-left: 214rpx;
	}
	.titleInfo{
		font-size: 24rpx;
		line-height: 40rpx; 
		margin-top: 32rpx;
		margin-bottom: 48rpx;
	}
	.saveBtn{
		flex: 1;
		padding: 0;
		font-size: 30rpx;
		line-height: 42rpx;
		color: #272727;
		background: #FFFFFF;
		justify-content:center;
	}
	.canvas-hide {
		/* 1 */
		position: fixed;
		right: 100vw;
		bottom: 100vh;
		/* 2 */
		z-index: -9999;
		/* 3 */
		opacity: 0;
	}

	.container {
		height: 100vh;
		.content{
			margin-top: 156rpx;
			margin-bottom: 64rpx;
			width: 100%;
			background-color: #FFFFFF;
			border-radius: 32rpx;
			position: relative;
			.avatarImg{
				position: absolute;
				top: -80rpx;
				width: 160rpx;
				height: 160rpx;
				background: rgba(0, 0, 0, 0);
				border: 6rpx solid #FFFFFF;
				border-radius: 50%;
			}
			.nameInfo{
				font-size: 36rpx;
				line-height: 40rpx;
				margin-bottom: 8rpx;
				text-align: center;
			}
		}
	}
</style>
