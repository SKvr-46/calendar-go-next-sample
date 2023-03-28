import  styles from "styles/calendar.module.scss"
import { ENDPOINT, Schedule, ScheduledDate } from "@/pages"
import { KeyedMutator } from "swr"
import { useState, useEffect } from "react"

type CalendarPropsType = {
    lastDateOfMonth: Date  //指定した年月日の最終日
    mutate:  KeyedMutator<Schedule[]>
    scheduledDate: ScheduledDate[]
}


export const Calendar = (props : CalendarPropsType) => {
    const {lastDateOfMonth, mutate, scheduledDate} = props

    const [schedules, setSchedules] = useState<Schedule[]>([])
    const days = [] 
    
    //31日ある日は、31まで追加する
    for (let i = 1; i <= lastDateOfMonth.getDate(); i++) {
        days.push(i)
    }

    const date = new Date()
    const dayOfMonth = new Date(date.getFullYear(), date.getMonth(), date.getDate())// 日付を取得 (1から31までの数字)
    const month = lastDateOfMonth.getMonth() + 1 // 月を取得 (1から12までの数字)
    const year = lastDateOfMonth.getFullYear() // 年を取得


    const getSchedule = async (values : {year:number, month:number, date:number}) => {
        const updated = await fetch(`${ENDPOINT}/api/schedules/${values.year}/${values.month}/${values.date}`, {
            method: 'GET',
        }).then((r) => r.json())

        console.log(updated); // レスポンスを出力して確認
        console.log(values.year, values.month, values.date)
        //scheduleに、その日の予定のみ格納し、表示するための設定
        setSchedules(updated.filter((s:Schedule) => s.year == values.year && s.date === values.date && s.month === values.month))
        mutate(updated)
    }

    const deleteSchedule = async (values: {year:number, month:number, date:number, id:number}) => {
        const deleted = await fetch(`${ENDPOINT}/api/schedules/${values.year}/${values.month}/${values.date}/${values.id}/delete`, {
        method: 'DELETE',
        }).then((r) => r.json())
        //scheduleに、その日の予定のみ格納し、表示するための設定。deleteなので、配列が空になる、つまりundefindの可能性に対応する。
        const filtered = deleted.filter((s: Schedule | undefined) => s !== undefined)
        setSchedules(filtered.filter((s: Schedule) => s.year === values.year && s.date === values.date && s.month === values.month))
        mutate(filtered)
    }

    const searchDayfromDate = (randomDate: Date) => {
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
        dayArray.push(searchDayfromDate(dateInFirstWeek))
    }


    return (
        <div className={styles.container}>
        <div className={styles.YearAndMonth}>{year}年 {month}月</div>
            <div className={styles.calendarwrapeer}>
                <div className={styles.weeklabel}>
                    {
                        dayArray.map((day, index) => {
                            //1,8,15番目などは1列目
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
                        //4日は１行4列目、15日は3行1列目になるように
                        const row =  Math.floor(index / 7) + 1
                        const col = index % 7 + 1
                        return (
                            
                            <div 
                            key={index} className={styles.day}
                            style={{gridRow: row, gridColumn: col, 
                                    color: dayOfMonth.getFullYear() == year && dayOfMonth.getMonth()+1 == month && dayOfMonth.getDate() == day ? "crimson" : "black",
                                    background: scheduledDate.find(({ year: y, month: m, date: d }) => y === lastDateOfMonth.getFullYear() && m === lastDateOfMonth.getMonth() + 1 && d === day) ? "gold" : "transparent",
                                    borderRadius: "10px",
                                    padding: "0.2em",
                                }}
                            >
                                <a
                                onClick={() => getSchedule({
                                year:lastDateOfMonth.getFullYear(),
                                month:lastDateOfMonth.getMonth() + 1,
                                date:day,
                                }
                                )}
                                >{day}</a>
                            </div>
                        )
                    }
                    )
                }
                </div>
            </div>
            <div className={styles.schedulearea}>
                {
                    schedules.length === 0 ?
                        <p>No schedules</p> :
                    schedules.map((schedule, index) => {
                        return(
                            <li
                            key={index}
                            >
                                <div>
                                    <p>{schedule.year}-{schedule.month}-{schedule.date}</p>
                                    <p>{schedule.title}</p>
                                    <p>{schedule.content}</p>
                                </div>
                                <button
                                type="submit"
                                onClick={() => deleteSchedule({
                                    year: schedule.year,
                                    month: schedule.month,
                                    date: schedule.date,
                                    id: schedule.id,
                                    }
                                    )}>
                                Delete
                                </button>
                            </li>
                        )
                    })
                }
            </div>
        </div>
    )
}