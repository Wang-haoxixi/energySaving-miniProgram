<template>
	<view class="container">
		<view class="title" v-if="listInfo.total!=0" style="margin-bottom: 20rpx;">
			共{{$isEmpty(listInfo.total)?'':listInfo.total}}人
		</view>
		<view class="list" v-for="(item,index) of list" :key="index">
			<view class="color_666769 name">
				{{$isEmpty(item.name)?'':item.name}}
			</view>
		</view>
		<uni-load-more :status="listStatus"></uni-load-more>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		data() {
			return {
				list: [],
				listInfo: {},
				listStatus: "more"
			};
		},
		onLoad(options) {
			const {
				id
			} = options
			console.log(id)
			this.$http.get('dms/square_customer/page', {
				params: {
					id: id
				}
			}).then(res => {
				// console.log(res)
				this.listInfo = res.data.data
				console.log(this.listInfo)
				this.list = res.data.data.records
				if (this.listInfo.current == this.listInfo.pages) {
					this.listStatus = 'noMore';
				} else if (this.listInfo.pages == 0) {
					this.listStatus = 'noMore';
				}
			})
		},
		onReachBottom() {
			// console.log(666)
			let that = this;
			if (that.listInfo.current < that.listInfo.pages) {
				// console.log(6)
				that.listStatus = 'loading';
				that.$http.get('dms/square_customer/page', {
					params: {
						id: id,
						current: that.listInfo.current + 1
					}
				}).then(res => {
					// console.log(res)
					that.listInfo.current = res.data.data.current;
					// console.log(that.joinCurrent)
					that.list = that.list.concat(res.data.data.records);
					that.listStatus = 'more';
				});
			} else {
				// console.log(9)
				that.listStatus = 'noMore';
			}
		},
	}
</script>

<style lang="scss">
	.title {
		font-weight: bold;
		font-size: 32rpx;
		line-height: 44rpx;
	}

	.container {
		padding: 60rpx 40rpx;

		.list {
			padding: 24rpx 0;
			border-bottom: 0.3rpx solid #EFF0F1;

			.name {
				font-size: 28rpx;
				line-height: 40rpx;
			}
		}
	}
</style>
