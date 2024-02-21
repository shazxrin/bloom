import createClient from "openapi-fetch"
import { paths } from "~/api/schema"

const client = createClient<paths>({ baseUrl: `${window.location.origin}` })
export default client
