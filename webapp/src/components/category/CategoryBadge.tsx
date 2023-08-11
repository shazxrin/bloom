import {Badge, Text, useMantineTheme} from "@mantine/core"
import tinycolor from "tinycolor2"


interface CategoryBadgeProps {
    name: string
    color: string
}

export default function CategoryBadge({name, color}: CategoryBadgeProps) {
    const theme = useMantineTheme()

    return (
        <Badge sx={{
            color: tinycolor(color).isLight() ? theme.colors.gray[8] : theme.colors.gray[3],
            backgroundColor: color
        }}>
            <Text maw={75} truncate={"end"}>{name}</Text>
        </Badge>
    )
}