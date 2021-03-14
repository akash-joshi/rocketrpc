export type API = {
  hello: () => string;
  world: () => string;
  sum: (x: number, y: number) => Promise<number>;
  errorFunction: any;
};
