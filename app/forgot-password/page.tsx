'use client';
import { useState } from 'react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from "firebase/auth";
import { redirect } from 'next/navigation';
import router from 'next/router';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const resetEmail = () => {
    sendPasswordResetEmail(auth, email,);
    
  };

  return (
    <>
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2
          className="mt-10 text-cent mb-3 text-blue-500 text-center text-8xl font-bold leading-9 tracking-tight "
          >teillo.</h2>
          <h2 className="mt-10 text-center text-xl font-bold leading-9 tracking-tight ">
            Forgot Password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 ">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-md border-0  py-1.5 shadow-sm ring-1 ring-inset ring-blue-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                onClick={() => {resetEmail(),
                  router.push('signin')
                }}
                disabled={!email}
                className="disabled:opacity-40 flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                Send Forgot Password Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
