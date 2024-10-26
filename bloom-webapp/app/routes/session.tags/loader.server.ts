import { LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/api/apiClient";
import { serverError } from "~/utils/responses.server";

export type LoaderData = {
    tags: {
        id: string
        name: string
        color: string
    }[]
}

export async function loader({}: LoaderFunctionArgs) {
    const {
        data: tags,
        error: getTagsError
    } = await apiClient.GET("/api/session/tag/all")

    if (getTagsError) {
        throw serverError()
    }

    return {
        tags
    }
}
