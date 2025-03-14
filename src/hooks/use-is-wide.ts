import { useMedia } from "react-use";

export const useLayoutWide = () =>
    useMedia('(min-width: 480px)')
