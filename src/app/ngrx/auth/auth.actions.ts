import { createAction, props } from '@ngrx/store';

export const showAuthOverlay = createAction("[Login Component] Show Overlay");
export const hideAuthOverlay = createAction("[Login Component] Hide Overlay");
export const resetStatus = createAction("[Login Component] Reset Status");

export const loginRequest = createAction(
  "[Auth Component] Login Request",
  props<{ 
    requestBody: AuthCredentials,
    endpoint: "/login"
  }>()
);
export const loginSuccess = createAction(
  "[Auth Component] Login Success",
  props<{ customer: Customer }>()
);

export const signupRequest = createAction(
  "[Auth Component] Signup Request",
  props<{ 
    requestBody: AuthCredentials,
    endpoint: "/signup"
  }>()
);
export const signupSuccess = createAction(
  "[Auth Component] Signup Success",
  props<{ customer: Customer }>()
);

export const logoutRequest = createAction("[Auth Component] Logout");
export const logoutSuccess = createAction(
  "[Auth Component] Logout Success",
  props<{ msg: string }>()
);