const fetcher = async (
    url: string,
    options: RequestInit = {}
) => {
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    if (!res.ok) {
        throw new Error("An error occurred while fetching the data.");
    }

    return res.json();
};

export default fetcher;
