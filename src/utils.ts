export function compact(arr: (string | null)[]): string[] {
  return arr.filter((el) => el !== null) as string[]
}
