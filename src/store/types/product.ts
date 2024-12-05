export interface Product {
    id: number;
    name: string;
    description: string;
    value: number;
    image?: string | null;
    includesShipping: boolean;
    colors?: string[];
  }