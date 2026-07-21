import { MOBILE_BREAKPOINT } from "../../lib/constants/constants";
import { useMediaQuery } from "../useMediaQuery/useMediaQuery";

export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);
}
