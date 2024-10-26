import { components } from "~/api/api"
import { LoaderFunctionArgs, TypedResponse } from "@remix-run/node"
import apiClient from "~/api/apiClient"
import { ok, serverError } from "~/utils/responses.server"

export type LoaderData = {
    sessionsPage: {
        page: number
        totalPages: number
        items: components["schemas"]["ListSessionDto"][]
    }
    tags: {
        id: string
        name: string
        color: string
    }[]
}

export async function loader({ request }: LoaderFunctionArgs): Promise<TypedResponse<LoaderData>> {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get("page") ?? "1") - 1

    const allSessionsPagePromise = apiClient.GET("/api/session/all", {
        params: {
            query: {
                page: page
            }
        }
    })

    const allSessionTagsPromise = apiClient.GET("/api/session/tag/all");

    const [allSessionsPageResponse, allSessionTagsResponse]
        = await Promise.all([allSessionsPagePromise, allSessionTagsPromise]);

    if (allSessionsPageResponse.error || allSessionTagsResponse.error) {
        throw serverError()
    }

    return ok<LoaderData>({
        sessionsPage: allSessionsPageResponse.data,
        tags: allSessionTagsResponse.data
    })
}
