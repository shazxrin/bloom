export const badRequest = () => {
    return new Response("Bad Request", { status: 400 })
}

export const notFound = () => {
    return new Response("Not Found", { status: 404 })
}

export const methodNotAllowed = () => {
    return new Response("Method Not Allowed", { status: 405 })
}

export const forbidden = () =>{
    return new Response("Forbidden", { status: 403 })
}

export const unauthorized = () => {
    return new Response("Unauthorized", { status: 401 })
}

export const serverError = () => {
    return new Response("Server Error", { status: 500 })
}
