export const pluralize = (noun: string, count = 0, suffix = "s") =>
  `${count} ${noun}${count !== 1 ? suffix : ""}`;

/**
 * Example:
 * className={
 *   classNames(
 *    agreed ? 'bg-indigo-600' : 'bg-gray-200',
 *    'flex w-8 flex-none cursor-pointer '
 *   )}
 *
 */
export const classNames = (...classes: Array<string>) => {
  return classes.filter(Boolean).join(" ");
};
