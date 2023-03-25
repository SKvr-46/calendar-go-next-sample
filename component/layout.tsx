import { ReactElement } from "react"
import styles from "styles/layout.module.scss"

export const Layout = ({ children } : { children : ReactElement}) => {

    return (
        <div className={styles.container}>
            {children}
        </div>
    )
}