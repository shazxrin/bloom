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
    action: "create" | "update" | "delete"
} & (ActionDataSuccess | ActionDataError)

export async function action({ request }: ActionFunctionArgs): Promise<TypedResponse<ActionData>> {
    if (request.method === "POST") {
        const formSchema = z.object({
            name: z.string().min(1).max(255),
            color: z.string().startsWith("#").length(7),
        })

        const { formData, errors } = await parseFormData(formSchema, request)
        if (errors) {
            return badRequest<ActionData>({
                action: "create",
                success: false,
                errors
            })
        }
        const { name, color } = formData

        const { error } = await apiClient.POST("/api/session/tag", {
            body: {
                name,
                color
            }
        })

        if (error) {
            throw serverError()
        }

        return ok<ActionData>({
            action: "create",
            success: true
        })
    } else if (request.method === "PUT") {
        const formSchema = z.object({
            id: z.string().min(1),
            name: z.string().min(1).max(255),
            color: z.string().startsWith("#").length(7)
        })

        const { formData, errors } = await parseFormData(formSchema, request)
        if (errors) {
            return badRequest<ActionData>({
                action: "update",
                success: false,
                errors
            })
        }
        const { id, name, color } = formData

        const { error } = await apiClient.PUT("/api/session/tag/{id}", {
            params: {
                path: {
                    id
                }
            },
            body: {
                name,
                color
            }
        })

        if (error) {
            throw serverError()
        }

        return ok<ActionData>({
            action: "update",
            success: true
        })
    } else if (request.method === "DELETE") {
        const formSchema = z.object({
            id: z.string()
        })

        const { formData, errors } = await parseFormData(formSchema, request)
        if (errors) {
            return badRequest<ActionData>({
                action: "delete",
                success: false,
                errors
            })
        }
        const { id } = formData

        const { error } = await apiClient.DELETE("/api/session/tag/{id}", {
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
