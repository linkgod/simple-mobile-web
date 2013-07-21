/**
 *	当点击"重新上传"时，会触发reupload事件
 *	并且传送对应img作为为参数
 */
function AppView(){
	var imgPreviewHeight = $(window).height() - 45,
		img = null,
		uploadList = new UploadList(),
		uploadListView = new UploadListView(),

		//dom or $dom
		input = $("#uploadInput")[0],
		$showImg = $("#showImg"),
		$loading = $("#imgPreview .loading"),
		$newImg = $("#imgPreview .newImg"),
		$imgInfo = $("#imgInfo"),
		$cancel = $("#imgOpt .cancel"),
		$done = $("#imgOpt .done"),
		$uploadList = $("#uploadList");

	//图片预览的事件绑定
	input.addEventListener("change", inputOnchangeHandler, false);
	$cancel.on("click", cancelOnclickHandler);
	$done.on("click", doneOnclickHandler);

	//给uploadListView绑定事件
	$uploadList.on("click", ".delete", deleteOnclickHandler);
	$uploadList.on("click", ".abort", abortOnclickHandler);
	$uploadList.on("click", ".reupload", reuploadOnclickHandler);

	function inputOnchangeHandler(){
		try{
			img = new Img(input, common.config);
			$showImg.show();
			img.read(function (evt){
				var imgHeight, marginTop;
				$newImg.attr("src", evt.target.result);
				$newImg[0].onload = function(){
					imgHeight = $newImg.height();
					marginTop = imgPreviewHeight > imgHeight ? (imgPreviewHeight - imgHeight) / 2 : 0;
					$newImg.css({"margin-top":marginTop});
					$loading.hide();
					$newImg.show();
				};
			});
			$imgInfo.text(img.file.name + " | " + img.size);
		}catch(e){
			console.log(e.message);
		}
	}

	function cancelOnclickHandler(){
		$showImg.hide();
		$newImg.hide();
		$loading.show();
	}

	function doneOnclickHandler(){
		$showImg.hide();
		uploadList.add(img);
		$newImg.hide();
		$loading.show();
	}

	function deleteOnclickHandler(){
		var imgId = $(this).parent().parent()[0].id;
		uploadList.del(imgId);
	}

	function abortOnclickHandler(){
		var imgId = $(this).parent().parent()[0].id;
		uploadList.uploadQueue.del(imgId);
	}

	function reuploadOnclickHandler(){
		console.log("重新上传");
		var imgId = $(this).parent().parent()[0].id;
		for (var i = uploadList.length - 1; i >= 0; i--) {
			if(uploadList[i].id === imgId){
				$(document).triggerHandler("reupload", uploadList[i]);
				uploadList.uploadQueue.add(uploadList[i]);
				break;
			}
		}
	}

	return {
		"input": input,
		"$showImg": $showImg,
		"$loading": $loading,
		"$newImg": $newImg,
		"$imgInfo": $imgInfo,
		"$cancel": $cancel,
		"$done": $done,
		"$uploadList": $uploadList
	};
}