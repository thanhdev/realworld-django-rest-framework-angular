export interface FeedMenu {
  id: FeedMenuEnum;
  name: string;
  isActive: boolean
}

export enum FeedMenuEnum {
  MINE = 'mine',
  GLOBAL = 'global',
  FAVORITES = 'favorites',
  TAGS = 'tags'
}
