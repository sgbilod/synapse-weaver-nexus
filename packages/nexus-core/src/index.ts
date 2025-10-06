export interface EconomicDirective {
  id: string;
  description: string;
  priority: number;
}

export const registerDirective = (
  directive: EconomicDirective
): EconomicDirective => {
  return { ...directive };
};
