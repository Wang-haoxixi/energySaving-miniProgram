<template>
	<view>
		<scroll-view scroll-y :style="{height: swiperHeight + 'px'}">
			<view v-for="item in languageAbilityList" :key="item.id" class="language-item" :class="{'check': languageCheck(item.label)}" @tap="toggleLanguage(item.label)">{{item.label}}</view>
		</scroll-view>
		<view class="bottom-button-box safe-bottom">
			<view class="botton-button-list flexRow">
				<view class="button clear" @tap="clear">清除</view>
				<view class="button submit" @tap="save">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperHeight: 0,
				languageAbility: '',
				languageAbilityList: []
			};
		},
		onLoad({
			languageAbility
		}) {
			uni.createSelectorQuery()
				.select('.bottom-button-box')
				.boundingClientRect(this)
				.exec(ret => {
					let height = uni.getSystemInfoSync().windowHeight;
					this.swiperHeight = height - ret[0].height
				})
			this.languageAbility = languageAbility
			this.$http.get('admin/dict/type/languageability').then(({
				data
			}) => {
				if (data.code === 0) {
					this.languageAbilityList = data.data
				}
			})
		},
		methods: {
			languageCheck (label) {
				return (this.languageAbility.split(',') || []).includes(label)
			},
			toggleLanguage (label) {
				let languageList = this.languageAbility.split(',') || []
				if (languageList.includes(label)) {
					languageList.splice(languageList.indexOf(label), 1)
				} else {
					languageList.push(label)
				}
				this.languageAbility = languageList.join(',')
			},
			clear () {
				this.languageAbility = ''
			},
			save () {
				if (this.languageAbility) {
					let abilityComputed = []
					let abilityList = this.languageAbility.split(',')
					for (let i = 0; i < this.languageAbilityList.length; i++) {
						if (abilityList.includes(this.languageAbilityList[i].label)) {
							abilityComputed.push(this.languageAbilityList[i].label)
						}
					}
					this.$http.post('admin/user/app/update', {
						languageAbilityList: abilityComputed
					}).then(({
						data
					}) => {
						if (data.code === 0) {
							const eventChannel = this.getOpenerEventChannel()
							eventChannel.emit('update', data.data);
							uni.navigateBack()
						}
					});
				} else {
					uni.showToast({
						icon: 'none',
						title: '请至少选择一个语种'
					})
				}
				
				
			}
		}
	}
</script>

<style lang="scss">
	.language-item {
		height: 108rpx;
		line-height: 108rpx;
		border-bottom: 1rpx solid #F4F5F6;
		text-align: center;
		background-color: #FFFFFF;
		color: #919397;
		font-size: 28rpx;
		&.check {
			background-color: #F4F5F6;
			color: #303031;
			font-weight: bold;
		}
	}

	.bottom-button-box {
		.botton-button-list {
			padding: 24rpx 32rpx;
			.button {
				
				&.submit {
					margin-left: 30rpx;
					flex: 438rpx 1 1;
				}
				&.clear {
					flex: 204rpx 1 1;
					position: relative;
					background: #FFFFFF;
					color: #f73737;
					border: 2rpx solid #f73737;
				}
			}
		}

	}
</style>
