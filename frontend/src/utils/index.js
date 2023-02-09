/**
 * @param {*} arr
 * @param {*} field
 * @return {*}
 * @author: wangqz
 * @description: 根据指定ID去重
 */
export const uniarr = (arr = [], field = "") => {
	const map = new Map();
	return arr.filter((item) => !map.has(item[field]) && map.set(item[field], 0));
};
