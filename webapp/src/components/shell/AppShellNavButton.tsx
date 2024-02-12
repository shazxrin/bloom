import { Button } from "@mantine/core"
import { useLocation } from "wouter"
import classes from "~/components/shell/AppShellNavButton.module.css"

interface AppShellNavButtonProps {
  icon: React.ReactNode
  label: string
  link: string
}

export default function AppShellNavButton({ icon, label, link }: AppShellNavButtonProps) {
  const [location, setLocation] = useLocation()
  
  return (
    <Button
      leftSection={icon}
      classNames={{ inner: classes.inner }}
      variant={location === link ? "light" : "subtle"}
      fullWidth
      onClick={() => setLocation(link)}
    >
      {label}
    </Button>
  )
}
