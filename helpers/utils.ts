export const pluralize = (noun: string, count = 0, suffix = "s") =>
  `${count} ${noun}${count !== 1 ? suffix : ""}`;
