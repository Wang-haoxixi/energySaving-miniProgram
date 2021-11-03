<template>
	<view class="container safe-bottom">
		<view class="search-box">
			<input class="search-input" placeholder="搜索" v-model="name" placeholder-class="placeholder-class" @input="checkName"/>
		</view>
		<view class="content">
			<view v-for="position in positionList" :key="position.id" class="position-item" @tap="selectPosition(position)">
				{{position.name}}
				<!-- <text v-for="(item, index) in getWordList(position.name)" :key="index" :class="{'label': item.type == 2}">{{item.text}}</text> -->
			</view>
			<uni-load-more v-if="moreShow" :status="moreStatus"></uni-load-more>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: '',
				positionList: [],
				page: {
					current: 1,
					size: 40,
					name:''
				},
				timeout: null,
				moreStatus: 'more',
				moreShow: false
			};
		},
		onLoad () {
			this.getPosition()
		},
		onReachBottom () {
			if (this.moreStatus == 'more') {
				this.page.current = this.page.current + 1
				this.getPosition()
			}
		},
		methods: {
			getPosition () {
				this.moreStatus = 'loading'
				let params = this.page
				if (!this.$isEmpty(this.name)) {
					params.name = this.name.trim()
				}else{
					params.name = ''
				}
				this.$http.get('dms/position/type_three/page', {
					params
				}).then(({data}) => {
					if (data.code === 0) {
						this.moreShow = true
						if (this.page.current === 1) {
							this.positionList = data.data.records
						} else {
							this.positionList = this.positionList.concat(data.data.records)
						}
						if (this.page.current < data.data.pages) {
							this.moreStatus = 'more'
						} else {
							this.moreStatus = 'noMore'
						}
					}
				})
			},
			checkName(){
				this.page.curren=1
				this.getPosition()
			},
			getWordList (word) {
				let list = []
				let key = this.name.trim()
				if (key) {
					let wordList = word.split(key)
					for (let i = 0; i < wordList.length; i++) {
						list.push({
							type: 1,
							text: wordList[i]
						})
						if (i < wordList.length - 1) {
							list.push({
								type: 2,
								text: key
							})
						}
					}
				} else {
					list.push({
						type: 1,
						text: word
					})
				}
				return list
			},
			selectPosition (position) {	
				uni.$emit('positionChange', position.name)
				uni.navigateBack()
			}
		},
	}
</script>

<style lang="scss">
	.container {
		padding: 0 32rpx;
		.search-box {
			border-bottom: 1rpx solid #F8F8F9;
			.search-input {
				height: 88rpx;
				line-height: 88rpx;
				font-size: 28rpx;
			}
			.placeholder-class {
				line-height: 88rpx;
				font-size: 28rpx;
			}
		}
		.content {
			.position-item {
				height: 92rpx;
				line-height: 92rpx;
				color: #919397;
				font-size: 28rpx;
				border-bottom: 1rpx solid #EFF0F1;
				text-align: center;
				.label {
					color: #2F80FF
				}
			}
		}
	}
</style>
