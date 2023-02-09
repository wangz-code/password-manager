/*
 * @Author: wangqz
 * @Date: 2023-02-09
 * @LastEditTime: 2023-02-09
 * @Description: content
 */
import { v4 as uuidv4 } from "uuid";
const uid = uuidv4();
let modalShow = false;
export default {
	tip: (option) => {
		let modalBox = document.getElementById(uid);
		if (!modalBox) {
			const modal = document.createElement("div");
			modal.innerHTML = `
			<div class="modal modal-sm active" id=${uid}>
				<a href="#close" class="modal-overlay ${uid + "-cancel"}" aria-label="Close"></a>
				<div class="modal-container">
					<div class="modal-header">
					<a href="#close" class="btn btn-clear float-right ${uid + "-cancel"}" aria-label="Close"></a>
					<div class="modal-title h5">请确认</div>
					</div>
					<div class="modal-body">
					<div class="content">
					${option.msg}
					</div>
					</div>
					<div class="modal-footer">
						<button   class="btn btn-default ${uid + "-cancel"}">取消</button>
						<button id=${uid + "-ok"} class="btn btn-primary">确认</button>
					</div>
				</div>
			</div>
			`;
			const body = document.getElementsByTagName("body")[0];
			body.appendChild(modal);
			modalBox = document.getElementById(uid);
		} else {
			modalBox.classList.add("active");
		}

		document.getElementById(uid + "-ok").onclick = () => {
			option.onOk&&option.onOk()
			modalBox.classList.remove("active");

		};
		const cancelDom = document.getElementsByClassName(uid + "-cancel");
		for (let i = 0; i < cancelDom.length; i++) {
			cancelDom[i].onclick = () => {
				option.onCancel&&option.onCancel()
				modalBox.classList.remove("active");
			};
		}
	},
	confirm: function (opt) {
		this.tip(opt);
	},
};
