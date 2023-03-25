import  styles from "styles/calendar.module.scss"

type CalendarPropsType = {
    lastDateOfMonth: Date
}


export const Calender = (props : CalendarPropsType) => {
    const {lastDateOfMonth} = props
    const days = []
    
    for (let i = 1; i <= lastDateOfMonth.getDate(); i++) {
        days.push(i)
    }

    const date = new Date()
    const dayOfMonth = new Date(date.getFullYear(), date.getMonth(), date.getDate())// 日付を取得 (1から31までの数字)
    const month = lastDateOfMonth.getMonth() // 月を取得 (0から11までの数字)
    const year = lastDateOfMonth.getFullYear() // 年を取得 (2018から2021までの数字)


    const serachDayfromDate = (randomDate: Date) => {
        let dayName = ''
        switch(randomDate.getDay()) {
            case 0:
                dayName = '日'
                break
            case 1:
                dayName = '月'
                break
            case 2:
                dayName = '火'
                break
            case 3:
                dayName = '水'
                break
            case 4:
                dayName = '木'
                break
            case 5:
                dayName = '金'
                break
            case 6:
                dayName = '土'
                break
            default:
                dayName = ''
        }
        return dayName
    }  


    const dayArray = []  //月の曜日の並び方を決める配列
    for (let i = 1; i <= 7; i++){
        const dateInFirstWeek = new Date(date.getFullYear(), date.getMonth(), i)
        dayArray.push(serachDayfromDate(dateInFirstWeek))
    }


    return (
        <div className={styles.container}>
        <div className={styles.YearAndMonth}>{year}年 {month + 1}月</div>
            <div className={styles.calendarwrapeer}>
                <div className={styles.weeklabel}>
                    {
                        dayArray.map((day, index) => {
                            const col = index % 7 + 1
                            const setColorOfDay = () => {
                                let color = ''
                                if(day === '日'){
                                    color = 'red'
                                }
                                else if(day === '土'){
                                    color = 'blue'
                                }
                                else {
                                    color = 'black'
                                }
                                return color as string
                            }
                            return (
                                <div 
                                key={index} 
                                className={styles.day}
                                style={{gridColumn: col , color: setColorOfDay()}}
                                >
                                    {day}
                                </div>
                            )
                        })
                    }
                </div>
                <div className={styles.calendar}>
                    {days.map((day, index) => {
                        const row =  Math.floor(index / 7) + 1
                        const col = index % 7 + 1
                        return (
                            
                            <div 
                            key={index} className={styles.day}
                            style={{gridRow: row, gridColumn: col, 
                                //今日の日付で、月が今のものか？
                                //dayOfMonth.getMonth() == monthは、propsであるlastDateOfMonthの月と、今の月が同じかの判定。
                                    color: dayOfMonth.getDate() == day && dayOfMonth.getMonth() == month ? "crimson" : "black"}}
                            >
                                {day}
                            </div>
                        )
                    }
                    )
                }
                </div>
            </div>
        </div>
    )
}