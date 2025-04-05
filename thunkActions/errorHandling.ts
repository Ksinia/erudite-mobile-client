// import { ResponseError } from 'superagent';
import { MyThunkAction } from "@/reducer/types";
import {
  errorLoaded,
  ErrorLoadedAction,
  logOutAndClearStorage,
  LogOutAction,
} from "@/reducer/auth";
import { loginOrSignupError, LoginOrSignupErrorAction } from "@/reducer/error";

interface HTTPError extends Error {
  status: number;
  text: string;
  method: string;
  path: string;
}

interface Response extends NodeJS.ReadableStream {
  accepted: boolean;
  badRequest: boolean;
  body: any;
  charset: string;
  clientError: boolean;
  error: false | HTTPError;
  files: any;
  forbidden: boolean;
  get(header: string): string;
  get(header: "Set-Cookie"): string[];
  header: { [index: string]: string };
  headers: { [index: string]: string };
  info: boolean;
  links: Record<string, string>;
  noContent: boolean;
  notAcceptable: boolean;
  notFound: boolean;
  ok: boolean;
  redirect: boolean;
  serverError: boolean;
  status: number;
  statusCode: number;
  statusType: number;
  text: string;
  type: string;
  unauthorized: boolean;
  xhr: any;
  redirects: string[];
}


interface ResponseError extends Error {
  status?: number | undefined;
  response?: Response | undefined;
  timeout?: boolean | undefined;
}


export const loginSignupFunctionErrorCtx = 'loginSignupFunction';


export const errorFromServer =
  (
    error: unknown,
    context: string
  ): MyThunkAction<
    LogOutAction | ErrorLoadedAction | LoginOrSignupErrorAction
  > =>
  async (dispatch) => {
    let errorMessage = "An unknown error occurred";
    
    // Handle Response objects from fetch
    if (error instanceof Response) {
      try {
        const errorData = await error.json();
        errorMessage = errorData.message || `Error ${error.status}: ${error.statusText}`;
      } catch {
        errorMessage = `Error ${error.status}: ${error.statusText}`;
      }
    } 
    // Handle regular Errors
    else if (error instanceof Error) {
      errorMessage = error.message;
    }
    // Handle any other type of error as string
    else if (typeof error === 'string') {
      errorMessage = error;
    }
    // Last resort, stringify the object
    else {
      try {
        errorMessage = JSON.stringify(error);
      } catch {
        errorMessage = "Unknown error format";
      }
    }

    console.debug(`Error on ${context}:`, errorMessage);
    
    // Token expired errors or login/signup errors
    if (
      (typeof errorMessage === 'string' && errorMessage.includes('TokenExpiredError')) ||
      context === loginSignupFunctionErrorCtx
    ) {
      if (errorMessage.includes('TokenExpiredError')) {
        dispatch(logOutAndClearStorage());
      }
      dispatch(loginOrSignupError(errorMessage));
    }
    
    dispatch(errorLoaded(errorMessage));
  };
