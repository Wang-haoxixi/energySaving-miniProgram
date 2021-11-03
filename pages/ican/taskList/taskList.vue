<template>
	<view class="container">
		<searchTaskList :searchTaskList="showList" :taskListMoreStatus="taskListMoreStatus"></searchTaskList>
	</view>
</template>

<script>
	import{
		imageError
	} from '../../../common/utils.js'
	export default {
		data() {
			return {
				showListInfo:{},
				showList:[],
				taskListMoreStatus:'',
				state:'',
				status:''
			}
		},
		onLoad(options) {
			const {state,status}=options
			this.state=state
			this.status=status
			if(state=="complete"){
				uni.setNavigationBarTitle({
					title:"已完成"
				})
			}else if(state=="for"){
				uni.setNavigationBarTitle({
					title:"进行中"
				})
			}else if(state=="close"){
				uni.setNavigationBarTitle({
					title:"已结束"
				})
			}else if(state=="over"){
				uni.setNavigationBarTitle({
					title:"已逾期"
				})
			}
			this.$http.get('qms/cooperation_list/select_page_V1', {
				params: {
					state: state,
					status:status
				}
			}).then(res => {
				// console.log(res)
				this.showListInfo=res.data.data
				this.showList=res.data.data.records
				this.showList.forEach(item=>{
					item.avatar  = imageError(item.avatar,this.$oss)
				})
				if (this.showListInfo.current == this.showListInfo.pages) {
					this.taskListMoreStatus = 'noMore'
				} else if (this.showListInfo.pages == 0) {
					this.taskListMoreStatus = 'noMore'
				}
			});
		},
			onReachBottom(){
				// console.log(666)
				let that = this
				if (that.showListInfo.current < that.showListInfo.pages) {
					that.taskListMoreStatus = 'loading';
					that.$http.get('qms/cooperation_list/select_page', {
						params: {
							state:this.state,
							status:this.status,
							current:this.showListInfo.current+1
						}
					}).then(res => {
						that.showListInfo.current = res.data.data.current;
						that.showList = that.showList.concat(res.data.data.records);
						that.showList.forEach(item=>{
							item.avatar  = imageError(item.avatar,that.$oss)
						})
						that.taskListMoreStatus = 'more';
					});
				} else {
					that.taskListMoreStatus = 'noMore';
				}
			},
		methods: {
		}
	}
</script>

<style lang="scss">
.container{
	padding: 32rpx
}
</style>
