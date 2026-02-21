
import { IAdmin } from "./admin.types";

declare global {
  namespace Express {
    interface Request {
      /**
       * Populated by authMiddleware after successful JWT verification.
       * Contains the full Admin document (minus password).
       */
      admin?: IAdmin;
    }
  }
}

export { };
