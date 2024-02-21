import { AppShell, Group, Image, Burger, ScrollArea, Stack } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconLayoutDashboard, IconClock, IconHistory } from "@tabler/icons-react"
import { Outlet } from "react-router-dom"
import RootNavButton from "~/app/root/components/root-nav-button"

const RootPage = () => {
  const [opened, { toggle }] = useDisclosure()

  return (
    <AppShell
      h="100vh"
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
    >
      <AppShell.Header px="lg" py="md">
        <Group align="center">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Image w={100} src={"/bloom_full.svg"} />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow component={ScrollArea}>
          <Stack gap={4}>
            <RootNavButton
              icon={<IconLayoutDashboard size={18} />}
              label="Dashboard"
              link="/"
            />
            <RootNavButton
              icon={<IconClock size={18} />}
              label="Timer"
              link="/timer"
            />
            <RootNavButton
              icon={<IconHistory size={18} />}
              label="History"
              link="/history"
            />
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main w={"100%"} h={"100%"}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
export default RootPage
