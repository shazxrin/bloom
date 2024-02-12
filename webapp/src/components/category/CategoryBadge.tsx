import {Badge, Text} from "@mantine/core"


interface CategoryBadgeProps {
    name: string
    color: string
}

export default function CategoryBadge({name, color}: CategoryBadgeProps) {
    return (
        <Badge autoContrast color={color}>
            <Text maw={75} truncate={"end"} size="sm">{name}</Text>
        </Badge>
    )
}