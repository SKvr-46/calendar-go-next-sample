import styles from "styles/button.module.scss"

type ButtonPropsType = {
    onClick: () => void,
    content: string,
}

export const Button = (props:  ButtonPropsType) => {
    const { onClick, content } = props

    return (
        <button
        className={styles.btn}
        onClick={onClick}
        >
            {content}
        </button>
    )

}