import {useMediaQuery} from "@mantine/hooks"

export default function useMobile() {
    return useMediaQuery("(min-width: 320px) and (max-width: 480px)")
}
