export type AccessToken = {
  access_token: string,
  token_type: string,
}

export type DiscussionThreadProps = {
  id: number;
  title: string;
  content: string;
  author: string;
  imagePath: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};

export type FetchError = {
  detail: string
}