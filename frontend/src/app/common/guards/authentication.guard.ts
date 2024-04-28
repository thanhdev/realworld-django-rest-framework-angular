import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { inject } from "@angular/core";
import { AuthenticationService } from "../services/utils/authentication.service";

export const authenticationGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  if (authService.currentUserToken) {
    return true;
  } else {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } })
  }
};

export const constructLoginUrlTree: (router: Router) => UrlTree = (router) => {
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: router.url } });
}
