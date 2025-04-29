import { NextResponse, NextRequest } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('access_token')
  // console.log(pathname)
  if (request.nextUrl.pathname.includes('/dashboard')){
    if (token == undefined){
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (request.nextUrl.pathname.includes('/login') || request.nextUrl.pathname.includes('/register')) {
    if (token !== undefined){
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next();
}