
import { AuthService } from './authService';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export class AuthController {
    static requireAuth(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void {
        if (!AuthService.isAuthenticated()) {
            next('/login');
        } else {
            next();
        }
    }
}
