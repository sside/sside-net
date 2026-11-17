export const formatMonthToTwoDigits = (input: number): string =>
    input.toString(10).padStart(2, "0");
