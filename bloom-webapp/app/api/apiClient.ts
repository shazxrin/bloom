import createClient from "openapi-fetch"
import { paths } from "~/api/api"

export default createClient<paths>({ baseUrl: process.env.API_BASE_URL })
