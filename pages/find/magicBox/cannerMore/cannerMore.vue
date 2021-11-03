<template>
	<view class="container">
		<view class="flexRowStart records" v-for="(item,index) of list.records" :key="index">
			<image :src="item.avatar" mode="aspectFill" class="avatarImg"></image>
			<view class="content">
				<view class="color_303031 realName">
					{{$isEmpty(item.realName)?'':item.realName}}
				</view>
				<view class="color_919397 company">
					{{getCompanyStation(item.company,item.station)}}
				</view>
			</view>
			<view v-if="item.isFollow==0" class="button attentionBtn"
			 @tap="attentionMember(item)">
				+关注
			</view>
			<view v-else class="button attentionBtn" style="color: #919397;background-color: #F4F5F6;"
			 @tap="attentionMember(item)">
				已关注
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getCompanyStation,imageError
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				list: [],
				userId: '',
				oss:''
			};
		},
		methods: {
			getCompanyStation,
			attentionMember(item) {
				if (item.isFollow == 0) {
					this.$http.post('admin/follow/user', {
						userId: this.userId,
						followId: item.userId,
						sign: 0,
						type: 1
					}).then(res => {
						// console.log(res)
						if (res.data.code == 0) {
							item.isFollow = 1
						}
					})
				} else {
					this.$http.post('admin/follow/user', {
						userId: this.userId,
						followId: item.userId,
						sign: 1,
						type: 1
					}).then(res => {
						// console.log(res)
						if (res.data.code == 0) {
							uni.showToast({
								title: "取消关注成功",
								icon: "none",
								duration: 1000,
								success: () => {
									setTimeout(() => {
										item.isFollow = 0
									}, 1000)
								}
							})
						}
					})
				}
			}
		},
		onLoad(option) {
			this.oss=this.$oss
			this.userId = uni.getStorageSync('userinfo').user_id
			// console.log(option)
			uni.setNavigationBarTitle({
				title: option.typeDesc
			});
			this.$http.post('admin/follow/recommendPage', {
				current: 1,
				userId: this.userId,
				size: 20,
			}).then(res => {
				this.list = res.data.data;
				this.list.records.forEach(item=>{
					item.avatar=imageError(item.avatar,this.oss)
				})
			});

		}
	}
</script>

<style lang="scss">
.container{
	padding: 60rpx 40rpx;
	.records{
		margin-bottom: 68rpx;
		position: relative;
		.avatarImg{
			width: 76rpx;
			height: 76rpx;
			border-radius: 20rpx;
			margin-right: 20rpx;
		}
		.content{
			flex: 1;
			.realName{
				font-size: 28rpx;
				margin-bottom: 10rpx;
			}
			.company{
				font-size: 22rpx;
			}
		}
	}
}
.attentionBtn{
	padding: 0;
	font-size: 24rpx; 
	width: 96rpx;
	height: 42rpx;
	border-radius: 22rpx;
	margin-left: 30rpx;
}
</style>
