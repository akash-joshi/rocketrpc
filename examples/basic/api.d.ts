export type API = {
  hello: () => string;
  sum: (x: number, y: number) => number;
  listFiles: () => {
    stdout: string | Buffer;
    stderr: string | Buffer;
  };
  searchMovie: (movieName: string, page?: number) => Promise<any>;
  errorFunction: any;
};
