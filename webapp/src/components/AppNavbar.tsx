import {
    Group,
    Navbar,
    ThemeIcon,
    UnstyledButton,
    Text,
    useMantineTheme,
} from "@mantine/core";
import {IconHourglass, IconHistory} from "@tabler/icons-react";
import {Link} from "wouter";

interface MainLinkProps {
    icon: React.ReactNode;
    color: string;
    label: string;
    link: string;
}

function MainLink({icon, color, label, link}: MainLinkProps) {
    return (
        <Link to={link} style={{textDecoration: 'none'}}>
            <UnstyledButton
                sx={(theme) => ({
                    display: "block",
                    width: "100%",
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.sm,
                    color:
                        theme.colorScheme === "dark"
                            ? theme.colors.dark[0]
                            : theme.black,

                    "&:hover": {
                        backgroundColor:
                            theme.colorScheme === "dark"
                                ? theme.colors.dark[6]
                                : theme.colors.gray[0],
                    },
                })}
            >
                <Group>
                    <ThemeIcon color={color} variant="filled">
                        {icon}
                    </ThemeIcon>

                    <Text size="sm">{label}</Text>
                </Group>
            </UnstyledButton>
        </Link>
    );
}

interface AppNavBarProps {
    opened: boolean;
}

export default function AppNavBar({opened}: AppNavBarProps) {
    const theme = useMantineTheme();

    const backgroundColor = theme.colors.pink[9];
    const iconSize = 18;
    const iconColor = theme.colors.gray[4];

    return (
        <Navbar
            p="md"
            hiddenBreakpoint="sm"
            hidden={!opened}
            width={{sm: 200, lg: 300}}
        >
            <MainLink
                icon={<IconHourglass color={iconColor} size={iconSize}/>}
                color={backgroundColor}
                label="Timer"
                link="/timer"
            />
            <MainLink
                icon={<IconHistory color={iconColor} size={iconSize}/>}
                color={backgroundColor}
                label="History"
                link="/history"
            />
        </Navbar>
    );
}
