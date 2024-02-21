import { Button } from "@mantine/core"
import { useLocation, useNavigate } from "react-router-dom"
import classes from "~/app/root/components/root-nav-button.module.css"

type RootNavButtonProps = {
  icon: React.ReactNode
  label: string
  link: string
}

const RootNavButton = ({ icon, label, link }: RootNavButtonProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  
  return (
    <Button
      leftSection={icon}
      classNames={{ inner: classes.inner }}
      variant={location.pathname === link ? "light" : "subtle"}
      fullWidth
      onClick={() => navigate(link)}
    >
      {label}
    </Button>
  )
}
export default RootNavButton
