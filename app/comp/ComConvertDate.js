// Kelas untuk parse tahun bulan dan hari dengan format YYYY-MM-DD
// Author Ari Maulana

class ComConvertDate {
    /**
     * Parse tanggal
     * @param    parsing tanggal
     * @return   date
     */
    parseDate(param) {
        let date = param.date;
        let objDay = date.substring(8, 10);
        let objMonth = date.substring(5, 7);
        let objYear = date.substring(0, 4);
        let _tanggal = objDay;

        if (param.month == 'string') {
            switch(objMonth) {
               case "01": {
                  objMonth = 'Jan';
                  break;
               }
               case "02": {
                  objMonth = 'Feb';
                  break;
               }
               case "03": {
                  objMonth = 'Mar';
                  break;
               }
               case "04": {
                  objMonth = 'Apr';
                  break;
               }
               case "05": {
                  objMonth = 'Mei';
                  break;
               }
               case "06": {
                  objMonth = 'Jun';
                  break;
               }
               case "07": {
                  objMonth = 'Jul';
                  break;
               }
               case "08": {
                  objMonth = 'Aug';
                  break;
               }
               case "09": {
                  objMonth = 'Sep';
                  break;
               }
               case "10": {
                  objMonth = 'Okt';
                  break;
               }
               case "11": {
                  objMonth = 'Nov';
                  break;
               }
               case "12": {
                  objMonth = 'Des';
                  break;
               }
               default: {
                  objMonth = 'N';
                  break;
               }
            }
        }

        if (param.day == 'string') {
            let _gtDate = date.substring(0, 10);
            let _date = new Date(_gtDate);
            let _days = {
                '0':'Minggu',
                '1':'Senin',
                '2':'Selasa',
                '3':'Rabu',
                '4':'Kamis',
                '5':'Jumat',
                '6':'Sabtu',
            };

            objDay = _days[_date.getDay()];

        }

        let rObj = {
               'year' : objYear,
               'month' : objMonth,
               'day'  : objDay,
               'tanggal' : _tanggal,
           };
        return rObj;
    }

    /**
     * Check Network
     * @param    Checking Network
     * @return   Boolean
     */
     netChecker(){

     }
}

export default new ComConvertDate
