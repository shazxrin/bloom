import { z } from "zod"

const parseFormData = async <Schema extends z.ZodTypeAny>(formSchema: Schema, request: Request)  => {
    const formData = await request.formData()
    const formValues = Object.fromEntries(formData.entries())

    const parsedFormValuesResult = formSchema.safeParse(formValues)
    if (!parsedFormValuesResult.success) {
        const errors: Record<string, string[] | undefined> = parsedFormValuesResult.error.flatten().fieldErrors

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
