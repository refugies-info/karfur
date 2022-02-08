interface Window {
  scrollTo: (arg1: number, arg2: number) => void;
  innerHeight: number;
  addEventListener: (arg1: string, arg2: () => void) => void;
  removeEventListener: (arg1: string, arg2: () => void) => void;
  pageYOffset: number;
  open: (arg1: string, arg2: string) => void;
  location: { href: string, replace: any };
}
