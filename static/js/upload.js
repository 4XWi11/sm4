$(document).ready(function(){
	const ascii_lowercase = "abcdefghijklmnopqrstuvwxyz";
	const ascii_uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const ascii_digits = "0123456789";
	const ascii_printable = "!\"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ ";
    let filename = ""

	function checkCodeValid(_code) {
        if (_code.length < 8) {
            return false;
        }
		let tip1 = 0, tip2 = 0, tip3 = 0, tip4 = 0;
		for (let i in _code) {
			if (ascii_lowercase.indexOf(_code[i]) !== -1) {
				tip1 = 1;
			}
			if (ascii_uppercase.indexOf(_code[i]) !== -1) {
				tip2 = 1;
			}
			if (ascii_digits.indexOf(_code[i]) !== -1) {
				tip3 = 1;
			}
			if (ascii_printable.indexOf(_code[i]) !== -1) {
				tip4 = 1;
			}
		}
		return !!(tip1 && tip2 && tip3 && tip4);

	}

    /* click to encrypt */
    const encFileButton = $("#upload2enc")
	encFileButton.click(function() {
		const pwd = $("#password").val();

		if(pwd === "" || encFileButton.val() === "") {
			alert("请输入密钥和偏移，并选择上传的文件！");
			return false;
		}

		if(!(checkCodeValid(pwd))) {
			alert("输入口令不符合规范！请重新输入");
			return false;
		}

		$.ajax({
            url: "http://127.0.0.1:5000/progress",
				type: "POST",
                data: {"pwd": pwd, "type": "enc"},
				success: function(jsonStr) {
					if(jsonStr.status === "success") {
                        filename = jsonStr.filename;
						alert("加密完成");
					}
					else if(jsonStr.status === "fail") {
						$(".error").text(jsonStr.message);
					}
                    clearInputs();
				},
				error: function() {
					alert("error");
				}
        });
    });

    /* click to decrypt */
    const decFileButton = $("#upload2dec")
	decFileButton.click(function() {
		const pwd = $("#password").val();

		if(pwd === "" || decFileButton.val() === "") {
			alert("请输入密钥和偏移，并选择上传的文件！");
			return false;
		}

		if(!(checkCodeValid(pwd))) {
			alert("输入口令不符合规范！请重新输入");
			return false;
		}

		$.ajax({
            url: "http://127.0.0.1:5000/progress",
				type: "POST",
                data: {"pwd": pwd, "type": "dec"},
				success: function(jsonStr) {
					if(jsonStr.status === "success") {
                        filename = jsonStr.filename;
						alert("解密完成");
					}
					else if(jsonStr.status === "fail") {
						$(".error").text(jsonStr.message);
					}
                    clearInputs();
				},
				error: function() {
					alert("error");
				}
        });
    });

    /* click to download */
    $("#download").click(function() {
        let download_url = "http://127.0.0.1:5000/download/" + filename;
        window.open(download_url);
    });

    /* renew */
	function clearInputs(){
        let upLoadfile = document.getElementById("upLoadfile");
        upLoadfile.reset();
	    $(":text").each(function(){
	        $(this).val("");
		});
	}
});