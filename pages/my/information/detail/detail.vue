<template>
	<view class="safe-bottom">
		<picker mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray"
		 range-key="name" @change="householdRegister">
			<view class="list top-title">
				<view class="list-title">家乡</view>
				<view class="list-text">
					{{ $isEmpty(data.householdRegister)?'请完善':data.householdRegister }}
				</view>
				<image v-if="oss" class="list-end" :src="oss + 'icon_right_gray.png'"></image>
			</view>
			<!-- <view class="uni-input">{{multiArray[0][multiIndex[0]].name}}-{{multiArray[1][multiIndex[1]].name}}</view> -->
		</picker>
		<picker start="1970-01-01" mode="date" :value="data.birthday" :end="endDate" @change="bindDateChange">
			<view class="list top-title">
				<view class="list-title">
					生日
				</view>
				<view class="list-text">
					{{ $isEmpty(data.birthday)?'请完善':data.birthday }}
				</view>
				<image v-if="oss" class="list-end" :src="oss + 'icon_right_gray.png'"></image>
			</view>
		</picker>
		<!-- <view class="list top-title">
			<view class="list-title">生日</view>
			<view class="list-text">{{ $isEmpty(data.birthday)?'请完善':data.birthday }}</view>
			<image v-if="oss" class="list-end" :src="oss + 'icon_right_gray.png'"></image>
		</view> -->
		<view class="list top-title">
			<view class="list-title">手机</view>
			<view class="list-text">{{ $isEmpty(data.mobile)?'请完善':data.mobile }}</view>
		</view>
		<view class="list top-title" @tap="toEdit('微信', 'weiXin', data.weiXin)">
			<view class="list-title">微信</view>
			<view class="list-text">{{ $isEmpty(data.weiXin)?'请完善':data.weiXin }}</view>
			<image v-if="oss" class="list-end" :src="oss + 'icon_right_gray.png'"></image>
		</view>
		<view class="list top-title" @tap="toEdit('QQ', 'qq', data.qq)">
			<view class="list-title">QQ</view>
			<view class="list-text">{{ $isEmpty(data.qq)?'请完善':data.qq }}</view>
			<image v-if="oss" class="list-end" :src="oss + 'icon_right_gray.png'"></image>
		</view>
		<view class="list top-title" @tap="toEdit('邮箱', 'mail', data.mail)">
			<view class="list-title">邮箱</view>
			<view class="list-text">{{ $isEmpty(data.mail)?'请完善':data.mail }}</view>
			<image v-if="oss" class="list-end" :src="oss + 'icon_right_gray.png'"></image>
		</view>
		<picker class="list-text" mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray"
		 range-key="name" @change="workPlace">
			<view class="list top-title">
				<view class="list-title">工作地</view>
				<view class="list-text">
					{{ $isEmpty(data.workPlace)?'请完善':data.workPlace }}
				</view>
				<image v-if="oss" class="list-end" :src="oss + 'icon_right_gray.png'"></image>
			</view>
		</picker>
		<view class="list top-title" @tap="toEditLanguage">
			<view class="list-title">外语能力</view>
			<view class="list-text">{{ $isEmpty(data.languageAbility)?'请完善':data.languageAbility }}</view>
			<image v-if="oss" class="list-end" :src="oss + 'icon_right_gray.png'"></image>
		</view>
		<view class="list top-title" @tap="toEditExperience('education')">
			<view class="list-title">教育经历</view>
			<view class="list-text" v-if="data.learningSituation && data.learningSituation.length>0">{{ $isEmpty(data.learningSituation[0].school)?'请完善': data.learningSituation[0].school}}</view>
			<view class="list-text" v-else>请完善</view>
			<image class="list-end" :src="$ossUrl('icon_right_gray.png')"></image>
			<!-- <image v-if="oss" class="list-end" :src="oss + 'icon_right_gray.png'"></image> -->
		</view>
		<view class="list top-title" @tap="toEditExperience('work')">
			<view class="list-title">工作经历</view>
			<view class="list-text" v-if="data.workExperience && data.workExperience.length>0">{{ $isEmpty(data.workExperience[0].company)?'请完善': data.workExperience[0].company}}</view>
			<view class="list-text" v-else>请完善</view>
			<image class="list-end" :src="$ossUrl('icon_right_gray.png')"></image>
			<!-- <image v-if="oss" class="list-end" :src="oss + 'icon_right_gray.png'"></image> -->
		</view>
		<view class="list top-title" @tap="toEdit('自我描述', 'introduction', data.introduction, true)">
			<view class="list-title">自我描述</view>
			<view class="list-text">{{ $isEmpty(data.introduction)?'请完善':data.introduction }}</view>
			<image class="list-end" :src="$ossUrl('icon_right_gray.png')"></image>
			<!-- <image v-if="oss" class="list-end" :src="oss + 'icon_right_gray.png'"></image> -->
		</view>
		<view class="list top-title" @tap="goShippingAddress">
			<view class="list-title">收货地址</view>
			<view class="list-text"></view>
			<image v-if="oss" class="list-end" :src="oss + 'icon_right_gray.png'"></image>
		</view>
	</view>
</template>

<script>
	import city from '@/common/city.js'
	import {
		getCompanyStation,
		goShippingAddress
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				data: '',
				endDate: '',
				oss: '',
				multiArray: [
					city,
					city[0].children,
				],
				multiIndex: [0, 0],
			};
		},
		methods: {
			goShippingAddress,
			getDate() {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				this.endDate = `${year}-${month}-${day}`;
				console.log(this.endDate);
			},
			getCompanyStation,
			bindMultiPickerColumnChange: function(e) {
				console.log('修改的列为：' + e.detail.column + '，值为：' + e.detail.value)
				this.multiIndex[e.detail.column] = e.detail.value
				switch (e.detail.column) {
					case 0: //拖动第1列
						this.multiArray[1] = city[this.multiIndex[0]].children
						console.log(this.multiIndex);
						break
				}
				this.$forceUpdate()
			},
			householdRegister() {
				this.$http.post('admin/user/app/update', {
					householdRegister: this.multiArray[0][this.multiIndex[0]].name + '-' + this.multiArray[1][this.multiIndex[1]].name
				}).then(res => {
					this.data = res.data.data;
				});
			},
			workPlace() {
				this.$http.post('admin/user/app/update', {
					workPlace: this.multiArray[0][this.multiIndex[0]].name + '-' + this.multiArray[1][this.multiIndex[1]].name
				}).then(res => {
					this.data = res.data.data;
				});
			},
			bindDateChange: function(e) {
				this.$http.post('admin/user/app/update', {
					birthday: e.detail.value
				}).then(res => {
					this.data = res.data.data;
				});
			},
			toEdit (title, attribute, value, textarea = false) {
				uni.navigateTo({
					url: `../edit/edit?title=${title}&attribute=${attribute}&value=${value}${textarea? '&inputType=textarea' : ''}`,
					events: {
						update: (data) => {
							this.data = data
						}
					}
				})
			},
			toEditLanguage () {
				uni.navigateTo({
					url: `../languageAbility/languageAbility?languageAbility=${this.data.languageAbility}`,
					events: {
						update: (data) => {
							this.data = data
						}
					}
				})
			},
			toEditExperience (type) {
				if (type == 'work') {
					uni.navigateTo({
						url: '../experience/workExperience',
						events: {
							update: (data) => {
								this.data = data
							},
							updateExperience: (data) => {
								this.data.workExperience = data
							}
						}
					})
				} else if (type == 'education') {
					uni.navigateTo({
						url: '../experience/educationExperience',
						events: {
							update: (data) => {
								this.data = data
							},
							updateExperience: (data) => {
								this.data.learningSituation = data
							}
						}
					})
				}
			}
		},
		onLoad(option) {
			this.oss = this.$oss;
			this.getDate();
			this.$http.get('admin/app/my').then(res => {
				this.data = res.data.data;
				uni.setStorageSync('workExperience', this.data.workExperience)
				uni.setStorageSync('educationExperience', this.data.learningSituation)
			});
		},
		onUnload () {
			uni.removeStorageSync('workExperience')
			uni.removeStorageSync('educationExperience')
		}
	};
</script>

<style lang="scss">
	.top-title {
		border-bottom: 0.3px #eff0f1 solid;
	}

	.remarkList {
		padding-top: 24rpx;

		.introduction {
			justify-content: flex-start;
		}
	}

	.list {
		margin-left: 32rpx;
		margin-right: 32rpx;
		padding-top: 43rpx;
		padding-bottom: 16rpx;
		font-size: 28rpx;
		display: flex;
		align-items: center;

		.list-title {
			color: #272727;
			// font-weight: bold;
			font-size: 30rpx;
			line-height: 42rpx;
		}

		.list-second-title {
			margin-right: 40rpx;
			color: #272727;
		}

		.list-text {
			margin-left: 20rpx;
			flex: 1;
			color: #565B5F;
			font-size: 28rpx;
			line-height: 40rpx;
			display: flex;
			justify-content: flex-end;
		}

		.list-end {
			margin-right: -16rpx;
			height: 44rpx;
			width: 44rpx;
		}
	}
</style>
