"use client";

export default function ErrorPage({
    error,
}: {
    error: Error & { digest?: string };
}) {
    return (
        <div className="w-full">
            <h1>Error occurred.</h1>
            <pre>{JSON.stringify(error, null, 4)}</pre>
        </div>
    );
}
