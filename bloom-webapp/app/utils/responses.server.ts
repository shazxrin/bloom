import { json } from "@remix-run/node";

export const ok = <Data>(data: Data) => {
    return json<Data>(data, 200)
}

export const badRequest = <Data>(data: Data) => {
    return json<Data>(data, 400)
}

export const methodNotAllowed = () => {
    return new Response(null, { status: 405 })
}

export const serverError = () => {
    return new Response(null, { status: 500 })
}
