import {Badge, Center, Group, Text, useMantineTheme} from "@mantine/core";
import {IconArrowRight} from "@tabler/icons-react";
import tinycolor from "tinycolor2";

interface TimerLabelProps {
    hasTask: boolean;
    taskName: string;
    categoryName: string;
    categoryColor: string;
}

export default function TimerLabel({
                                       hasTask,
                                       taskName,
                                       categoryName,
                                       categoryColor
                                   }: TimerLabelProps) {
    const theme = useMantineTheme()

    return (
        <Center>
            <Group align={"center"}>
                {hasTask &&
                    <>
                        <Badge sx={{
                            color: tinycolor(categoryColor).isLight() ? theme.colors.gray[8] : theme.colors.gray[3],
                            backgroundColor: categoryColor
                        }}>
                            {categoryName}
                        </Badge>
                        <IconArrowRight size={18}></IconArrowRight>
                    </>}


                <Text color={theme.colors.gray[6]} size={"sm"}>
                    {hasTask ? taskName : "No current task"}
                </Text>
            </Group>
        </Center>
    );
}