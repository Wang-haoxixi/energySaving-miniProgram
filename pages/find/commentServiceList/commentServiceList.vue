<template>
	<view class="container">
		<view class="commentList" v-for="(item,index) in comment.records" :key="index">
			<view class="commentList_item flexRow">
				<view class="commentList_item_wrap flexRowStart">
					<image :src="item.userImg" mode="" class="commentList_item_item_avatar"></image>
					<view class="flexColumnStart">
						<view class="commentList_item_item_name">
							{{item.commentator}}
						</view>
						<view class="">
							<uni-rate margin="2" size="24" disabled="true" :value="item.rank"></uni-rate>
						</view>
					</view>
				</view>
				<view class="commentList_item_time">{{$isEmpty(item.updateTime)?'':item.updateTime.split(' ')[0]}}</view>
			</view>
			<view class="comment-content">
				{{$isEmpty(item.content)?'':item.content}}
			</view>
		</view>
		<uni-load-more :status="moreStatus" v-if="comment.records.length>0"></uni-load-more>
	</view>
</template>

<script>
	import {
		imageError
	} from '@/common/utils.js'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				comment:{
					records:[]
				},
				moreStatus:'more',
				oss:'',
				id:'',
				type:''
			};
		},
		onLoad(options) {
			this.type = options.type
			this.id =options.id
			this.$http.get('dms/shop_comment/comment_page', {
				params: {
					targetId: this.id,
					type: this.type,
					current: 1
				}
			}).then(res => {
				this.comment = res.data.data;
				if (!this.comment.current < this.comment.pages) {
					this.moreStatus = 'noMore';
				}
			})
		},
		onReachBottom() {
			let that = this;
			if (that.comment.current < that.comment.pages) {
				that.moreStatus = 'loading';
				that.$http.get('dms/shop_comment/comment_page', {
					params: {
						targetId: this.id,
						type: this.type,
						current: that.comment.current + 1
					}
				}).then(res => {
					that.comment.current = res.data.data.current;
					res.data.data.records.forEach(item => {
						item.userImg = imageError(item.userImg, that.oss)
					})
					that.comment.records = that.comment.records.concat(res.data.data.records);
					that.moreStatus = 'more';
				});
			} else {
				that.moreStatus = 'noMore';
			}
		},
		methods:{
			imageError
		}
	}
</script>

<style lang="scss">
.container{
	padding: 0 32rpx;
	.commentList{
		padding: 32rpx 0;
		.commentList_item{
			margin-bottom: 32rpx;
			.commentList_item_wrap{
				flex: 1;
				.commentList_item_item_avatar{
					width: 64rpx;
					height: 64rpx;
					border-radius: 50%;
					margin-right: 24rpx;
				}
				.commentList_item_item_name{
					font-size: 22rpx;
					line-height: 32rpx;
					color: #272727;
					margin-bottom: 8rpx;
				}
			}
			.commentList_item_time{
				color: #999999;
				font-size: 22rpx;
				line-height: 32rpx;
			}
		}
		.comment-content{
			color: #272727;
			font-size: 28rpx;
			line-height: 42rpx;
		}
	}
}
</style>
