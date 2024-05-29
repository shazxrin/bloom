import { useLocation } from "@remix-run/react"
import { motion } from "framer-motion"
import classes from "~/components/animation/animated-page.module.css"

type AnimatedPageProps = {
    children: React.ReactNode
}

const AnimatedPage = ({ children }: AnimatedPageProps) => {
    const location = useLocation()

    return (
        <motion.div
            id="animated-page"
            key={ location.pathname }
            className={ classes.page }
            variants={ {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
            } }
            initial="initial"
            animate="animate"
            exit="exit"
            transition={ { duration: 0.5 } }
        >
            { children }
        </motion.div>
    )
}
export default AnimatedPage
