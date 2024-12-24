export const SketchError = (error: unknown) => {
    if (error instanceof Error) {
        return <p>An error occured: {error.message}</p>
    }

    return <p>An unknown error occured: {JSON.stringify(error)}</p>
}
