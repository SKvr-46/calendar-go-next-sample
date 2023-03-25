import { Calender } from "@/component/calendar"
import { Button } from "@/component/button"
import styles from "styles/index.module.scss"
import { useState } from "react"

const Home = () => {

  const date = new Date()
   //+1で次の月。0で先月の最終日=>今月の最終日を取得
  const [lastDateOfMonth, setLastDate] = useState(new Date(date.getFullYear(), date.getMonth() + 1, 0))

  const ToNextMonth = () => {
    setLastDate(new Date(lastDateOfMonth.getFullYear(), lastDateOfMonth.getMonth() + 2, 0))//lastDateから年、月、日を取得
  }

  const ToBackMonth = () => {
    setLastDate(new Date(lastDateOfMonth.getFullYear(), lastDateOfMonth.getMonth(), 0))
  }

  return(
    <div className={styles.homecontainer}>
      <Button
      content={"＜"}
      onClick={() => ToBackMonth()}
      />
      <Calender
      lastDateOfMonth={lastDateOfMonth}
      />
      <Button
      content={"＞"}
      onClick={() => ToNextMonth()}
      />
    </div>

  )
}

export default Home