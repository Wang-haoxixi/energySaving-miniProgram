<template>
	<view class="container">
		<view class="flexRowStart records" v-for="(item,index) of list.records" :key="index">
			<image :src="item.avatar" mode="aspectFill" class="avatarImg"></image>
			<view class="name">
				{{$isEmpty(item.name)?'':item.name}}
			</view>
			<view v-if="item.isFollowed==0" class="button attentionBtn" @tap="attentionMember(item)">
				+关注
			</view>
			<view v-else class="button attentionBtn" style="color: #919397;background-color: #F4F5F6;" @tap="attentionMember(item)">
				已关注
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getCompanyStation,
		soImageError
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				list: [],
				userId: '',
				oss: ''
			};
		},
		methods: {
			getCompanyStation,
			attentionMember(item) {
				if (item.isFollowed == 0) {
					this.$http.post('admin/follow/user', {
						userId: this.userId,
						followId: item.orgId,
						sign: 0,
						type: 2
					}).then(res => {
						if (res.data.code == 0) {
							item.isFollowed = 1
						}
					})
				} else {
					this.$http.post('admin/follow/user', {
						userId: this.userId,
						followId: item.orgId,
						sign: 1,
						type: 2
					}).then(res => {
						if (res.data.code == 0) {
							uni.showToast({
								title: "取消关注成功",
								icon: "none",
							});
							item.isFollowed = 0
						}
					})
				}
			}
		},
		onLoad(option) {
			this.oss = this.$oss;
			this.userId = uni.getStorageSync('userinfo').user_id;
			uni.setNavigationBarTitle({
				title: option.typeDesc
			});
			this.$http.get('dms/product/org/recommend_page', {
				params: {
					current: 1,
					size: 20
				}
			}).then(res => {
				this.list = res.data.data;
				this.list.records.forEach(item => {
					item.avatar=soImageError(item.avatar, this.oss)
				})
			});

		}
	}
</script>

<style lang="scss">
	.container {
		padding: 60rpx 32rpx;

		.records {
			margin-bottom: 48rpx;
			position: relative;

			.avatarImg {
				width: 92rpx;
				height: 92rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}

			.name {
				flex: 1;
				margin-left: 24rpx;
				font-size: 28rpx;
			}
		}
	}

	.attentionBtn {
		padding: 0;
		font-size: 24rpx;
		width: 96rpx;
		height: 42rpx;
		border-radius: 22rpx;
		margin-left: 30rpx;
	}
</style>
