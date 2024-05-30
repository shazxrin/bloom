import { z } from "zod"
import { notifications } from "@mantine/notifications"
import { IconInputX } from "@tabler/icons-react"
import React from "react"

const parseFormData = async <Schema extends z.ZodTypeAny>(formSchema: Schema, request: Request)  => {
    const formData = await request.formData()
    const formValues = Object.fromEntries(formData.entries())

    const parsedFormValuesResult = formSchema.safeParse(formValues)
    if (!parsedFormValuesResult.success) {
        const errors = new Map(Object.entries(parsedFormValuesResult.error.flatten().fieldErrors))

        notifications.show({
            color: "red",
            title: "Errors in input!",
            message: "Check errors in form and try again.",
            icon: <IconInputX size={ 18 }/>
    })

        return {
            formData: null,
            errors: errors
        }
    }

    return {
        formData: parsedFormValuesResult.data as z.infer<Schema>,
        errors: null
    }
}

export default parseFormData
