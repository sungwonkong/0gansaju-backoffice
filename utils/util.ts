const util = {
  getDiffDay: (Dday: any) => {
    const now = new Date();
    let returnValue = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    const _second = 1000;
    const _minute = _second * 60;
    const _hour = _minute * 60;
    const _day = _hour * 24;

    const distDt = Dday - now;

    returnValue["days"] = Math.floor(distDt / _day);
    returnValue["hours"] = Math.floor((distDt % _day) / _hour);
    returnValue["minutes"] = Math.floor((distDt % _hour) / _minute);
    returnValue["seconds"] = Math.floor((distDt % _minute) / _second);

    return returnValue;
  },

  getDigitNumber: (props: Number) => {
    const returnValue = "";
    console.log(props);
    //const num2str = props.toString();
    //const returnValue = [...props.toString()];
    return returnValue;
  },

  //UNIX timestamp 변환
  getDateFromTimestamp: (t: any) => {
    var date = new Date(t * 1000);
    var year = date.getFullYear();
    var month = "0" + (date.getMonth() + 1);
    var day = "0" + date.getDate();
    var hour = "0" + date.getHours();
    var minute = "0" + date.getMinutes();
    var second = "0" + date.getSeconds();
    //return year + "-" + month.substr(-2) + "-" + day.substr(-2) + " " + hour.substr(-2) + ":" + minute.substr(-2) + ":" + second.substr(-2);
    var convertDate = year + month.substr(-2) + day.substr(-2);
    return convertDate;
  },

  sortJSON: (data: any, key: any, type: any) => {
    if (type == undefined) {
      type = "asc";
    }
    return data.sort(function (a: any, b: any) {
      var x = a[key];
      var y = b[key];
      if (type == "desc") {
        return x > y ? -1 : x < y ? 1 : 0;
      } else if (type == "asc") {
        return x < y ? -1 : x > y ? 1 : 0;
      }
    });
  },
};

export default util;
