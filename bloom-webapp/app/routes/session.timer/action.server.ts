import { ActionFunctionArgs, TypedResponse } from "@remix-run/node";
import { z } from "zod";
import parseFormData from "~/utils/parse-form-data";
import apiClient from "~/api/apiClient";
import { badRequest, methodNotAllowed, ok, serverError } from "~/utils/responses.server";

type ActionDataSuccess = {
    success: true
}

type ActionDataError = {
    success: false
    errors: Record<string, string[] | undefined>
}

export type ActionData = {
    action: "create" | "resume" | "pause" | "end" | null
} & (ActionDataSuccess | ActionDataError)

export async function action({ request }: ActionFunctionArgs): Promise<TypedResponse<ActionData>> {
    if (request.method === "POST") {
        const formSchema = z.union([
            z.object({
                action: z.enum(["resume", "pause", "end"]),
            }),
            z.object({
                action: z.literal("create"),
                name: z.string().min(1).max(255),
                hours: z.coerce.number().min(0).max(23),
                minutes: z.coerce.number().min(0).max(59),
                tagId: z.string().min(1)
            })
        ])

        const { formData, errors } = await parseFormData(formSchema, request)
        if (errors) {
            return badRequest<ActionData>({
                action: null,
                success: false,
                errors
            })
        }

        if (formData.action === "create") {
            const { name, hours, minutes, tagId } = formData

            const { error } = await apiClient.POST("/api/session/current/create", {
                body: {
                    name: name,
                    tagId: tagId,
                    totalDuration: (hours * 3600) + (minutes * 60)
                }
            })

            if (error) {
                throw serverError()
            }

            return ok<ActionData>({
                action: "create",
                success: true
            })
        } else if (formData.action === "pause") {
            const { error } = await apiClient.POST("/api/session/current/pause")

            if (error) {
                throw serverError()
            }

            return ok<ActionData>({
                action: "pause",
                success: true
            })
        } else if (formData.action === "resume") {
            const { error } = await apiClient.POST("/api/session/current/resume")

            if (error) {
                throw serverError()
            }

            return ok<ActionData>({
                action: "resume",
                success: true
            })
        } else if (formData.action === "end") {
            const { error } = await apiClient.POST("/api/session/current/end")

            if (error) {
                throw serverError()
            }

            return ok<ActionData>({
                action: "end",
                success: true
            })
        } else {
            return badRequest<ActionData>({
                action: null,
                success: false,
                errors: {
                    action: ["Invalid action."]
                }
            })
        }
    } else {
        return methodNotAllowed()
    }
}
