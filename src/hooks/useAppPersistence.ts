import { useEffect } from "react";

function useAppPersistence(
    loading: boolean,
    state: any,
    setState: (state: any) => void
) {
    useEffect(() => {
        const saved = localStorage.getItem("freak_data");
        if (saved) {
        setState(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (!loading) {
        localStorage.setItem("freak_data", JSON.stringify(state));
        }
    }, [state, loading]);
}

export default useAppPersistence;