import { json } from "@remix-run/node";

export const ok = <Data>(data: Data) => {
    return json<Data>(data, 200)
}

export const badRequest = <Data>(data: Data) => {
    return json<Data>(data, 400)
}

export const notFound = () => {
    return new Response(null, { status: 404 })
}

export const methodNotAllowed = () => {
    return new Response(null, { status: 405 })
}

export const forbidden = () => {
    return new Response(null, { status: 403 })
}

export const unauthorized = () => {
    return new Response(null, { status: 401 })
}

export const serverError = () => {
    return new Response(null, { status: 500 })
}
