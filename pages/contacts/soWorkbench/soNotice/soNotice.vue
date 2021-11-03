<template>
	<view class="">
		<view style="margin: 32rpx">
			<view class="flexRowStart" style="margin-bottom: 60rpx;">
				<image :src="noticeInfo.senderAvatar" class="senderAvatarImg"></image>
				<view class="">
					<view class="color_303031 senderName">
						{{$isEmpty(noticeInfo.senderName)?'':noticeInfo.senderName}}
					</view>
					<view class="color_919397 timeInfo">
						{{$isEmpty(noticeInfo.time)?'':noticeInfo.time}}
					</view>
				</view>
			</view>
			<view class="color_303031 bold nameInfo">
				{{$isEmpty(noticeInfo.name)?'':noticeInfo.name}}
			</view>
			<view class="color_666769" style="font-size: 28rpx;line-height: 48rpx;">
				{{$isEmpty(noticeInfo.content)?'':noticeInfo.content}}
			</view>
			<view class="bottom-safe" style="height: 112rpx;"></view>
		</view>
		<view class="btn" v-if="adminStatus!=0">
			<view class="button freeBtn" @tap="editNotice">
				编辑
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				noticeInfo:{},
				orgId:'',
				adminStatus:'',
				id:''
			};
		},
		onLoad(options) {
			const { id ,adminStatus } =options
			this.adminStatus =adminStatus
			this.id=id
			// console.log(this.id)
		},
		onShow() {
			this.$http.get('ims/sys_msg/' + this.id).then(res=>{
				console.log(res)
				this.noticeInfo = res.data.data
				this.orgId =this.noticeInfo.dataId
			})
		},
		methods:{
			editNotice(){
				uni.navigateTo({
					url:`/pages/contacts/soWorkbench/addNotice/addNotice?id=${this.orgId}&title=${this.noticeInfo.name}&titleInfo=${this.noticeInfo.content}&isTop=${this.noticeInfo.isTop}&sysId=${this.noticeInfo.id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.nameInfo{
		font-size: 32rpx;
		line-height: 52rpx;
		margin-bottom: 40rpx;
	}
	.timeInfo{
		font-size: 22rpx;
		line-height: 32rpx;
	}
	.senderName{
		font-size: 28rpx;
		line-height: 40rpx;
		margin-bottom: 10rpx;
	}
	.senderAvatarImg{
		width: 92rpx;
		height: 92rpx;
		border-radius: 50%;
		margin-right: 24rpx;
	}
	.btn{
		width: 100%; 
		background-color: #FFFFFF;
		z-index: 666; 
		position: fixed;
		bottom: 0rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		.freeBtn{
			width:686rpx;
			margin: 24rpx 32rpx
		}
	}
	.bottom-safe {
			/* iphonex 等安全区设置，底部安全区适配 */
			/* #ifndef APP-NVUE */
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			/* #endif */
		}
</style>
