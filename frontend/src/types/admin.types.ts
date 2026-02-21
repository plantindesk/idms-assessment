
export interface Admin {
  _id: string;
  userName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  userName: string;
  email: string;
  password: string;
}
