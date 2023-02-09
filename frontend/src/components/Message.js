import { v4 as uuidv4 } from "uuid";
const iconType = {
	success: "icon-check",
	warn: "icon-location",
	error: "icon-close",
	info: "icon-mail",
};
export default {
	tip: (type = "info", message = "", duration = 3500) => {
		const uid = uuidv4();
		const msgBox = document.getElementById("wz-message-box");
		if (!msgBox) {
			const msg = document.createElement("div");
			msg.innerHTML = `
      <div id="wz-message-box" class="wz-message">
        <div class="flex-center">
        <div class="wz-message-main" id=${uid}>
          <button class="btn btn-action s-circle btn-sm m-lr-xs"><i class="icon ${iconType[type]} "></i></button>
          ${message}
        </div>
        </div>
      </div> `;
			const body = document.getElementsByTagName("body")[0];
			body.appendChild(msg);
		} else {
			const msgContext = document.createElement("div");
			msgContext.className = "flex-center";
			msgContext.innerHTML = `
      <div class="wz-message-main" id=${uid}>
        <button class="btn btn-action s-circle btn-sm m-lr-xs"><i class="icon ${iconType[type]} "></i></button>
         ${message}
      </div>
      `;
			msgBox.appendChild(msgContext);
		}

		setTimeout(() => {
			document.getElementById(uid).remove();
		}, duration);
	},
	success: function (msg, duration) {
		this.tip("success", msg, duration);
	},
	info: function (msg, duration) {
		this.tip("info", msg, duration);
	},
	error: function (msg, duration) {
		this.tip("error", msg, duration);
	},
	warn: function (msg, duration) {
		this.tip("warn", msg, duration);
	},
	breakWarn(isErr, msg) {
		if (isErr) {
			this.warn(msg);
			throw msg;
		}
	},
};
