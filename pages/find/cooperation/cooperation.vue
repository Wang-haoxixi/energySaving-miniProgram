<template>
	<view class="container" @tap.stop="hide">
		<view class="flexRow containerWrap">
			<view class="flexRow" @tap.stop="changeIsPullDown">
				<view class="color_303031 bold kindTitle">{{ taskKind }}</view>
				<image v-if="oss" :src="oss+'icon_ican_pulldown.png'"></image>
			</view>
			<view class="showList" v-show="isPullDown">
				<view class="flexColumn showListWrap">
					<view class="color_666769 showAll" @click="searchAll()">任务清单</view>
					<view class="color_666769 showMineCreate" @click="searchPublish()">我发起的</view>
					<view class="color_666769 showMineAccept" @click="searchAccept()">我收到的</view>
				</view>
			</view>
			<view class="titleRight flexRow">
				<image v-if="oss" class="imgSearch" :src="oss+'icon_search.png'" @click="searchTask()"></image>
				<image v-if="oss" class="imgCalendar" :src="oss+'icon_ican_calendar.png'"></image>
				<image v-if="oss" class="imgAdd" :src="oss+'icon_add.png'" @tap="goCreateTask"></image>
			</view>
		</view>
	<view class="content">
		<view class="underway" @click="changeUnderwayClick()">
			<view class="flexRow underwayWarp">
				<view class="color_303031 flexRow bold underwayWarpTitle">
					进行中
					<view class="color_919397 underwayWarpCount">{{$isEmpty(countFor)?'0':countFor}}</view>
				</view>
				<view class="underwayImg">
					<image v-if="oss" :src="oss+'icon_ican_hide.png'" mode="" v-show="isUnderwayClick"></image>
					<image v-if="oss" :src="oss+'icon_ican_show.png'" mode="" v-show="!isUnderwayClick"></image>
				</view>
			</view>
			<view class="" v-show="underwayShow">
				<!-- 传一个taskStatus，子组件通过该参数判断渲染样式，1:进行中，2:已完成，3:已关闭 ，4:已逾期-->
				<underway v-if="requestStatus==true" :list="underwayList" :countNum="countFor" :status="status" taskStatus='1'></underway>
			</view>
		</view>
		<view class="finished" @click="changeOverClick()">
			<view class="flexRow finishedWrap">
				<view class="color_303031 flexRow bold finishedWrapTitle">
					逾期
					<view class="color_919397 finishedWrapCount">{{$isEmpty(countOver)?'0':countOver}}</view>
				</view>
				<view class="finishedWrapImg">
					<image v-if="oss" :src="oss+'icon_ican_hide.png'" mode="" v-show="isOverClick"></image>
					<image v-if="oss" :src="oss+'icon_ican_show.png'" mode="" v-show="!isOverClick"></image>
				</view>
			</view>
			<view class="" v-show="overShow">
				<underway v-if="requestStatus==true" :list="overList" :countNum="countOver" :status="status" taskStatus='4'></underway>
			</view>
		</view>
		<view class="finished" @click="changeFinishedClick()">
			<view class="flexRow finishedWrap">
				<view class="color_303031 flexRow bold finishedWrapTitle">
					完成
					<view class="color_919397 finishedWrapCount">{{$isEmpty(countComlete)?'0':countComlete}}</view>
				</view>
				<view class="finishedWrapImg">
					<image v-if="oss" :src="oss+'icon_ican_hide.png'" mode="" v-show="isFinishedClick"></image>
					<image v-if="oss" :src="oss+'icon_ican_show.png'" mode="" v-show="!isFinishedClick"></image>
				</view>
			</view>
			<view class="" v-show="finishedShow">
				<underway v-if="requestStatus==true" :list="finishedList" :countNum="countComlete" :status="status" taskStatus='2'></underway>
			</view>
		</view>
		<view class="closed" @click="changeClosedClick()">
			<view class="flexRow closedWrap">
				<view class="color_303031 flexRow bold closedWrapTitle">
					关闭
					<view class="color_919397 closedWrapCount">{{ $isEmpty(countClose)?'0':countClose }}</view>
				</view>
				<view class="closedImg">
					<image v-if="oss" :src="oss+'icon_ican_hide.png'" mode="" v-show="isClosedClick"></image>
					<image v-if="oss" :src="oss+'icon_ican_show.png'" mode="" v-show="!isClosedClick"></image>
				</view>
			</view>
			<view class="" v-show="closedShow">
				<underway v-if="requestStatus==true" :list="closedList" :countNum="countClose" :status="status" taskStatus='3'></underway>
			</view>
		</view>
	</view>
	</view>
	</view>
</template>

<script>
	import {
		isEmpty,
		imageError
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				underwayShow: true,
				finishedShow: false,
				closedShow: false,
				overShow:false,
				isFinishedClick: false,
				isClosedClick: false,
				isUnderwayClick: true,
				isOverClick:false,
				isPullDown: false,
				underwayList: [],
				finishedList: [],
				closedList: [],
				overList:[],
				isLogin: false,
				countClose: 0,
				countComlete: 0,
				countFor:0,
				countOver:0,
				taskKind: '任务清单',
				oss: '',
				status:0,
				//确认数据请求到后，在传值给子组件
				requestStatus:false
			};
		},
		onLoad() {
			this.oss = this.$oss;
		},
		onShow() {
			this.search(this.status);
		},
		methods: {
			imageError,
			goCreateTask(){
				uni.navigateTo({
					url:"/pages/ican/createTask/createTask"
				})
			},
			hide() {
				this.isPullDown = false
			},
			changeIsPullDown() {
				this.isPullDown = !this.isPullDown
			},
			changeUnderwayClick() {
				this.underwayShow = !this.underwayShow;
				this.isUnderwayClick = !this.isUnderwayClick;
			},
			changeFinishedClick() {
				this.finishedShow = !this.finishedShow;
				this.isFinishedClick = !this.isFinishedClick;
			},
			changeClosedClick() {
				this.closedShow = !this.closedShow;
				this.isClosedClick = !this.isClosedClick;
			},
			changeOverClick(){
				this.overShow=!this.overShow
				this.isOverClick=!this.isOverClick
			},
			searchTask() {
				uni.navigateTo({
					url: '/pages/ican/searchTask/searchTask'
				});
			},
			searchAll() {
				this.taskKind = '任务清单';
				this.search(0);
				this.isPullDown = false;
				this.status=0
			},
			searchPublish() {
				this.taskKind = '我发起的';
				this.search(1);
				this.isPullDown = false;
				this.status=1
			},
			searchAccept() {
				this.taskKind = '我收到的';
				this.search(2);
				this.isPullDown = false;
				this.status=2
			},
			search(status) {
				this.isLogin = !isEmpty(uni.getStorageSync('token'));
				let url = '';
				if (this.isLogin) {
					url = 'qms/cooperation_list/select_for_V1';
				} else {
					url = 'qms/cooperation_list/select_appletr';
				}
				this.$http
					.get(url, {
						params: {
							status: status
						}
					})
					.then(res => {
						// console.log(res)
						this.countClose = res.data.data.countClose
						this.countComlete = res.data.data.countComlete
						this.countFor=res.data.data.countFor
						// console.log(this.countFor)
						this.countOver=res.data.data.countOver
						if(!isEmpty(res.data.data.cooperationTaskListFor)){
							this.underwayList = res.data.data.cooperationTaskListFor.map(item=>{
								var index=item.finishTime.lastIndexOf(":");
								item.avatar = imageError(item.avatar,this.$oss)
								item.finishTime=item.finishTime.substring(0, index)
								return {
									...item,
									finishTime:item.finishTime
								}
							});
						}else{
							this.underwayShow=false
							this.isUnderwayClick=false
							this.underwayList=[]
						}
						if(!isEmpty(res.data.data.cooperationTaskListComplete)){
							this.finishedList = res.data.data.cooperationTaskListComplete.map(item=>{
								var index=item.finishTime.lastIndexOf(":");
								item.avatar = imageError(item.avatar,this.$oss)
								item.finishTime=item.finishTime.substring(0, index)
								return {
									...item,
									finishTime:item.finishTime
								}
							});
						}else{
							this.finishedList=[]
						}
						if(!isEmpty(res.data.data.cooperationTaskListClose)){
							this.closedList = res.data.data.cooperationTaskListClose.map(item=>{
								var index=item.finishTime.lastIndexOf(":");
								item.avatar = imageError(item.avatar,this.$oss)
								item.finishTime=item.finishTime.substring(0, index)
								return {
									...item,
									finishTime:item.finishTime
								}
							});
						}else{
							this.closedList=[]
						}
						if(!isEmpty(res.data.data.cooperationTaskListOver)){
							this.overList = res.data.data.cooperationTaskListOver.map(item=>{
								var index=item.finishTime.lastIndexOf(":");
								item.avatar = imageError(item.avatar,this.$oss)
								item.finishTime=item.finishTime.substring(0, index)
								return {
									...item,
									finishTime:item.finishTime
								}
							});
						}else{
							this.overList=[]
						}
						// console.log(this.finishedList)
						this.requestStatus=true
				});
			},
			isEmpty
		}
	};
</script>
<style lang="scss">
	.container {
		height: 100vh;
	}

	.containerWrap {
		position: relative;
		padding: 24rpx 32rpx ;

		.kindTitle {
			width: 136rpx;
			font-size: 34rpx;
		}

		image {
			width: 34rpx;
			height: 34rpx;
		}
	}

	.content {
		padding: 0 32rpx;
		margin: 0 auto;

		.underway,
		.finished,
		.closed {
			margin-bottom: 60rpx;

			.underwayWarp,
			.finishedWrap,
			.closedWrap {
				margin-bottom: 40rpx;
				margin-top: 40rpx;

				.underwayWarpTitle,
				.finishedWrapTitle,
				.closedWrapTitle {
					font-size: 32rpx;

					.underwayWarpCount,
					.finishedWrapCount,
					.closedWrapCount {
						font-size: 24rpx;
						padding-left: 20rpx;
					}
				}

				.underwayImg,
				.finishedWrapImg,
				.closedImg {
					image {
						width: 44rpx;
						height: 44rpx;
					}
				}
			}
		}
	}

	.titleRight {
		.imgSearch {
			width: 44rpx;
			height: 44rpx;
		}

		.imgCalendar {
			width: 44rpx;
			height: 44rpx;
			margin: 0 40rpx;
			display: none;
		}

		.imgAdd {
			width: 44rpx;
			height: 44rpx;
			margin-left: 20px;
		}
	}

	.showList {
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKoAAAD6CAYAAAAx+Nx1AAAIu0lEQVR4Xu3Zz28UdRzG8e9nZrbt/molMTHuDy6YGK6GeAX+AjBGLpyNevAmhD/BCDcP6B0uJAT4C8CD8cJRoyQ2MdmZqTfs/ui23Zn5mmmkgYJC7UL2ybx74tCdeeZ5XszuTs3xM/cGBoNB19Xrrv/228ncD17RA1pFr/u1XPbGxsbpWV5cD8xOlifwzv1iPvy013vnp9dywgodFKhzGvuPJPkgcvZjo9FYWVpa2jvqbHfXTba2pkWefXj8+PGf53SqSh4GqHOafRCn9xuN+pnl5eVnjrizs+O2tqYP+r3O2TmdqpKHAeocZh8MBmeCMLq/urrqzJ6t1HvvhsOhK/LsbL/ffzCH01XyEECdw+z/djd9cmjuqkcvGahH7PC/7qZPDs1d9YglO+eAesQOB3H6oNGonz742fTgYf+5q/7Q73XOHPGUlXw5UI8we5ymnwUWfNdut5/7bHrwsOVddTQaucIXn/c6ne+PcNpKvhSoh5zdex+mafpe4f0XYRh92Ww2gzAMX+koeZ67yWRS5Hn2bWB2vdPp/G5m+Su9uOK/9EKo3vtakiTnzYJz3vtTzqzjvW9XvKv9yw+CwNVqNbeysuLKfx/mpygKt7297WazmSv/XfUfMxs571Mze+h9ca/b7d41s9nBXp6DOkjTj1zhrkZReKJ8cB1F0d4YBx+7VL1grn8+DZQficr/sFmWud3dXZdl+boL3KV+p3Pn6TPsQ/XeB3Gcfh1G4Vf1esNqtWg+STgKDRyigdksc9Ppls+z/Fqv17liZntvO/tQB4Pkm6gWXWo2m4d+OztEDn6VBl7aQHmHnUwmLptlV/v97uV9qOXbfWjB7VarZYf9zPXSs/ILNPA/Giixjsdjn/vi4/JjgJVfnOJk49dWq3WCt/v/0SgveW0NlB8DxuPxeq/77kmL441Pwii4VT4L5IcGFq2B8tlzns0uWJKkN1bq9Ysv+8vKol0AearRQPkXve3p9KbFcfJbe3X1/Vd9aF2NerjKRWmg/CPJaDh8ZHGSDtfW1to8J12UacjxdAPlc9bNzc2RDeLEHzt2jHZoYGEbePz4sQPqws5DsCcNABULEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQgIVAxINAFViJkICFQMSDQBVYiZCAhUDEg0AVWImQu5BjZNkuLb2VtvMaIQGFq4B773b3PxrZHGc/NZeXX0/DMOFC0kgGsjz3I2Gw0eWJOmNlXr94vLyMq3QwMI1sLOz47an05sWx/EnYVS71W63Fy4kgWhgNBq5PJtdMO99LU42fm21WidqtYhmaGBhGpjNMjcej9d73XdP7n2DGqTpR6EFt1utlgVBsDBBCVLdBoqiKJH63Bcf9zudO/tf9QeD5JuoFl1qNpsOrNUFsghXXiKdTCYum2VX+/3u5TLTPlTvfRDH6ddhFH5VrzeMjwGLMFn1MpRv99Ppls+z/Fqv17liZsUzUJ9UUn4McIW7GkXhiaWlJRdF0d4dlues1UPzJq64fE5a3kGzLHO7u7suy/J1F7hL5dv90+d/4VP+8gtWkvx53syf896fcmYd7z2PBd7EchU7h5mNnPepmT30vrjX7XbvmtnsYA1/A9cOclFW4Q9tAAAAAElFTkSuQmCC');
		position: absolute;
		top: 80rpx;
		left: 24rpx;
		z-index: 10;
		width: 170rpx;
		height: 254rpx;
		background-size: 100% 100%;
		background-repeat: no-repeat;

		.showListWrap {
			padding: 18rpx;

			.showAll {
				font-size: 28rpx;
				padding: 20rpx 0;
				border-bottom: 2rpx solid #E3E4E5;
			}

			.showMineCreate {
				font-size: 28rpx;
				padding: 20rpx 0;
				border-bottom: 2rpx solid #E3E4E5;
			}

			.showMineAccept {
				font-size: 28rpx;
				padding: 20rpx 0;
			}
		}
	}
</style>
