import { Button } from "@mantine/core"
import React from "react"
import { Link, useLocation } from "@remix-run/react"
import classes from "~/components/root/root-nav-button.module.css"

type RootNavButtonProps = {
    to: string
    label: string
    icon: React.ReactNode
}

const RootNavButton = ({ to, label, icon }: RootNavButtonProps) => {
    const location = useLocation()

    return (
        <Button
            leftSection={ icon }
            classNames={ { inner: classes.inner } }
            variant={ location.pathname === to ? "light" : "subtle" }
            component={ Link }
            to={ to }
            fullWidth
        >
            { label }
        </Button>
    )
}

export default RootNavButton
