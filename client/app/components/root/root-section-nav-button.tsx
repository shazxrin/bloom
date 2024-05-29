import { Box, Button, Collapse, Stack } from "@mantine/core"
import React from "react"
import { useDisclosure } from "@mantine/hooks"
import { IconChevronDown, IconChevronLeft } from "@tabler/icons-react"
import classes from "~/components/root/root-section-nav-button.module.css"

type RootSectionNavButtonProps = {
    label: string
    icon: React.ReactNode
    children: Array<React.ReactNode>
}

const RootSectionNavButton = ({ label, icon, children }: RootSectionNavButtonProps) => {
    const [opened, { toggle }] = useDisclosure(true)

    return (
        <Box>
            <Button
                leftSection={ icon }
                rightSection={ opened ? <IconChevronDown size={ 16 }/> : <IconChevronLeft size={ 16 }/> }
                classNames={ { inner: classes.inner, label: classes.label } }
                variant={ "subtle" }
                onClick={ toggle }
                fullWidth
            >
                { label }
            </Button>

            <Collapse in={ opened } ml={ "sm" } mt={ 4 }>
                <Stack gap={ 0 }>
                    { children.map((child, index) => (
                        <Box className={ classes.wrapper } key={ index }>
                            { child }
                        </Box>
                    )) }
                </Stack>
            </Collapse>
        </Box>
    )
}

export default RootSectionNavButton
