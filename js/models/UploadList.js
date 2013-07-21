/**
 *	在上传过程中
 *	当 uploadList.add 和uploadList.del执行时，会触发add和del事件
 *	并且传送被添加的img作为参数
 */
function UploadList(){
	var uploadList = [],
		uploadQueue = [], //上传等待队列
		isUploading = false,
		uploadingImg = null; //正在上传的Img

	uploadList.uploadingImg = uploadingImg;
	uploadList.isUploading = isUploading;
	uploadList.uploadQueue = uploadQueue;

	//向图片列表中添加 Img
	uploadList.add = function (img){
		if(img){
			$(document).triggerHandler("add", img);
			uploadList.push(img);
			uploadQueue.add(img);
			console.log("add success");
		}
		else{
			console.log("there's not img to add");
		}
		return uploadList;
	};

	//删除图片列表中的 Img
	uploadList.del = function (imgId){
		var img;
		for (var i = uploadList.length - 1; i >= 0; i--) {
			if(uploadList[i].id === imgId){
				img = uploadList.splice(i, 1)[0];
				if(isUploading){
					uploadQueue.del(imgId);
				}
				$(document).triggerHandler("del", img);
				break;
			}
		}
		if(img === undefined){
			console.log("delete fail, never found img[imgId = "+ imgId +"]");
		}
		return uploadList;
	};

	// 启动上传队列
	uploadQueue.upload = function (){
		if(!isUploading){
			uploadingImg = uploadQueue.shift();
			uploadingImg.upload(function (msg){
				if(msg === "upload success" || msg === "upload fail"){
					console.log(msg);
					isUploading = false;
					uploading = null;
					if(uploadQueue.length > 0){
						uploadQueue.upload();
					}
				}
			});
			isUploading = true;
		}
	};

	// 删除上传队列中的 Img
	uploadQueue.del = function(imgId){
		if(isUploading){
			if(uploadingImg.id === imgId){
				uploadingImg.abort();
				if(uploadQueue.length > 0){
					uploadQueue.upload();
				}
			}
			else{
				for (var i = uploadQueue.length - 1; i >= 0; i--) {
					if(uploadQueue[i].id === imgId){
						uploadQueue.splice(i, 1);
					}
				}
			}
		}
		else{
			console.log("no uploading");
		}
	};

	//重新添加到上传队列，然后上传。
	uploadQueue.add = function (img){
		uploadQueue.push(img);
		uploadQueue.upload();
	};

	return uploadList;
}