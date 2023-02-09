<script setup>
import { onMounted, reactive, ref } from "vue";
import { ExportCsv } from "../../wailsjs/go/main/App";
import Msg from "./Message.js";
import Modal from "./Modal.js";
import localforage from "localforage";
import { v4 as uuidv4 } from "uuid";
import { uniarr } from "../utils/index";
const dbKey = "WZ-DB-Password";
const fileRef = ref(null);
const modal = reactive({
	active: false,
	show: () => (modal.active = true),
	close: () => (modal.active = false),
});
const state = reactive({
	form: {
		uid: "",
		project: "",
		desc: "",
		acount: "",
		password: "",
	},
	showPwd: false,
	dataSource: [],
});

const initForm = () => {
	getList();
	for (const k in state.form) {
		state.form[k] = "";
	}
};


// 导入csv
const importCsv = () => {
	if (fileRef.value != null) {
		fileRef.value.click();
		fileRef.value.onchange = (e) => {
			const reader = new FileReader();
			reader.onload = function (evt) {
				fileRef.value.value = ""; // 清空
				const res = evt.target.result.split("\r\n");
				const dataSource = [];
				for (let i = 1; i < res.length; i++) {
					const row = res[i].split(",");
					if (row.length < 5) break;
					dataSource.push({
						uid: row[0],
						project: row[1],
						desc: row[2],
						acount: row[3],
						password: row[4],
					});
				}
				state.dataSource = uniarr(dataSource.concat(state.dataSource), "uid");
				saveData("导入成功 !");
			};
			reader.readAsText(fileRef.value.files[0]);
		};
	}
};
// 导出CSV
const exportCsv = async () => {
	const tableRows = [["ID", "项目", "简介", "账户", "密码"]];
	state.dataSource.forEach((item) => {
		const arr = [item.uid, item.project, item.desc, item.acount, item.password];
		tableRows.push(arr);
	});
	await ExportCsv(tableRows);
	// // 构造数据字符，换行需要用\r\n
	// let CsvString = tableRows.map((data) => data.join(",")).join("\r\n");
	// // 加上 CSV 文件头标识
	// CsvString = "data:application/vnd.ms-excel;charset=utf-8,\uFEFF" + encodeURIComponent(CsvString);
	// // 通过创建a标签下载
	// const link = document.createElement("a");
	// link.href = CsvString;
	// // 对下载的文件命名
	// link.download = `密码列表.csv`;
	// link.click();
	// link.remove();
};

// 复制
const copyText = async (pwd) => {
	Msg.breakWarn(!pwd, "复制失败");
	try {
		await navigator.clipboard.writeText(pwd);
		Msg.success("复制成功 !");
	} catch (error) {
		Msg.error("复制失败 !");
	}
};

// 查询所有记录
const getList = async () => {
	const res = await localforage.getItem(dbKey);
	if (res != null) {
		state.dataSource = JSON.parse(res);
	}
};

// 删除一条记录
const delRecord = (idx) => {
	Modal.confirm({
		msg: "确认要删除吗?",
		onOk: () => {
			state.dataSource.splice(idx, 1);
			saveData("删除成功 !");
		},
	});
};

// 添加一条记录
const addRecord = async () => {
	if (state.form.uid) {
		const idx = state.dataSource.findIndex((item) => item.uid == state.form.uid);
		if (idx != -1) state.dataSource[idx] = state.form;
	} else {
		state.form.uid = uuidv4();
		state.dataSource.push(state.form);
	}
	saveData("保存成功 !", modal.close);
};

// 编辑
const editRecord = (item) => {
	state.form = { ...item };
	modal.show();
};

// 保存
const saveData = async (tip = "保存成功 !", call) => {
	try {
		await localforage.setItem(dbKey, JSON.stringify(state.dataSource));
		Msg.success(tip);
		call && call();
		initForm();
	} catch (error) {
		Msg.error("数据存储失败 !");
	}
};

onMounted(getList);
</script>

<template>
	<main class="main">
		<input ref="fileRef" type="file" style="display: none" />
		<div class="card mt-xs">
			<div class="card-header">
				<div class="card-title h5">
					<div class="columns col-gapless">
						<div class="column col-6 text-left">密码列表</div>
						<div class="column col-6 text-right">
							<button @click="importCsv" class="btn"><i class="icon icon-upload"></i> 导入CSV</button>
							<button @click="exportCsv" class="btn m-l-xs"><i class="icon icon-download"></i> 导出CSV</button>
							<button @click="modal.show" class="btn btn-primary m-l-xs"><i class="icon icon-plus"></i> 添加记录</button>
						</div>
					</div>
				</div>
			</div>
			<div class="card-body">
				<table class="table">
					<thead>
						<tr>
							<th>项目</th>
							<th>简介</th>
							<th>账户</th>
							<th>密码</th>
							<th class="text-center">操作</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, idx) in state.dataSource">
							<td>{{ item.project }}</td>
							<td>{{ item.desc }}</td>
							<td>{{ item.acount }}</td>
							<td>
								<button @click="copyText(item.password)" class="btn btn-action btn-sm tooltip" data-tooltip="复制"><i class="icon icon-copy"></i></button>
							</td>
							<td class="text-center">
								<button @click="editRecord(item)" class="btn btn-action btn-sm tooltip" data-tooltip="编辑"><i class="icon icon-edit"></i></button>
								<button @click="delRecord(idx)" class="btn btn-action btn-sm tooltip m-l-xs" data-tooltip="删除"><i class="icon icon-delete"></i></button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="modal" :class="{ active: modal.active }">
			<a @click="modal.close" href="#close" class="modal-overlay" aria-label="Close"></a>
			<div class="modal-container">
				<div class="modal-header">
					<a @click="modal.close" href="#close" class="btn btn-clear float-right" aria-label="Close"></a>
					<div class="modal-title h5">请输入</div>
				</div>
				<div class="modal-body">
					<div class="content text-left">
						<div class="form-group">
							<label class="form-label">项目</label>
							<input v-model="state.form.project" class="form-input" type="text" placeholder="请输入" />
							<label class="form-label">帐号</label>
							<input v-model="state.form.acount" class="form-input" type="text" placeholder="请输入" />
							<label class="form-label">密码</label>
							<div class="has-icon-right">
								<input v-model="state.form.password" :type="state.showPwd ? 'text' : 'password'" class="form-input" placeholder="请输入" />
								<a> <i class="form-icon icon icon-time" @click="() => (state.showPwd = !state.showPwd)"> </i> </a>
							</div>
							<label class="form-label">简介</label>
							<textarea v-model="state.form.desc" class="form-input" placeholder="简介" rows="3"></textarea>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button @click="addRecord" class="btn btn-primary">提交</button>
				</div>
			</div>
		</div>
	</main>
</template>

<style scoped>
.main {
	padding: 10px;
}
.mr-xs {
	margin-right: 5px;
}
.mt-xs {
	margin-top: 10px;
}
</style>
