/**
 * Created by Administrator on 2019/8/15.
 */
import moment from 'moment'
//时间格式化
export function dateFormat(row, column) {
  var date = row[column.property];
  if (date == undefined) {
    return "";
  }
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
}
