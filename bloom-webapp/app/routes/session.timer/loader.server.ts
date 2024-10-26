import { LoaderFunctionArgs, TypedResponse } from "@remix-run/node";
import apiClient from "~/api/apiClient";
import { ok, serverError } from "~/utils/responses.server";

export type LoaderData = {
    currentSession: {
        name: string
        tag: {
            name: string
            color: string
        }
        totalDuration: number
        remainingDuration: number
        status: "RUNNING" | "PAUSED" | "COMPLETED"
        startDateTime: string
        resumeDateTime: string
    } | null,
    tags: {
        id: string,
        name: string,
        color: string
    }[]
}

export async function loader({}: LoaderFunctionArgs): Promise<TypedResponse<LoaderData>> {
    const {
        data: currentSession,
        error: getCurrentSessionError,
        response: getCurrentSessionResponse
    } = await apiClient.GET("/api/session/current")

    if (getCurrentSessionError) {
        throw serverError()
    }

    const {
        data: tags,
        error: getTagsError
    } = await apiClient.GET("/api/session/tag/all")

    if (getTagsError) {
        throw serverError()
    }

    return ok<LoaderData>({
        currentSession: getCurrentSessionResponse.status == 200 ? currentSession : null,
        tags
    })
}
