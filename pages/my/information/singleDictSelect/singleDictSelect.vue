<template>
	<view class="container safe-bottom">
		<view class="search-box">
			<input class="search-input" placeholder="搜索" v-model="name" placeholder-class="placeholder-class"/>
		</view>
		<view class="content">
			<view v-for="(dict, index) in dictList" :key="index" class="dict-item" @tap="selectDict(dict)">
				<text v-for="(item, index) in getWordList(dict[filter])" :key="index" :class="{'label': item.type == 2}">{{item.text}}</text>
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
				dictList: [],
				page: {
					current: 1,
					size: 40
				},
				timeout: null,
				moreStatus: 'more',
				moreShow: false,
				url: '',
				filter: '',
			};
		},
		watch: {
			name (val) {
				clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					this.refreshData()
				}, 1000)
			}
		},
		onLoad ({url, filter, title}) {
			this.url = url
			this.filter = filter
			console.log(url)
			uni.setNavigationBarTitle({
				title
			});
			this.getDict()
		},
		onReachBottom () {
			if (this.moreStatus == 'more') {
				this.page.current = this.page.current + 1
				this.getDict()
			}
		},
		methods: {
			getDict () {
				this.moreStatus = 'loading'
				let params = this.page
				if (this.name.trim()) {
					params[this.filter] = this.name.trim()
				}
				this.$http.get(this.url, {
					params
				}).then(({data}) => {
					if (data.code === 0) {
						this.moreShow = true
						if (this.page.current === 1) {
							this.dictList = data.data.records
						} else {
							this.dictList = this.dictList.concat(data.data.records)
						}
						if (this.page.current < data.data.pages) {
							this.moreStatus = 'more'
						} else {
							this.moreStatus = 'noMore'
						}
					}
				})
			},
			refreshData () {
				this.page.current = 1
				this.getDict()
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
			selectDict (dict) {
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('dictChange', dict)
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
			.dict-item {
				height: 92rpx;
				line-height: 92rpx;
				color: #919397;
				font-size: 28rpx;
				border-bottom: 1rpx solid #EFF0F1;
				.label {
					color: #2F80FF
				}
			}
		}
	}
</style>
