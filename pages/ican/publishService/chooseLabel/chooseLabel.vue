<template>
	<view class="">
		<view class="container">
			<view class="tagList">
				<view class="tagListItem singleEllipsis" @tap="chooseItem(item)" :class="item.status?'checked':''" v-for="(item,index) of tagList" :key="index">
					{{item.name}}
				</view>
			</view>
		</view>
		<view class="safe-bottom wrapBtn">
			<view class="btn flexRow">
				<view class="button" style="flex: 1;" @tap="submit">
					确定
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tagList:[],
				chooseTagList:[],
				tagKeywords:[]
			};
		},
		methods: {
			chooseItem(item){
				item.status = !item.status
				if(item.status ==true){
					this.chooseTagList.push(item.name)
				}else{
					this.chooseTagList=this.chooseTagList.filter(item2=>{
						return item2 != item.name
					})
				}
			},
			submit(){
				uni.$emit('tag',this.chooseTagList)
				uni.navigateBack()
			}
		},
		onLoad(options) {
			if(options.tagKeywords){
				this.tagKeywords = options.tagKeywords.split(',')
				this.chooseTagList = this.tagKeywords
			}
			this.$http.get('dms/product/tag/'+options.type).then(res=>{
				// console.log(res)
				this.tagList=res.data.data.map(item=>{
					return {
						name:item,
						status:false
					}
				})
			}).finally(()=>{
				if(this.tagKeywords.length>0){
					this.tagKeywords.forEach(item=>{
						this.tagList.forEach(item2=>{
							if(item == item2.name){
								item2.status=true
							}
						})
					})
				}
			})
		}
	};
</script>

<style lang="scss">
	.checked{
		color: #f73737 !important;
		background: rgba(247, 55, 55, .1) !important;
	}
	.container{
		padding: 32rpx;
		.tagList{
			display: grid;
			grid-template-columns: repeat(4,1fr);
			grid-column-gap: 16rpx;
			grid-row-gap: 16rpx;
			.tagListItem{
				background-color: #f5f7f8;
				width: 128rpx;
				height: 60rpx;
				text-align: center;
				font-size: 26rpx;
				line-height: 60rpx;
				border-radius: 8rpx;
				padding: 0 16rpx;
			}
		}
	}
	.wrapBtn{
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: #FFFFFF;
		z-index: 999;
		.btn{
			padding: 24rpx 32rpx 32rpx;
		}
	}
</style>
