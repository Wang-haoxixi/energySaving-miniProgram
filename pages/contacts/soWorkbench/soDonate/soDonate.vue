<template>
	<view>
		<view class="container">
			<view class="" style="position: relative;">
				<image v-if="oss" :src="oss+'pic_donateBanner.png'" mode="aspectFit" style="width: 100%;margin-bottom: 30rpx;height: 270rpx;"></image>
				<view class="bold color_FFFFFF" style="font-size: 36rpx;line-height: 48rpx;position: absolute;top: 46rpx;left: 36rpx;">
					<view class="">
						捐赠宝贝
					</view>
					<view class="singleEllipsis" style="font-size: 32rpx;line-height: 48rpx;max-width: 320rpx;">
						共建{{$isEmpty(name)?'':name}}
					</view>
				</view>
				<image v-if="oss" :src="oss+'icon_donateBtn.png'" @tap="goDonate" mode="aspectFit" style="width: 124rpx;height: 38rpx;position: absolute;left: 36rpx;top: 172rpx;"></image>
			</view>
			<view class="flexRow color_919397" style="font-size: 28rpx;line-height: 40rpx;margin-bottom: 52rpx;">
				<view class="flexRowStart">
					<view class="">
						我已捐赠
					</view>
					<view class="">
						<text class="color_F74437" style="margin: 0rpx 20rpx;">{{$isEmpty( donateInfo.myAmount)?'0': donateInfo.myAmount.toFixed(2)}}</text>贝
					</view>
				</view>
				<view class="flexRowStart">
					<view class="">
						合计捐赠
					</view>
					<view class="">
						<text class="color_F74437" style="margin: 0rpx 20rpx;">{{$isEmpty(donateInfo.totalAmount)?'0':donateInfo.totalAmount.toFixed(2)}}</text>贝
					</view>
				</view>
			</view>
			<view class="" style="font-size: 28rpx;line-height: 40rpx;">
				<view class="bold" style=" margin-bottom: 32rpx;" v-if="donateList && donateList.records.length>0">
					捐赠名单
				</view>
				<view class="flexRowStart" style="margin-bottom: 28rpx;" v-for="(item,index) of donateList.records" :key="index">
					<view class="singleEllipsis" style="width: 110rpx;">
						{{$isEmpty(item.realName)?'':item.realName}}
					</view>
					<view class="color_2F80FF" style="margin-left: 20rpx;">
						{{$isEmpty(item.createTime)?'':getDateDiff(item.createTime)}} 捐赠了{{$isEmpty(item.amount)?'':item.amount.toFixed(2)}}宝贝
					</view>
				</view>
				<view class="bottom-safe" style="height: 112rpx;"></view>
			</view>
		</view>
		<view class="wrapBtns safe-bottom">
			<view class="" style="margin: 24rpx 32rpx 32rpx;">
				<view class="button" style="width: 100%;" @tap="goDonate">
					立即捐赠
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				name: '',
				avatar: '',
				donateInfo: {},
				donateList: {},
				oss: ''
			};
		},
		onLoad(options) {
			this.oss = this.$oss
			this.id = options.orgId
			this.name = options.name
			this.avatar = options.avatar
		},
		onShow() {
			this.$http.get('fms/flow/donate/list', {
				params: {
					orgId: this.id
				}
			}).then(res => {
				console.log(res)
				this.donateInfo = res.data.data
				this.donateList = res.data.data.page
			})
		},
		onReachBottom() {
			if (this.donateList.current < this.donateList.pages) {
				this.$http.get('fms/flow/donate/list', {
					params: {
						orgId: this.id,
						current: this.donateList.current + 1
					}
				}).then(res => {
					console.log(res)
					this.donateInfo = res.data.data
					this.donateList.current = res.data.data.page.current
					this.donateList.records = this.donateList.records.concat(res.data.data.page.records)
				})
			}
		},
		methods: {
			goDonate() {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soDonate/donateAction/donateAction?type=donate&name=${this.name}&avatar=${this.avatar}&id=${this.id}`
				})
			},
			getDateDiff(time) {
				console.log(time)
				var result = ''
				var minute = 1000 * 60
				var hour = minute * 60
				var day = hour * 24
				var month = day * 30
				var now = new Date().getTime()
				//2020-11-24 00:00:02 如果time是这种格式，需要把“-”转换成 “/” str.replace(/-/g,"/"),兼容IOS安卓
				var lastTime = new Date(time.replace(/-/g,"/")).getTime()
				var diffValue = now - lastTime
				if (diffValue < 0) return
				var monthC = diffValue / month
				var weekC = diffValue / (7 * day)
				var dayC = diffValue / day
				var hourC = diffValue / hour
				var minC = diffValue / minute
				if (monthC >= 1) {
					// result = "" + parseInt(monthC) + "月前"
					result = "" + time
				} else if (weekC >= 1) {
					// result = "" + parseInt(weekC) + "周前"
					result = "" + time
				} else if (dayC >= 1) {
					// result = "" + parseInt(dayC) + "天前"
					result = "" + time
				} else if (hourC >= 1) {
					result = "" + parseInt(hourC) + "小时前"
				} else if (minC >= 1) {
					result = "" + parseInt(minC) + "分钟前"
				} else {
					result = "刚刚"
				}
				// console.log(result)
				return result
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 32rpx;
	}

	.wrapBtns {
		position: fixed;
		bottom: 0rpx;
		width: 100%;
		background-color: #FFFFFF;
	}
</style>
