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
  (dispatch) => {
    let errorMessage = JSON.stringify(error);
    const isResponseError = (error: unknown): error is ResponseError => {
      return !!(error as ResponseError);
    };
    if (isResponseError(error) && error.response) {
      errorMessage = error.response.body.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.debug(`error on ${context}`, errorMessage);
    // token can expire on any page, so we need to show an error message on login page.
    // also show any error from login/signup function there
    if (
      errorMessage.includes('TokenExpiredError') ||
      context === loginSignupFunctionErrorCtx
    ) {
      dispatch(logOutAndClearStorage());
      dispatch(loginOrSignupError(errorMessage));
    }
    dispatch(errorLoaded(errorMessage));
  };
