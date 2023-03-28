import { Calendar } from "@/component/calendar"
import { Button } from "@/component/button"
import { AddScheduleForm } from "@/component/addScheduleForm"
import styles from "styles/index.module.scss"
import { useState, useEffect } from "react"
import useSWR from "swr"


export const ENDPOINT = "http://localhost:4000"
const fetcher = (url:string) => fetch(`${ENDPOINT}/${url}`).then((r) => r.json())

export interface Schedule {
  id : number
  year: number
  month: number
	date: number
	title: string
	content: string
}

export interface ScheduledDate {
  year: number
  month: number
	date: number
}


const Home = () => {

  const { data, mutate } = useSWR<Schedule[]>("api/schedules", fetcher)

  //予定のある年月日を格納する配列
  const [scheduledDate, setScheduledDate] = useState<ScheduledDate[]>([])



  //Schedule から年月日の情報のみ取り出し、１つのオブジェクトにする
  useEffect(() => {
    if (data && data.length >= 0) {
      const mappedData = data.map(({ year, month, date }) => ({ year, month, date }))
      setScheduledDate(mappedData)
      console.log("data", data)
      console.log("mapped", mappedData)
      console.log("scheduledDate", scheduledDate)
    }
    console.log(data)
  }, [data])


  const date = new Date()

   //+1で次の月。0で先月の最終日=>今月の最終日を取得 lastDateOfMonth.getMonth()は現在より1つ小さいことに注意。
  const [lastDateOfMonth, setLastDate] = useState(new Date(date.getFullYear(), date.getMonth() + 1, 0))

  const ToNextMonth = () => {
    setLastDate(new Date(lastDateOfMonth.getFullYear(), lastDateOfMonth.getMonth() + 2, 0))//lastDateから年、月、日を取得
  }

  const ToBackMonth = () => {
    setLastDate(new Date(lastDateOfMonth.getFullYear(), lastDateOfMonth.getMonth(), 0))
  }

  return(
    <div className={styles.homecontainer}>
      <div className={styles.calendarcontainer}>
      <Button
      content={"＜"}
      onClick={() => ToBackMonth()}
      />
      <Calendar
      lastDateOfMonth={lastDateOfMonth}
      mutate={mutate}
      scheduledDate={scheduledDate}
      />
      <Button
      content={"＞"}
      onClick={() => ToNextMonth()}
      />
      </div>
      <div className={styles.addschedulecontainer}>
      <AddScheduleForm
      mutate={mutate}
      />
      </div>
    </div>

  )
}

export default Home