import { useLocation } from "@remix-run/react"
import { motion } from "framer-motion"
import classes from "~/components/animation/animate-page.module.css"

type AnimatePageProps = {
    children: React.ReactNode
}

const AnimatePage = ({ children }: AnimatePageProps) => {
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
export default AnimatePage
