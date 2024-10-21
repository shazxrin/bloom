import { ActionFunctionArgs } from "@remix-run/node"
import { z } from "zod"
import parseFormData from "~/utils/parse-form-data"
import apiClient from "~/api/apiClient"
import { formatToLocalISO } from "~/utils/date-time"
import { addSeconds } from "date-fns"
import { badRequest, methodNotAllowed, ok, serverError } from "~/utils/responses.server"

type ActionDataSuccess = {
    success: true
}
type ActionDataError = {
    success: false
    errors: Record<string, string[] | undefined>
}
export type ActionData =
    {
        action: "create" | "update" | "delete"
    } & (ActionDataSuccess | ActionDataError)

export async function action({ request }: ActionFunctionArgs) {
    if (request.method === "POST") {
        const formSchema = z.object({
            name: z.string().min(1).max(255),
            tagId: z.string().min(1, "Tag cannot be empty"),
            hours: z.coerce.number().min(0).max(23),
            minutes: z.coerce.number().min(0).max(59),
            startDateTime: z.string().datetime()
        })

        const { formData, errors } = await parseFormData(formSchema, request)
        if (errors) {
            return badRequest<ActionData>({
                action: "create",
                success: false,
                errors
            })
        }
        const { name, startDateTime, hours, minutes, tagId } = formData

        const totalDuration = (hours * 3600) + (minutes * 60)
        const { error: postAddSessionError } = await apiClient.POST("/api/session", {
            body: {
                name,
                tagId,
                totalDuration,
                startDateTime: formatToLocalISO(startDateTime),
                endDateTime: formatToLocalISO(addSeconds(startDateTime, totalDuration))
            }
        })

        if (postAddSessionError) {
            throw serverError()
        }

        return ok({
            action: "create",
            success: true
        })
    } else if (request.method === "PUT") {
        const formSchema = z.object({
            id: z.string().min(1, "Id cannot be empty"),
            name: z.string().min(1).max(255),
            tagId: z.string().min(1, "Tag cannot be empty"),
            hours: z.coerce.number().min(0).max(23),
            minutes: z.coerce.number().min(0).max(59),
            startDateTime: z.string().datetime()
        })

        const { formData, errors } = await parseFormData(formSchema, request)
        if (errors) {
            return badRequest<ActionData>({
                action: "update",
                success: false,
                errors
            })
        }
        const { id, name, startDateTime, hours, minutes, tagId } = formData

        const totalDuration = (hours * 3600) + (minutes * 60)
        const { error: postAddSessionError } = await apiClient.PUT("/api/session/{id}", {
            params: {
                path: {
                    id: id
                }
            },
            body: {
                name,
                tagId,
                totalDuration,
                startDateTime: formatToLocalISO(startDateTime),
                endDateTime: formatToLocalISO(addSeconds(startDateTime, totalDuration))
            }
        })

        if (postAddSessionError) {
            throw serverError()
        }

        return ok<ActionData>({
            action: "update",
            success: true
        })
    } else if (request.method === "DELETE") {
        const formSchema = z.object({
            id: z.string().min(1, "Id cannot be empty")
        })

        const { formData, errors } = await parseFormData(formSchema, request)
        if (errors) {
            return ok<ActionData>({
                action: "delete",
                success: false,
                errors
            })
        }
        const { id } = formData

        const { error } = await apiClient.DELETE("/api/session/{id}", {
            params: {
                path: {
                    id
                }
            }
        })

        if (error) {
            throw serverError()
        }

        return ok<ActionData>({
            action: "delete",
            success: true
        })
    } else {
        throw methodNotAllowed()
    }
}
