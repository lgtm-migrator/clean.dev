import { Auth, CognitoUser } from '@aws-amplify/auth';
import clsx from 'clsx';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../common/components/Button';
import { TextField } from '../common/components/TextField';
import { useAuthenticator } from '../features/users/hooks/useAuthenticator';
import { useMeLazyQuery } from '../graphql/generated';

type SignInModes = 'signin' | 'changepw' | 'success';

interface SignInData {
  username: string;
  password: string;
  newPassword?: string;
}

const SignIn: NextPage = () => {
  const [mode, setMode] = useState<SignInModes>('signin');
  const { setUser } = useAuthenticator();
  const { register, handleSubmit } = useForm<SignInData>();

  const router = useRouter();

  const [me] = useMeLazyQuery();

  const onSubmit = async ({ username, password, newPassword }: SignInData) => {
    switch (mode) {
    case 'signin': {
      const result = await Auth.signIn(username, password) as CognitoUser;
      if (result.challengeName === 'NEW_PASSWORD_REQUIRED') {
        setMode('changepw');
      } else {
        const { data } = await me();
        if (data?.me) {
          setUser({
            contact: {
              city: data.me.contact?.city ?? '',
              company: data.me.contact?.company ?? '',
              country: data.me.contact?.country ?? '',
              email: data.me.contact?.email ?? '',
              firstName: data.me.contact?.firstName ?? '',
              lastName: data.me.contact?.lastName ?? '',
              street: data.me.contact?.street ?? '',
              zip: data.me.contact?.zip ?? '',
            },
          });
          router.push('/');
        }
      }
      break;
    }
    case 'changepw': {
      if(!newPassword) {
        throw new Error('new password is required');
      }
      const user = await Auth.signIn(username, password) as CognitoUser;
      await Auth.completeNewPassword(user, newPassword);
      setMode('success');
      break;
    }
    default:
      break;
    }
  };

  return (
    <div className={clsx([
      'container mx-auto flex flex-col items-center self-center',
    ])}
    >
      {mode === 'changepw' && (
        <p className="p-4 text-center text-teal-900">Your password needs to be changed</p>
      )}
      <form
        className={clsx([
          'flex max-w-max flex-col items-center gap-4 p-20',
          'rounded-lg bg-slate-800 shadow-lg',
        ])}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <TextField
            placeholder="Username"
            type="text"
            {...register('username')}
          />
        </div>
        <div>
          <TextField
            placeholder="Password"
            type="password"
            {...register('password')}
          />
        </div>
        {mode === 'changepw' && (
          <div>
            <TextField
              placeholder="New Password"
              type="password"
              {...register('newPassword')}
            />
          </div>
        )}
        <div>
          <Button type="submit">
            {mode === 'signin' ? 'Sign in' : 'Change password'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
