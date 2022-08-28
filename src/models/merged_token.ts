import { Token } from "@src/models/token";

export type MergedToken = {
  id: number;
  elmType: 'merged';
  content: string;
  parent: Token | MergedToken;
};