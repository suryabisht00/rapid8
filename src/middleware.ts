import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  // Add more protected routes as needed
];

// Routes that require specific roles
const roleBasedRoutes: { [key: string]: string[] } = {
  '/admin': ['admin'],
  '/admin/users': ['admin'],
  // Add more role-based routes as needed
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Get the role-based access requirements for the current route
  let requiredRoles: string[] = [];
  for (const route in roleBasedRoutes) {
    if (pathname.startsWith(route)) {
      requiredRoles = roleBasedRoutes[route];
      break;
    }
  }
  
  // If either protected or role-based, check authentication
  if (isProtectedRoute || requiredRoles.length > 0) {
    // Get auth token from cookies
    const authToken = request.cookies.get('authToken')?.value;
    const userRole = request.cookies.get('userRole')?.value;
    
    // If no auth token, redirect to sign in
    if (!authToken) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    
    // If role-based route, check if user has required role
    if (requiredRoles.length > 0 && userRole) {
      if (!requiredRoles.includes(userRole)) {
        // User doesn't have the required role, redirect to unauthorized page
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|signin|signup).*)',
  ],
};
