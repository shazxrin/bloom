import {Transition} from "react-transition-group";
import React, {useRef} from "react";
import {Box} from "@mantine/core";

const duration = 300

const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
}

const transitionStyles = {
    entering: { opacity: 1 },
    entered:  { opacity: 1 },
    exiting:  { opacity: 0 },
    exited:  { opacity: 0 },
    unmounted: { opacity: 0 }
}

interface FadeTransitionProps {
    trigger: boolean
    children: React.ReactNode
}

const FadeTransition = ({trigger, children}: FadeTransitionProps) => {
    const nodeRef = useRef(null)

    return (
       <Transition in={trigger} nodeRef={nodeRef} timeout={duration}>
           {(state) =>
               <Box ref={nodeRef} w={"100%"} h={"100%"} style={{
                    ...defaultStyle,
                    ...transitionStyles[state]
               }}>
                   {children}
               </Box>
           }
       </Transition>
    )
}

export default FadeTransition
