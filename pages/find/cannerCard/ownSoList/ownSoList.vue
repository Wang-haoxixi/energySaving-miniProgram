<template>
	<view class="container">
		<view class="flexRow" v-for="(item,index) of soList" :key="index" style="margin-bottom: 60rpx;" @tap="goSoDetail(item)">
			<view class="flexRowStart content">
				<image :src="item.avatar" class="avatarImg"></image>
				<view class="color_30303 name">
					{{$isEmpty(item.name)?'':item.name}}
				</view>
			</view>
			<view class="color_919397 bold joinStatus" style="background:rgba(244,245,246,1);" v-if="item.isJoin==1">
				已加入
			</view>
			<view class="color_F74437 bold joinStatus" style="background:rgba(247,68,55,.1);" v-if="item.isJoin==0"  @tap.stop="commentsOpen('share',item)">
				+组织
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
		soImageError
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				soList:[],
				oss:'',
				placeholder : '请输入申请内容',
				input:'',
				orgId:''
			};
		},
		onLoad(options) {
			this.oss =this.$oss
			const {id} = options
			console.log(id)
			let userId =parseInt(id)
			this.$http.get('admin/app/user/had/list/judge',{
				params:{
					type:0,
					userId:userId,
					charge:0
				}
			}).then(res=>{
				console.log(res)
				this.soList=res.data.data
				this.soList.forEach(item => {
					item.avatar=soImageError(item.avatar, this.oss)
				})
			})
		},
		methods:{
			goSoDetail(item){
				if(item.isJoin==1){
					uni.navigateTo({
						url: '/pages/contacts/soWorkbench/soWorkbench?id=' + item.orgId
					})
				}else{
					uni.navigateTo({
						url: '/pages/find/soCard/soCard?id=' + item.orgId
					})
				}
			},
			commentsOpen(type, item) {
				this.orgId = item.orgId
				this.$refs.popup.open()
			},
			sendInput() {
				let that = this
				that.$http.post('admin/org/apply', {
					orgId: that.orgId,
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
							title: `${res.data.message}`,
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		margin: 32rpx;
		.content{
			margin-right: 20rpx;
			flex: 1;
			.avatarImg{
				width: 92rpx;
				height: 92rpx;
				border-radius: 50%;
				margin-right: 24rpx;
			}
			.name{
				font-size: 28rpx;
				line-height: 40rpx;
			}
		}
		.joinStatus{
			font-size: 24rpx;
			line-height: 50rpx;
			border-radius: 24rpx;
			width: 118rpx;
			height: 50rpx;
			text-align: center;
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
