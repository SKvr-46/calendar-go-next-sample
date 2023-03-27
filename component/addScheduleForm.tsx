import styles from "styles/addScheduleForm.module.scss"
import { ENDPOINT, Schedule } from "@/pages"
import useSWR, { KeyedMutator } from "swr"
import { useForm } from "@mantine/form"
import { useState } from "react"

export const AddScheduleForm = ({mutate} : {mutate :  KeyedMutator<Schedule[]>}) => {

    const [formIsOpen, setFormIsOpen] = useState(false)

    const form = useForm({
        initialValues: {
            year: "",
            month: "",
            date: "",
            title: "",
            content: "",
        },
    })

    const createSchedule = async (values : {
                                    year: number | string,
                                    month: number | string, 
                                    date: number | string,
                                    title: string,
                                    content: string,
                                        }) => {
        const updated = await fetch(`${ENDPOINT}/api/schedules`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                year: Number(values.year), //JSONでint型として渡すためにNumberに変換
                month: Number(values.month),
                date: Number(values.date),
                title: values.title,
                content: values.content
            })
        }).then((r) => r.json())

        mutate(updated)
        form.reset()
    }

    const toggleForm = () => setFormIsOpen(!formIsOpen)

    return (
        <div className={styles.formcontainer}>
            <button 
            className={formIsOpen ? styles.openedbtn : styles.closedbtn}
            onClick={() => toggleForm()}
            >＋</button>
            <form 
            onSubmit={form.onSubmit(createSchedule)}
            className={formIsOpen ? styles.openedform : styles.closedform}
            >
                <label>
                    Year <br/>
                    <input {...form.getInputProps("year")} />
                </label>
                <label>
                    Month <br/>
                    <input {...form.getInputProps("month")} />
                </label>
                <label>
                    Date <br/>
                    <input {...form.getInputProps("date")} />
                </label>
                <label>
                    Title <br/>
                    <input {...form.getInputProps("title")} />
                </label>
                <label>
                    Content <br/>
                    <textarea {...form.getInputProps("content")} />
                </label>
                <button type="submit" className={styles.createbutton}>Create</button>
            </form>
        </div>
    )
}