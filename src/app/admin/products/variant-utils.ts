// /**
//  * Given a list of options like [{name:"Size", values:["SM","M"]}, {name:"Color", values:["Red"]}],
//  * generates every combination: [{Size:"SM",Color:"Red"}, {Size:"M",Color:"Red"}].
//  * This is what auto-builds the variant rows whenever the admin edits options.
//  */
// export function generateVariantCombinations(
//   options: { name: string; values: string[] }[]
// ): Record<string, string>[] {
//   const validOptions = options.filter((o) => o.name.trim() && o.values.some((v) => v.trim()));

//   if (validOptions.length === 0) {
//     return [{}]; // no options -> exactly one variant with no option values
//   }

//   let combinations: Record<string, string>[] = [{}];

//   for (const option of validOptions) {
//     const values = option.values.filter((v) => v.trim());
//     const next: Record<string, string>[] = [];
//     for (const combo of combinations) {
//       for (const value of values) {
//         next.push({ ...combo, [option.name]: value });
//       }
//     }
//     combinations = next;
//   }

//   return combinations;
// }

// /** A stable string key for a combination, used to match old variant data
//  *  (price/stock the admin already entered) against newly regenerated
//  *  combinations, so editing one option doesn't wipe every price/stock. */
// export function combinationKey(combo: Record<string, string>): string {
//   return Object.entries(combo)
//     .sort(([a], [b]) => a.localeCompare(b))
//     .map(([k, v]) => `${k}:${v}`)
//     .join("|");
// }









/**
 * Given a list of options like [{name:"Size", values:["SM","M"]}, {name:"Color", values:["Red"]}],
 * generates every combination: [{Size:"SM",Color:"Red"}, {Size:"M",Color:"Red"}].
 * This is what auto-builds the variant rows whenever the admin edits options.
 */
export function generateVariantCombinations(
  options: { name: string; values: string[] }[]
): Record<string, string>[] {
  const validOptions = options.filter((o) => o.name.trim() && o.values.some((v) => v.trim()));

  if (validOptions.length === 0) {
    return [{}]; // no options -> exactly one variant with no option values
  }

  let combinations: Record<string, string>[] = [{}];

  for (const option of validOptions) {
    const values = option.values.filter((v) => v.trim());
    const next: Record<string, string>[] = [];
    for (const combo of combinations) {
      for (const value of values) {
        next.push({ ...combo, [option.name]: value });
      }
    }
    combinations = next;
  }

  return combinations;
}

// /** A stable string key for a combination, used to match old variant data
//  *  (price/stock the admin already entered) against newly regenerated
//  *  combinations, so editing one option doesn't wipe every price/stock. */
// export function combinationKey(combo: Record<string, string>): string {
//   return Object.entries(combo)
//     .sort(([a], [b]) => a.localeCompare(b))
//     .map(([k, v]) => `${k}:${v}`)
//     .join("|");
// }


/** A stable string key for a combination, used to detect duplicate
 *  variants (e.g. two variants both being "Color: Black / Size: SM")
 *  and to match old variant data (price/stock the admin already
 *  entered) if a variant's option values get edited elsewhere. */
export function combinationKey(combo: Record<string, string>): string {
  return Object.entries(combo)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join("|");
}


