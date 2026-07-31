export type WorkKind = "Art" | "Photo";

export type Work = {
  title: string;
  year: string;
  category: string;
  kind: WorkKind;
  src: string;
  alt: string;
};
